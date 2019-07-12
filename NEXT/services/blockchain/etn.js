var _ = require('lodash');
var Q = require('q');
var RPC = require('../coin_rpc');
var config = require('config.json');
var etn_rpc = new RPC.CoinRPC(config.nodeServer.etn.rpc, {forceObject: true});
var service = {};
//   _____   _______   ___     _    ____    ____   _______   _       _ 
//  |  ___| |_______| | | \   | |  / ___|  / __ \ |__   __| | |\    | | 
//  | |___     | |    | |\ \  | | | |     | |  | |   | |    | |\ \  | |
//  |  ___|    | |    | | \ \ | | | |     | |  | |   | |    | | \ \ | |
//  | |___     | |    | |  \ \| | | |___  | |__| | __| |__  | |  \ \| | 
//  |_____|    |_|    |_|   \_|_|  \____|  \____/ |_______| |_|   \ |_|
//
service.newAccount = newAccount;
service.getBalance = getBalance;
service.getFee = getFee;
service.transfer = transfer;
service.listTransactionsByAddress = listTransactionsByAddress;
service.checkStatus = checkStatus;
module.exports = service;
/**
 * @description Function to generate new account
 * @param {*}
 * @returns status,pk,addr
 */
function newAccount(){
	let deferred = Q.defer();
	let res = {
		index: null,
		pk: null,
		payment_id: null,
		wallet_address: null,
		address: null
    }
    _getPrivateKey().then((pk) => {
        res.pk = pk;
    }).catch((err)=> {
    });

	_getWalletAddress().then((wallet_addr) => {
		res.wallet_address = wallet_addr;
		return etn_rpc.call('make_integrated_address', {payment_id: ''});
	}).then((integrated_result) => {
		if (integrated_result) {
			res.address = integrated_result.integrated_address;
			res.payment_id = integrated_result.payment_id;
			return etn_rpc.call('add_address_book', {address: res.address});
		} else {
			throw {message: "Could not create ETN integrated address."};
		}
	}).then((address_book_result) => {
		if (address_book_result) {
            res.index = address_book_result.index;
            // res.pk =res.payment_id;
			deferred.resolve(res);
		} else {
			throw {message: "Could not add the address to address book."};
		}
	}).catch((error) => {
		deferred.reject("This is the error",error.message);
	})
	return deferred.promise;
}
/**
 * @description Get balance by address
 * @param {*} address 
 * @returns {} Balance
 */
function getBalance(integrated_address) {
    let deferred = Q.defer();
    
	etn_rpc.call('split_integrated_address', {integrated_address: integrated_address}).then((splited_address) => {
		if (splited_address.payment_id) {
			return etn_rpc.call('get_transfers', {in: true, out: true, pending: true});
		} else {
			throw {message: 'Error retrieving address'};
		}
	}).then((transfers) => {
		let balance = 0;
        let balance_in = 0;
        let balance_out = 0;
        if (transfers.in && transfers.in.length > 0) {
            for(var i = 0; i < transfers.in.length; i++) {
                if (transfers.in[i].payment_id == result.payment_id) {
                    balance_in = balance_in + transfers.in[i].amount
                }
            }
        }
        if (transfers.out && transfers.out.length > 0) {
            for(var i = 0; i < transfers.out.length; i++) {
                if (transfers.out[i].payment_id == result.payment_id) {
                    balance_in = balance_in + transfers.out[i].amount;
                }
                if (transfers.out[i].note == address) {
                    balance_out = balance_out + transfers.out[i].amount;
                }
            }
        }
        if (transfers.pending && transfers.pending.length > 0) {
            for(var i = 0; i < transfers.pending.length; i++) {
                if (transfers.pending[i].payment_id == result.payment_id) {
                    balance_in = balance_in + transfers.pending[i].amount;
                }
                if (transfers.pending[i].note == address) {
                    balance_out = balance_out + transfers.pending[i].amount;
                }
            }
        }
        balance = (balance_in - balance_out) / 100;
        // deferred.resolve(balance);
        deferred.resolve({balance: balance, locked_balance: 0});
	}).catch((error) => {
		deferred.reject(error.message);
	});
	return deferred.promise;
}
/**
 * @description Get estimated fees
 * @param {*}
 * @returns {} estimated fees
 */
function getFee() {
	return parseFloat(config.gasFee.etn);
}
/**
 * @description This API transfers funds from one account to another
 * @param {*} pk 
 * @param {*} fromAddress 
 * @param {*} toAddress 
 * @param {*} amount 
 */
function transfer(from_address, to_address, amount) {
	let deferred = Q.defer();
	let trans_amount = parseFloat(amount) * 100;
    let trans_fee = getFee() * 100;
    etn_rpc.call('split_integrated_address', {integrated_address: to_address}).then(check_result => {
    	if (check_result.payment_id) {
    		return getBalance(from_address);
    	} else {
    		throw {message: "Invalid receipt address. It should be the intergrated address."};
    	}
    }).then(balance_result => {
    	if (balance_result.balance >= parseFloat(amount)) {
    		return etn_rpc.call('transfer', {destinations: [{amount: trans_amount, address: to_address}], fee: trans_fee, get_tx_key: true, mixin: 4, get_tx_hex: true});
    	} else {
    		throw {message: "Not enough ETN!"}
    	}
    }).then(transfer_result => {
    	if(transfer_result.tx_hash) {
            etn_rpc.call('set_tx_notes', {txids:[transfer_result.tx_hash],notes:[from_address]});
            deferred.resolve({txid: transfer_result.tx_hash});
        } else {
        	throw {message: "Error creating transaction"};
        }
    }).catch(error => {
    	deferred.reject(error.message);
    })
    return deferred.promise;
}
/**
 * @description This API returns list of transaction sorted by address
 * @param {*} address
 * @returns {} List of Transactions
 */
function listTransactionsByAddress(address) {
	let deferred = Q.defer();
	let payment_id = null;
    let return_txs = [];
    etn_rpc.call('split_integrated_address', {integrated_address: address}).then(result => {
    	if (result.payment_id) {
            payment_id = result.payment_id;
            return etn_rpc.call('get_transfers', {in: true, out: true});
        } else {
            throw({message: 'Invalid the address. It should be the integrated address'});
        }
    }).then((transfer_result) => {
        if (Array.isArray(transfer_result.in) && transfer_result.in.length > 0) {
            _.each(transfer_result.in, (tx) => {
                if (tx.payment_id == payment_id) {
                    return_txs.push({
                        txid: tx.txid,
                        type: 'receive',
                        time: tx.timestamp,
                        amount: tx.amount / 100,
                        fees: tx.fee / 100
                    });
                }
            });
        }
        if (Array.isArray(transfer_result.out) && transfer_result.out.length > 0) {
            _.each(transfer_result.out, (tx) => {
                if (tx.payment_id == payment_id) {
                    return_txs.push({
                        txid: tx.txid,
                        type: 'receive',
                        time: tx.timestamp,
                        amount: tx.amount / 100,
                        fees: tx.fee / 100
                    });
                }
            });
        }
        deferred.resolve(_.sortByOrder(return_txs, ['time'], ['desc']));
    }).catch(err => {
        deferred.reject(err.message);
    })

	return deferred.promise;
}
/**
 * @description Get wallet by address
 * @params
 * @returns promise 
 */
function _getWalletAddress() {
	let deferred = Q.defer();
	etn_rpc.call('getaddress').then((result) => {
		deferred.resolve(result.address);
	}).catch((error) => {
		deferred.reject(error.message);
	})
    return deferred.promise;
}
/**
 * @description Get private key 
 * @param {}
 * @returns promise
 */
 function _getPrivateKey() {
    let deferred = Q.defer();
	etn_rpc.call('query_key',{key_type:"view_key"}).then((result) => {
		deferred.resolve(result.key);
	}).catch((error) => {
		deferred.reject(error.message);
	})
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
        coin: "ETN",
        status: false
    }
    etn_rpc.call('get_version').then((result) => {
        return_val.status = result;
        deferred.resolve(return_val);
    }).catch((err) => {
        return_val.status = false;
        deferred.resolve(return_val);
    });
    return deferred.promise;
}