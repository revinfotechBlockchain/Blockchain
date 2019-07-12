var config = require('config.json');
var express = require('express');
var router = express.Router();
var aliasService = require('./alias.service');
var mailService = require('../../services/mail');
router.get('/aliasinfo/:cointype/:aliasName', aliasinfo);
router.post('/aliasnew/:cointype/', aliasnew);
router.get('/aliasbalance/:cointype/:aliasName', aliasbalance);
router.get('/listaliases/:cointype', listaliases);
router.post('/aliaspay/:cointype/', aliaspay);
router.post('/aliasupdate/:cointype/', aliasupdate);
router.get('/aliaswhitelist/:cointype/:aliasName', aliaswhitelist);
router.post('/aliasclearwhitelist/:cointype/', aliasclearwhitelist);
router.post('/aliasupdatewhitelist/:cointype/', aliasupdatewhitelist);
router.post('/nextcointxfund/:cointype/', nextcointxfund);
router.post('/aliasaddscript/:cointype/', aliasaddscript);
module.exports = router;
//      ___       _      _________       ___      ______
//     / / \     | |    |___   ___|     / / \    /  ____|    
//    / / \ \    | |        | |        / / \ \   | |____
//   / /___\ \   | |        | |       / /___\ \   \____ \ 
//  / /_____\ \  | |___  ___| |___   / /_____\ \   ____| |  
// / /       \ \ |_____||_________| /_/       \_\ |_____/  
//
/**
 * @description Show values of an alias
 * @param {*} aliasName 
 * @response service method call
 */
function aliasinfo(req, res, next) {
		aliasService.aliasinfo(req.params.cointype,req.params.aliasName).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
};
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
function aliasnew(req, res, next) {
	  aliasService.aliasnew(req.params.cointype,req).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Returns the total amount received by the given alias in transactions
 * @param {*} aliasName
 * @response service method call
 */
function aliasbalance(req, res, next) {
	  aliasService.aliasbalance(req.params.cointype,req.params.aliasName).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
};
/**
 * @description scan through all aliases
 * @response service method call
 */
function listaliases(req, res, next) {
	  aliasService.listaliases().then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Send multiple times from an alias. Amounts are double-precision floating point numbers.
 * @param {*} aliasfrom 
 * @param {*} amounts 
 * @param {*} instantsend
 * @param {*} subtractfeefromamount
 * @response service method call
 */
function aliaspay(req, res, next) {
	  aliasService.aliaspay(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
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
function aliasupdate(req, res, next) {
	  aliasService.aliasupdate(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description List all affiliates for this alias
 * @param {*} aliasName 
 * @returns {*} whitelist data
 */
function aliaswhitelist(req, res, next) {   
	  aliasService.aliaswhitelist(req.params.cointype,req.params.aliasName).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Clear your whitelist(controls who can resell)
 * @param {*} owneralias 
 * @param {*} witness 
 * @response service method call
 */
function aliasclearwhitelist(req, res, next) {
	  aliasService.aliasclearwhitelist(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @descriiption {*} Update to the whitelist(controls who can resell). Array of whitelist entries in parameter 1
 * @param: owneralias
 * @param: entries":{"alias":"","discount_percentage":""}
 * @param: witness
 * @return update status
 */
function aliasupdatewhitelist(req, res, next) {
	aliasService.aliasupdatewhitelist(req.params.cointype,req.body).then(function (result) {
	res.send({status: true, data: result});
}).catch(function (err) {
	res.send({status: false, message: err});
});
}
/**
 * @description Funds a new Nextcoin transaction with inputs used from wallet or an array of addresses specified
 * @param {*} hexstring
 * @param {*} addresses
 * @param {*} instantsend
 * @return {*} transaction data
 */
function nextcointxfund(req, res, next) {
	  aliasService.nextcointxfund(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Add redeemscript to local wallet for signing smart contract based alias transactions.
 * @param {*} script
 * @return {*}  data{*} result
 */
function aliasaddscript(req, res, next) {
  	aliasService.aliasaddscript(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}