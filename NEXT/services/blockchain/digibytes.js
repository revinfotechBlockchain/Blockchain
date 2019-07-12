var express = require('express');
var router = express.Router();
var axios = require('axios');
var config = require('config.json');
var Q = require('q');
var RPC = require('../coin_rpc');
var _ = require('lodash');
var request = require('request');
var digibytes_rpc = new RPC.CoinRPC(config.nodeServer.digibytes.rpc, {auth: config.nodeServer.digibytes.rpcAuth});
//    ______    _______    ____   _______   ___    __   __  _______   ____    ______
//   |  ___  \ |_______|  / ___| |__  ___| |  _ \  \ \ / / |_______| |  __|  /  ____|
//   | |   | |    | |    | |   _    | |    | |_| /  \ / /     | |    | |__  | |____
//   | |   | |    | |    | |  | |   | |    |         / /      | |    |  __|  \____ \ 
//   | |___| |  __| |__  | |__| | __| |__  | |_| \  / /       | |    | |__    ____| |  
//   |______/  |_______|  \____/ |_______| |____/  /_/        |_|    |____|  |_____/ 
//
/*
*Service methods
*/
var service = {};
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
async function newAccount() {
    let deferred = Q.defer();
	let res = {
		address: null,
		pk: null
    }
	await digibytes_rpc.call('getnewaddress', []).then(address => {
		res.address = address;
		return digibytes_rpc.call('dumpprivkey', [res.address]);
	}).then(pk => {
		res.pk = pk;
		return digibytes_rpc.call('validateaddress', [res.address]);
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
	digibytes_rpc.call('listunspent', []).then(txs => {
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
 * Function: Get Fees of the account
 * 
 */
async function getFee() {
        let resp="";
        await digibytes_rpc.call('estimatesmartfee', [25]).then(result=>{
            resp +=result.feerate;   
        })
        return resp; 
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
	digibytes_rpc.call('settxfee', [fee]).then(() => {
		return digibytes_rpc.call('listunspent', []);
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
				return digibytes_rpc.call('createrawtransaction', [tx_obj, addr_amount_obj]);
			}
		} else {
			throw {message: 'Insufficient funds!'};
		}
	}).then(rawtx => {
		return digibytes_rpc.call('signrawtransactionwithkey', [rawtx,[pk]])
	}).then(signedtx => {
		if (signedtx.complete === 0) throw {message: 'Failed to sign the Raw Transaction.'}; 
		return digibytes_rpc.call('sendrawtransaction', [signedtx.hex])
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
	digibytes_rpc.call('listtransactions',["*",50000000,0]).then((txs) => {
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
	digibytes_rpc.call('importprivkey', [pk, "", false]).then((result) => {
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
	digibytes_rpc.call('validateaddress', [address]).then((result) => {
		response = result;
		return digibytes_rpc.call('dumpprivkey', [address]);
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
		coin: "DGB",
		status: false
	}
	digibytes_rpc.call('getblockchaininfo', []).then((result) => {
		return_val.status = result;
		deferred.resolve(return_val);
	}).catch((err) => {
		return_val.status = false;
		deferred.resolve(return_val);
	});
	return deferred.promise;
}