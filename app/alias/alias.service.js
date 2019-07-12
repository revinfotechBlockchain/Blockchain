var config = require('config.json');
var Q = require('q');
var encryptService = require('../../services/encrypt');
var blockchainServices = require('../../services/blockchain');
var service = {};
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
module.exports = service;
//      ___       __     _________       ___      ______
//     / / \     | |    |___   ___|     / / \    /  ____|    
//    / / \ \    | |        | |        / / \ \   | |____
//   / /___\ \   | |        | |       / /___\ \   \____ \ 
//  / /_____\ \  | |___  ___| |___   / /_____\ \   ____| |  
// / /       \ \ |_____||_________| / /       \ \ |_____/  
//
/**
 * @description Show values of an alias
 * @param {*} aliasName 
 * @response service method call
 */
function aliasinfo(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasinfo(params).then(function(result){
        return deferred.resolve(result);
    }).catch(function(t_err) {
        deferred.reject(t_err);
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
function aliasnew(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasnew(params).then(function(result){
        return deferred.resolve(result);
    }).catch(function(t_err) {
        deferred.reject(t_err);
    });
    return deferred.promise;
}
/**
 * @description Returns the total amount received by the given alias in transactions
 * @param {*} aliasName
 * @response service method call
 */
function aliasbalance(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasbalance(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
}
/**
 * @description scan through all aliases
 * @response service method call
 */
function listaliases(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.listaliases().then(function(result){
    return deferred.resolve(result);
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
function aliaspay(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliaspay(params).then(function(result){
    return deferred.resolve(result);
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
function aliasupdate(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasupdate(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
}
/**
 * @description List all affiliates for this alias
 * @param {*} aliasName 
 * @returns {*} whitelist data
 */
function aliaswhitelist(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliaswhitelist(params).then(function(result){
    return deferred.resolve(result);
    });
    return deferred.promise;
}
/**
 * @description Clear your whitelist(controls who can resell)
 * @param {*} owneralias 
 * @param {*} witness 
 * @response service method call
 */
function aliasclearwhitelist(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasclearwhitelist(params).then(function(result){
    return deferred.resolve(result);
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
function aliasupdatewhitelist(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasupdatewhitelist(params).then(function(result){
        return deferred.resolve(result);
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
function nextcointxfund(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.nextcointxfund(params).then(function(result){
      return deferred.resolve(result);
    });
    return deferred.promise;
}
/**
 * @description Add redeemscript to local wallet for signing smart contract based alias transactions.
 * @param {*} script
 * @return {*}  data{*} result
 */
function aliasaddscript(coin_type, params) {
    let deferred = Q.defer();
    blockchainServices.nextService.aliasaddscript(params).then(function(result){ 
        return deferred.resolve(result);
    });
    return deferred.promise;
}
