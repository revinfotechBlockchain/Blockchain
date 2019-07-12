var config = require('config.json');
var Q = require('q');
var RPC = require('../coin_rpc');
var _ = require('lodash');
var bitcore = require('bitcore-lib');
var axios = require('axios');
var dash_rpc = new RPC.CoinRPC(config.nodeServer.dash.rpc, {auth: config.nodeServer.dash.rpcAuth});
var service = {};
//     ____             __       ___    ____  ____
//    / __ \____ ______/ /_     /   |  / __ \/  _/
//   / / / / __ `/ ___/ __ \   / /| | / /_/ // /
//  / /_/ / /_/ (__  ) / / /  / ___ |/ ____// /
// /_____/\__,_/____/_/ /_/  /_/  |_/_/   /___/
//
/*
*  All the serveices methods
*/
service.newAccount = newAccount;
service.getBalance = getBalance;
service.getFee = getFee;
service.transfer = transfer;
service.listTransactionsByAddress = listTransactionsByAddress;
service.importPrivkey = importPrivkey;
service.validateAddress = validateAddress;
service.checkStatus = checkStatus;

module.exports = service;
/**
* Function to generate new account
*/
function newAccount() {
	let deferred = Q.defer();
	let res = {
		address: null,
		pk: null
	}
	dash_rpc.call('getnewaddress', []).then(address => {
		res.address = address;
		return dash_rpc.call('dumpprivkey', [res.address]);
	}).then(pk => {
		res.pk = pk;
		return dash_rpc.call('validateaddress', [res.address]);
	}).then(validation => {
		if (validation.isvalid == true) {
			deferred.resolve(res);
		} else {
			deferred.reject('Created the invalid address.');
		}
	}).catch(err => {
		deferred.reject(err.message);
	});

	return deferred.promise;
}

/*
* Function to get balance of the account
*/
function getBalance(address) {

	let deferred = Q.defer();

	if (!address) {
		deferred.reject('Invalid Address!');
	}

	dash_rpc.call('listunspent', []).then(txs => {
		let balance = 0;
		if (Array.isArray(txs) && txs.length > 0) {
			_.each(txs, (tx) => {
				if (tx.address == address) {
					balance += tx.amount;
				}
			});
		}
		deferred.resolve({balance: balance, locked_balance: 0});
	}).catch(err => {
		deferred.reject(err.message);
	})

	return deferred.promise;
}

/*
* Function to transfer the funds from one account to another
*/
async function transfer(pk, fromAddress, toAddress, amount) {
	let deferred = Q.defer();
	amount = parseFloat(amount);
	let fee = await getFee();
	if (!pk || !fromAddress || !toAddress) {
		deferred.reject('Bad request!');
	}
	await dash_rpc.call('settxfee', [fee]).then(() => {
		return dash_rpc.call('listunspent', []);
	}).then(txs => {
		// let untx = [];
		let tx_obj = [];
		let addr_amount_obj = {};
		let balance = 0;
		if (Array.isArray(txs) && txs.length > 0) {

			_.each(txs, (tx) => {
				if (tx.address == fromAddress) {
					balance = balance + tx.amount;
					tx_obj.push({"txid": tx.txid, "vout": tx.vout});
					
				}
			});
			if (balance < amount + fee) {
				throw {message: 'Insufficient funds!'};
			} else {
				addr_amount_obj[toAddress] = parseFloat(amount.toFixed(8));
				let remain_amount = balance - amount - fee;
				if (remain_amount > 0) {
					addr_amount_obj[fromAddress] = parseFloat(remain_amount.toFixed(8));
				}
				return dash_rpc.call('createrawtransaction', [tx_obj, addr_amount_obj]);
			}
		} else {
			throw {message: 'Insufficient funds!'};
		}
	}).then(rawtx => {
		return dash_rpc.call('signrawtransaction', [rawtx, [], [pk]])
	}).then(signedtx => {
		if (signedtx.complete === 0) throw {message: 'Failed to sign the Raw Transaction.'};
		return dash_rpc.call('sendrawtransaction', [signedtx.hex])
	}).then(sendtxid => {
		deferred.resolve({txid: sendtxid});
	}).catch(err => {
		deferred.reject(err.message);
	});

	return deferred.promise;
}

/*
* Function to list all the transactions sorted by the address
*/
function listTransactionsByAddress(address) {
	let deferred = Q.defer();
	let return_txs = [];
	dash_rpc.call('listtransactions', ["", 1000]).then((txs) => {
		if (Array.isArray(txs) && txs.length > 0) {
			_.each(txs, (tx) => {
				if (tx.address == address && tx.category == 'receive') {
					return_txs.push({
                        txid: tx.txid,
                        type: tx.category,
                        time: tx.time,
                        amount: Math.abs(tx.amount),
                    });
				}
			})
		}
		deferred.resolve(return_txs)
	}).catch(err => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}

/*
* Function to get the fees of a transaction
*/
async function getFee() {
	let fees ="";
	await dash_rpc.call('estimatefee',[25]).then((fee)=>{
		fees = fee;
	})
	return fees;
	}

/*
* Function to import the private key
*/
function importPrivkey(pk) {
	let deferred = Q.defer();

	if (!pk) {
		deferred.reject('invalid pk');
	}

	if (!pk.startsWith("K") && !pk.startsWith("L")) {
		var privateKey = new bitcore.PrivateKey(pk);
		pk = privateKey.toWIF();
	}

	var privateKey1 = new bitcore.PrivateKey.fromWIF(pk);
	var address = privateKey1.toAddress().toString();

	dash_rpc.call('importprivkey', [pk, "", false]).then((result) => {
		deferred.resolve({address: address});
	}).catch((err) => {
		deferred.reject(err.message);
	});

	return deferred.promise;
}

/*
* Function to validate the address
*/
function validateAddress(address) {
	let deferred = Q.defer();

	let response = null;

	if (!address) {
		deferred.reject('invalid address');
	}

	dash_rpc.call('validateaddress', [address]).then((result) => {
		response = result;
		return dash_rpc.call('dumpprivkey', [address]);
	}).then((result) => {
		response.privateKey = result;
		deferred.resolve(response);
	}).catch((err) => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}

/*
* Function to check the status of the transaction
*/
function checkStatus() {
	let deferred = Q.defer();
	let return_val = {
		coin: "DASH",
		status: false
	}
	dash_rpc.call('getblockchaininfo', []).then((result) => {
		return_val.status = result;
		deferred.resolve(return_val);
	}).catch((err) => {
		return_val.status = false;
		deferred.resolve(return_val);
	});
	return deferred.promise;
}
