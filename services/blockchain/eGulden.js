var config = require('config.json');
var Q = require('q');
var RPC = require('../coin_rpc');
var _ = require('lodash');
var bitcore = require('bitcore-lib');
var axios = require('axios');
var eGulden_rpc = new RPC.CoinRPC(config.nodeServer.egulden.rpc, {auth: config.nodeServer.egulden.rpcAuth});
var service = {};
//    _____           _____    _    _   _       ____    _____   _ _     _
//   |  ___|        /  ___/   | |  | | | |     |___ \  |  ___| | | \   | |
//   | |___    ___  | |  ___  | |  | | | |     | | | | | |___  | |\ \  | |
//   |  ___|  |___| | | |__ \ | |  | | | |     | | | | |  ___| | | \ \ | |
//   | |___         | |___| | | |__| | | |____ | |_| | | |___  | |  \ \| |
//   |_____|         \_____/   \____/  |_____| |____/  |_____| |_|   \_|_|
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
 * @description Function to generate new account
 * @param {*}
 * @returns status,pk,addr
 */
function newAccount() {
	let deferred = Q.defer();
	let res = {
		address: null,
		pk: null
	}
	eGulden_rpc.call('getnewaddress', []).then(address => {
		res.address = address;
		return eGulden_rpc.call('dumpprivkey', [res.address]);
	}).then(pk => {
		res.pk = pk;
		return eGulden_rpc.call('validateaddress', [res.address]);
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
/**
 * @description Get balance by address
 * @param {*} address 
 * @returns {} Balance
 */
function getBalance(address) {

	let deferred = Q.defer();

	if (!address) {
		deferred.reject('Invalid Address!');
	}

	eGulden_rpc.call('listunspent', []).then(txs => {
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
/**
 * @description This API transfers funds from one account to another
 * @param {*} pk 
 * @param {*} fromAddress 
 * @param {*} toAddress 
 * @param {*} amount 
 */
async function transfer(pk, fromAddress, toAddress, amount) {
	let deferred = Q.defer();
	amount = parseFloat(amount);
	let fee = await getFee();
	if (!pk || !fromAddress || !toAddress) {
		deferred.reject('Bad request!');
	}
	eGulden_rpc.call('settxfee', [fee]).then(() => {
		return eGulden_rpc.call('listunspent', []);
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
				return eGulden_rpc.call('createrawtransaction', [tx_obj, addr_amount_obj]);
			}
		} else {
			throw {message: 'Insufficient funds!'};
		}
	}).then(rawtx => {
		return eGulden_rpc.call('signrawtransaction', [rawtx, [], [pk]])
	}).then(signedtx => {
		if (signedtx.complete === 0) throw {message: 'Failed to sign the Raw Transaction.'};
		return eGulden_rpc.call('sendrawtransaction', [signedtx.hex])
	}).then(sendtxid => {
		deferred.resolve({txid: sendtxid});
	}).catch(err => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}
/**
 * @description This API returns list of transaction sorted by address
 * @param {*} address
 * @returns {} List of Transactions
 */
function listTransactionsByAddress(address) {
	let deferred = Q.defer();
	let return_txs = [];
	eGulden_rpc.call('listtransactions', ["", 1000]).then((txs) => {
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
/**
 * @description Get estimated fees
 * @param {*}
 * @returns {} estimated fees
 */
async function getFee() {
	try{
	let fees ="";
	await eGulden_rpc.call('estimatesmartfee',[1]).then((fee)=>{
		fees = fee;
	})
	return fees;
}
catch(error){
	return error.error
}
	}
/**
 * @description This API is used to import private key
 * @param {*} pk 
 * @response promise
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
	eGulden_rpc.call('importprivkey', [pk, "", false]).then((result) => {
		deferred.resolve({address: address});
	}).catch((err) => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}
/**
 * @description This api validates the address
 * @param {*} address 
 * @returns {} promise
 */
function validateAddress(address) {
	let deferred = Q.defer();
	let response = null;
	if (!address) {
		deferred.reject('invalid address');
	}
	eGulden_rpc.call('validateaddress', [address]).then((result) => {
		response = result;
		return eGulden_rpc.call('dumpprivkey', [address]);
	}).then((result) => {
		response.privateKey = result;
		deferred.resolve(response);
	}).catch((err) => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}
/**
 * @description Check the blockchain status for this node
 * @param {}
 * @returns {} promise
 */
function checkStatus() {
	let deferred = Q.defer();
	let return_val = {
		coin: "EFL",
		status: false
	}
	eGulden_rpc.call('getblockchaininfo', []).then((result) => {
		return_val.status = result;
		deferred.resolve(return_val);
	}).catch((err) => {
		return_val.status = false;
		deferred.resolve(return_val);
	});
	return deferred.promise;
}
