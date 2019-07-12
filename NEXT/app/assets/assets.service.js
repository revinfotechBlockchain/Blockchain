var config = require('config.json');
var Q = require('q');
var encryptService = require('../../services/encrypt');
var blockchainServices = require('../../services/blockchain');
var service = {};
service.assetinfo = assetinfo;
service.assetsend = assetsend;
service.assetnew = assetnew;
service.assetallocationinfo = assetallocationinfo;
service.assetallocationsend = assetallocationsend;
service.assetallocationsenderstatus = assetallocationsenderstatus;
service.assettransfer = assettransfer;
service.assetupdate = assetupdate;
service.assetallocationcollectinterest = assetallocationcollectinterest;
module.exports = service;
//      ___         _____    ______   _____   _________   ______
//     / / \      /  ____|  /  ____| |  ___| |___   ___| /  ____|    
//    / / \ \    | |____   | |___    | |___      | |    | |____
//   / /___\ \    \____ \   \____ \  |  ___|     | |     \____ \ 
//  / /_____\ \    ____| |   ____| | | |___      | |      ____| |  
// / /       \ \  |_____/   |_____/  |_____|     |_|     |_____/  
//
/**
 * @description Show stored values of a single asset and its. Set getinputs to true if you want to get the allocation inputs, if applicable.
 * @param {*} coin_type 
 * @param {*} params 
 * @returns
 */
function assetinfo(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetinfo(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
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
function assetsend(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetsend(params).then(function(result){
    return deferred.resolve(result);
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
function assetnew(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetnew(params).then(function(result){
    return deferred.resolve(result);
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
function assetallocationinfo(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetallocationinfo(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
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
function assetallocationsend(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetallocationsend(params).then(function(result){
    return deferred.resolve(result);
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
function assetallocationsenderstatus(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetallocationsenderstatus(params).then(function(result){
    return deferred.resolve(result);
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
function assettransfer(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assettransfer(params).then(function(result){
    return deferred.resolve(result);
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
function assetupdate(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetupdate(params).then(function(result){
    return deferred.resolve(result);
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
function assetallocationcollectinterest(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.assetallocationcollectinterest(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
}