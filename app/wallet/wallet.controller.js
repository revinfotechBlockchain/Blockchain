var config = require('config.json');
var express = require('express');
var router = express.Router();
var walletService = require('./wallet.service');
var encryptService = require('../../services/encrypt');

// Create
router.post('/create/:cointype', create);
router.get('/validate/:cointype/:address', validateAddress);
router.get('/balance/:cointype/:address', getBalance);
router.post('/migrate/:cointype', migrate);

router.get('/pk/decrypt/:key', function(req, res) {
	var enc_key = req.params.key;
	var dec_key = encryptService.decrypt(enc_key);
	res.send({status: true, data: dec_key});
});

module.exports = router;

/**
 * function: Create Wallet
 * params: req.params.cointype
**/

function create(req,res) {
	let cointype = req.params.cointype;
	walletService.create(cointype).then(function(new_address) {
		if (new_address.pk != null && new_address.addr != null) {
			res.send({status: true, data: new_address});
		} else {
			res.send({status: false, message: 'Sorry, Error while creating new ' + cointype.toUpperCase() + ' address.'});
		}
	}).catch(function(err) {
		res.send({status: false, message: 'Error in creation of the ' + cointype.toUpperCase() + ' address: ' + err});
	});
	
}

/**
 * req.query: {contract}
**/
function getBalance(req, res) {
	let cointype = req.params.cointype;
	let address = req.params.address;
	walletService.getBalance(cointype, address, req.query).then(function(result) {
		res.send({status: true, data: result.balance});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}

function migrate(req, res) {
	let cointype = req.params.cointype;
	let old_address = req.body;

	walletService.migrate(cointype, old_address).then(function(result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});	
}

function validateAddress(req, res) {
	let cointype = req.params.cointype;
	let address = req.params.address;

	walletService.validateAddress(cointype, address).then(function(result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});	
}
