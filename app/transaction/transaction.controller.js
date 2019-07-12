var config = require('config.json');
var express = require('express');
var router = express.Router();
var transactionService = require('./transaction.service');
var mailService = require('../../services/mail')
router.post('/create/:cointype', create);
router.get('/fee/:cointype', getFee);
router.get('/list/:cointype/:addr', listTransactionsbyAddress);
/** For token functions */
router.get('/tokenBalance/:cointype/:address/:contractAddress',getTokenBalance);
router.post('/transferToken/:cointype',transferToken);
router.get('/listTokenTransactionsByAddress/:cointype/:address/:contractAddress',listTokenTransactionsByAddress);
router.get('/checkTransactionStatus/:cointype/:hash',checkTransactionStatus);
module.exports = router;

/**
 * function: Create transaction
 * params: req.params: {cointype}, req.body: {pk, from, to, amount, contract}
**/
function create(req, res) {
	console.log("INSIDE TRANSFER TOKEN CONTROLLER 1",req.body)
	transactionService.create(req.params.cointype, req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		console.log("INSIDE TRANSFER TOKEN CONTROLLER 2")
		var m_sub = req.params.cointype.toUpperCase() + " Transaction Error";
		var m_msg = "Error in NEXT Exchange Node. <br/> <p style='color:red;'>" + err + "</p>";
		mailService.sendMail(m_sub, m_msg);
		res.send({status: false, message: err});
	});
}

/**
 * function: Get transaction fee for each coins and tokens
**/
function getFee(req, res) {
	transactionService.getFee(req.params.cointype, req.query.amount).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}

/**req, res
 * req, res: List transactions by address
 * query: contract=0xdfse343434fdfs&pagenum=1
**/
function listTransactionsbyAddress(req, res) {
	transactionService.listTransactionsbyAddress(req.params.cointype, req.params.addr, req.query).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getTokenBalance(req, res) {
	// console.log("Inside controller",req.params.cointype, req.params.address, req.params.contractAddress);
	transactionService.getTokenBalance(req.params.address, req.params.contractAddress).then(function (result) {
		console.log("Inside controller of transaction",result)
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function transferToken(req, res) {
	console.log("INSIDE TRANSFER TOKEN CONTROLLER 1")
	transactionService.transferToken(req.params.cointype, req.body).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		console.log("INSIDE TRANSFER TOKEN CONTROLLER 2")
		res.send({status: false, message: err});
	});
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function listTokenTransactionsByAddress(req, res) {
	transactionService.listTokenTransactionsByAddress(req.params.cointype, req.params.address,req.params.contractAddress).then(function (result) {
		res.send({status: true, data: result});
	}).catch(function (err) {
		res.send({status: false, message: err});
	});
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function checkTransactionStatus(req, res) {
	transactionService.checkTransactionStatus(req.params.hash)
	.then(function (result) {
		res.send({status: true, data: result});
	})
	.catch(function (err) {
		res.send({status: false, message: err});
	});
}