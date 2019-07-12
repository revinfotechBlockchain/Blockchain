var config = require('config.json');
var express = require('express');
var router = express.Router();
var assetService = require('./assets.service');
var mailService = require('../../services/mail');
router.get('/assetinfo/:cointype/:asset/:getinputs', assetinfo);
router.post('/assetsend/:cointype', assetsend);
router.post('/assetnew/:cointype', assetnew);
router.get('/assetallocationinfo/:cointype/:asset/:alias/:getinputs', assetallocationinfo);
router.post('/assetallocationsend/:cointype', assetallocationsend);
router.get('/assetallocationsenderstatus/:cointype/:asset/:sender/:txid', assetallocationsenderstatus);
router.post('/assettransfer/:cointype', assettransfer);
router.post('/assetupdate/:cointype', assetupdate);
router.get('/assetallocationcollectinterest/:cointype/:asset/:owner/:witness', assetallocationcollectinterest);
module.exports = router;
//      ___         _____    ______   _____   _________   ______
//     / / \      /  ____|  /  ____| |  ___| |___   ___| /  ____|    
//    / / \ \    | |____   | |___    | |___      | |    | |____
//   / /___\ \    \____ \   \____ \  |  ___|     | |     \____ \ 
//  / /_____\ \    ____| |   ____| | | |___      | |      ____| |  
// /_/       \_\  |_____/   |_____/  |_____|     |_|     |_____/  
//
/**
 * @description Show stored values of a single asset and its. Set getinputs to true if you want to get the allocation inputs, if applicable.
 * @param {*} coin_type 
 * @param {*} params 
 * @returns
 */
function assetinfo(req, res) {
    assetService.assetinfo(req.params.cointype,req.params).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
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
function assetsend(req, res) {
    assetService.assetsend(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
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
function assetnew(req, res) {
    assetService.assetnew(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Show stored values of a single asset allocation. Set getinputs to true if you want to get the allocation inputs, if applicable.
 * @param {*} asset
 * @param {*} alias
 * @param {*} getinputs
 * @returns {*} data for assets allocation info
 */
function assetallocationinfo(req, res) {
    assetService.assetallocationinfo(req.params.cointype,req.params).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
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
function assetallocationsend(req, res) {
    assetService.assetallocationsend(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Show status as it pertains to any current Z-DAG conflicts or warnings related to a sender or sender/txid combination of an asset allocation transfer
 * @param {*} asset
 * @param {*} sender
 * @param {*} txid 
 * @returns {*} Data for the transaction status
 */
function assetallocationsenderstatus(req, res) {
    assetService.assetallocationsenderstatus(req.params.cointype,req.params).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Transfer a asset allocation you own to another address.
 * @param {*} asset 
 * @param {*} ownerto 
 * @param {*} witness
 * @returns transaction data for transfer function 
 */
function assettransfer(req, res) {
    assetService.assettransfer(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
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
function assetupdate(req, res) {
    assetService.assetupdate(req.params.cointype,req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * @description Collect interest on this asset allocation if an interest rate is set on this asset.
 * @param {*} asset
 * @param {*} owner
 * @param {*} witness
 * @returns allocation interest data for the asset
 */
function assetallocationcollectinterest(req, res) {
    assetService.assetallocationcollectinterest(req.params.cointype,req.params).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}