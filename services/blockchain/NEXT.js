var config = require('config.json');
var Q = require('q');
var RPC = require('../coin_rpc');
var _ = require('lodash');
var request = require("request");
var sys_rpc = new RPC.CoinRPC(config.nodeServer.NEXT.rpc, {auth: config.nodeServer.NEXT.rpcAuth});
var service = {};
//    _ _      _   ______   __    __  _______    ____    ____   _______   _       _   
//   | |\ \   | | |  ____|  \ \  / / |_______|  / ___|  / __ \ |__   __| | |\    | | 
//   | | \ \  | | | |___     \ \/ /     | |    | |     | |  | |   | |    | |\ \  | | 
//   | |  \ \ | | | |___|    /\ \/      | |    | |     | |  | |   | |    | | \ \ | |  
//   | |   \ \| | | |____   / /\ \    __| |__  | |___  | |__| | __| |__  | |  \ \| | 
//   |_|    \_|_| |______| /_/  \_\  |_______|  \____|  \____/ |_______| |_|   \ |_|    
//
/**
 * Service methods for wallets
 */
service.newAccount = newAccount;
service.getBalance = getBalance;
service.getFee = getFee;
service.transfer = transfer;
service.listTransactionsByAddress = listTransactionsByAddress;
service.validateAddress = validateAddress;
service.checkStatus = checkStatus;
/**
 * Service methods for alias 
 */
service.aliasinfo = aliasinfo;
service.aliasbalance = aliasbalance;
service.listaliases = listaliases;
service.aliasnew = aliasnew;
service.aliaspay = aliaspay;
service.aliasupdate = aliasupdate;
service.aliaswhitelist = aliaswhitelist;
service.aliasclearwhitelist = aliasclearwhitelist;
service.aliasupdatewhitelist = aliasupdatewhitelist;
service.nextcointxfund = nextcointxfund;
service.aliasaddscript = aliasaddscript;
/**
 * Service methods for Assets 
 */
service.assetinfo = assetinfo;
service.assetsend = assetsend;
service.assetnew = assetnew;
service.assetallocationinfo = assetallocationinfo;
service.assetallocationsend = assetallocationsend;
service.assetallocationsenderstatus = assetallocationsenderstatus;
service.assettransfer = assettransfer;
service.assetupdate = assetupdate;
service.assetallocationcollectinterest = assetallocationcollectinterest;
/**
 * Export modules
 */
module.exports = service;
/**
 ********************************Wallet functions for wallet transactions******************************************
 */
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
        sys_rpc.call('getnewaddress', []).then(address => {
                res.address = address;
                return sys_rpc.call('dumpprivkey', [res.address]);
        }).then(pk => {
                res.pk = pk;
                return sys_rpc.call('validateaddress', [res.address]);
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
        request('https://explore.next.exchange/ext/getbalance/'+address,(error, result, body)=>{
                console.log(body)
                balance = body;
                deferred.resolve({balance: balance, locked_balance: 0});
        });
        return deferred.promise;
}
/**
 * @description Get estimated fees
 * @param {*}
 * @returns {} estimated fees
 */
function getFee() {
        return config.gasFee.NEXT;
}
/**
 * @description Transfer coins from one account to another
 * @param {*} pk 
 * @param {*} fromAddress 
 * @param {*} toAddress 
 * @param {*} amount 
 * @returns {} Transaction hash
 */
function transfer(pk, fromAddress, toAddress, amount) {
        let deferred = Q.defer();
        amount = parseFloat(amount);
        let fee = getFee();
        if (!pk || !fromAddress || !toAddress) {
                deferred.reject('Bad request!');
        } else {
                sys_rpc.call('settxfee', [fee]).then(() => {
                        return sys_rpc.call('listunspent', []);
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
                                        addr_amount_obj[toAddress] = amount;
                                        let remain_amount = balance - amount - fee;
                                        if (remain_amount > 0) {
                                                addr_amount_obj[fromAddress] = remain_amount;
                                        }
                                        return sys_rpc.call('createrawtransaction', [tx_obj, addr_amount_obj]);
                                }
                        } else {
                                throw {message: 'Insufficient funds!'};
                        }
                }).then(rawtx => {
                        return sys_rpc.call('signrawtransaction', [rawtx, [], [pk]])
                }).then(signedtx => {
                        if (signedtx.complete === 0) throw {message: 'Failed to sign the Raw Transaction.'};
                        return sys_rpc.call('sendrawtransaction', [signedtx.hex])
                }).then(sendtxid => {
                        deferred.resolve({txid: sendtxid});
                }).catch(err => {
                        deferred.reject(err.message);
                });
        }
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
        sys_rpc.call('listtransactions', ["", 5000000]).then((txs) => {
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
 * @description This function validates the address
 * @param {*} address 
 * @returns {} Status of the address
 */
function validateAddress(address) {
	let deferred = Q.defer();
	let response = null;
	if (!address) {
		deferred.reject('invalid address');
	}
	sys_rpc.call('validateaddress', [address]).then((result) => {
                response = result.isvalid;
		deferred.resolve(response);
	}).catch((err) => {
		deferred.reject(err.message);
	});
	return deferred.promise;
}
/**
 * @description This API checks the status of the node connectivity
 * @param {}
 * @returns promise
 */
function checkStatus() {
	let deferred = Q.defer();
	let return_val = {
		coin: "NEXT",
		status: false
	}
	sys_rpc.call('getblockchaininfo', []).then((result) => {
		return_val.status = result;
		deferred.resolve(return_val);
	}).catch(err => {
                deferred.reject(err.message);
        });
	return deferred.promise;
}
/**
 **********************************Alisas functions for wallet transactions******************************************
 */
/**
 * @description Show values of an alias
 * @param {*} aliasName 
 * @response service method call
 */
function  aliasinfo(name){
        let deferred = Q.defer();
        sys_rpc.call('aliasinfo',[name]).then((result)=>{
        deferred.resolve(result);
        }).catch((err) => {
	deferred.reject(err.message);
	});
        return deferred.promise;
}
/**
 * @description Function is controller for generating new alias
 * @param {*} owner 
 * @param {*} publicValue
 * @param {*} category=assets
 * @param {*} precision=8
 * @param {*} use_inputranges
 * @param {*} supply
 * @param {*} max_supply
 * @param {*} interest_rate
 * @param {*} can_adjust_interest_rate
 * @response service method call
 */
function aliasnew(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasnew',[params.body.aliasname,params.body.publicvalue,params.body.accept_transfers_flags,params.body.expire_timestamp,params.body.address,params.body.encryption_privatekey,params.body.encryption_publickey,params.body.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.reject(err.message);
	});
        return deferred.promise;
}
/**
 * @description Returns the total amount received by the given alias in transactions
 * @param {*} aliasName
 * @response service method call
 */
function aliasbalance(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasbalance',[params]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description scan through all aliases
 * @response service method call
 */
function listaliases(){
        let deferred = Q.defer();
        sys_rpc.call('listaliases',[]).then((result)=>{
                deferred.resolve(result);   
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Send multiple times from an alias. Amounts are double-precision floating point numbers.
 * @param {*} aliasfrom 
 * @param {*} amounts 
 * @param {*} instantsend
 * @param {*} subtractfeefromamount
 * @response service method call
 */
function aliaspay(params){
        let deferred = Q.defer();
        sys_rpc.call('aliaspay',[params.aliasName,params.transaction]).then((result)=>{
                deferred.resolve(result); 
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Update and possibly transfer an alias
 * @param {*} aliasname
 * @param {*} publicvalue
 * @param {*} address
 * @param {*} accept_transfers_flags
 * @param {*} expire_timestamp
 * @param {*} encryption_publickey
 * @param {*} encryption_privatekey
 * @param {*} witness
 * @returns {*} Data for transaction details
 */
function aliasupdate(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasupdate',[params.aliasname,params.publicvalue,params.address,params.accept_transfers_flags,params.expire_timestamp,params.encryption_privatekey,params.encryption_publickey,params.witness]).then((result)=>{
               deferred.resolve(result);
        }).catch((err) => {
	       deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description List all affiliates for this alias
 * @param {*} aliasName 
 * @returns {*} whitelist data
 */
function aliaswhitelist(params){
        let deferred = Q.defer();
        sys_rpc.call('aliaswhitelist',[params]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
        deferred.resolve(err.message);
	});                                
        return deferred.promise;
}
/**
 * @description Clear your whitelist(controls who can resell)
 * @param {*} owneralias 
 * @param {*} witness 
 * @response service method call
 */
function aliasclearwhitelist(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasclearwhitelist',[params.owneralias,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @descriiption {*} Update to the whitelist(controls who can resell). Array of whitelist entries in parameter 1
 * @param: owneralias
 * @param: entries":{"alias":"","discount_percentage":""}
 * @param: witness
 * @return update status
 */
function aliasupdatewhitelist(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasupdatewhitelist',[params.owneralias,[params.entries],params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
        deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Funds a new Nextcoin transaction with inputs used from wallet or an array of addresses specified
 * @param {*} hexstring
 * @param {*} addresses
 * @param {*} instantsend
 * @return {*} transaction data
 */
function nextcointxfund(params){
        let deferred = Q.defer();
        sys_rpc.call('nextcointxfund',[params.hexstring,[{"addresses":[params.address]},params.instantsend]]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Add redeemscript to local wallet for signing smart contract based alias transactions.
 * @param {*} script
 * @return {*}  data{*} result
 */
function aliasaddscript(params){
        let deferred = Q.defer();
        sys_rpc.call('aliasaddscript',[params.script]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 **********************************Alisas functions for wallet transactions******************************************
 */
/**
 * @description Show stored values of a single asset and its. Set getinputs to true if you want to get the allocation inputs, if applicable. 
 * @param {*} params 
 * @returns
 */
function assetinfo(params){
        if(params.getinputs == "true"){
        let deferred = Q.defer();
        sys_rpc.call('assetinfo',[params.asset,true]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
else{
        let deferred = Q.defer();
        sys_rpc.call('assetinfo',[params.asset,false]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;  
}
}
/**
 * @description Send an asset you own to another alias as an asset allocation. Maximimum recipients is 250
 * @param asset
 * @param aliasfrom
 * @param amounts
 * @param memo
 * @param witness
 * @returns data for this transaction 
 */
function assetsend(params){
        let deferred = Q.defer();
        sys_rpc.call('assetsend',[params.asset,params.aliasfrom,params.amounts,params.memo,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Create new assets
 * @param {*} alias
 * @param {*} publicvalue
 * @param {*} category
 * @param {*} precision
 * @param {*} use_inputranges
 * @param {*} max_supply
 * @param {*} interest_rate
 * @param {*} can_adjust_interest_rate
 * @param {*} witness
 * @return {*} data for the transaction 
 */
function assetnew(params){
        let deferred = Q.defer();
        sys_rpc.call('assetnew',[params.symbol,params.alias,params.publicvalue,params.category,params.precision,params.use_inputranges,params.supply,params.max_supply,params.interest_rate,params.can_adjust_interest_rate,params.witness]).then((result)=>{
        deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Show stored values of a single asset allocation. Set getinputs to true if you want to get the allocation inputs, if applicable.
 * @param {*} asset
 * @param {*} alias
 * @param {*} getinputs
 * @returns {*} data for assets allocation info
 */
function assetallocationinfo(params){
        if(params.getinputs == "true"){
        let deferred = Q.defer();
        sys_rpc.call('assetallocationinfo',[params.asset,params.alias,true]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
        else{
        let deferred = Q.defer();
        sys_rpc.call('assetallocationinfo',[params.asset,params.alias,false]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;}
}
/**
 * @description Send an asset allocation you own to another address. Maximimum recipients is 250.
 * @param {*} asset 
 * @param {*} aliasfrom
 * @param {*} amounts
 * @param {*} memo
 * @param {*} witness
 * @returns Transaction data
 */
function assetallocationsend(params){
        let deferred = Q.defer();
        sys_rpc.call('assetallocationsend',[params.asset,params.aliasfrom,[params.amounts],params.memo,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Show status as it pertains to any current Z-DAG conflicts or warnings related to a sender or sender/txid combination of an asset allocation transfer
 * @param {*} asset
 * @param {*} sender
 * @param {*} txid 
 * @returns {*} Data for the transaction status
 */
function assetallocationsenderstatus(params){
        let deferred = Q.defer();
        sys_rpc.call('assetallocationsenderstatus',[params.asset,params.sender,params.txid]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Transfer a asset allocation you own to another address.
 * @param {*} asset 
 * @param {*} ownerto 
 * @param {*} witness
 * @returns transaction data for transfer function 
 */
function assettransfer(params){
        let deferred = Q.defer();
        sys_rpc.call('assettransfer',[params.asset,params.ownerto,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Perform an update on an asset you control.
 * @param {*} asset 
 * @param {*} publicvalue
 * @param {*} category
 * @param {*} supply 
 * @param {*} interest_rate
 * @param {*} witness
 * @returns response for the update transaction 
 */
function assetupdate(params){
        let deferred = Q.defer();
        sys_rpc.call('assetupdate',[params.asset,params.publicvalue,params.category,params.supply,params.interest_rate,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}
/**
 * @description Collect interest on this asset allocation if an interest rate is set on this asset.
 * @param {*} asset
 * @param {*} owner
 * @param {*} witness
 * @returns allocation interest data for the asset
 */
function assetallocationcollectinterest(params){
        let deferred = Q.defer();
        sys_rpc.call('assetallocationcollectinterest',[params.asset,params.owner,params.witness]).then((result)=>{
                deferred.resolve(result);
        }).catch((err) => {
		deferred.resolve(err.message);
	});
        return deferred.promise;
}








