var config = require('config.json');
var Q = require('q');
var express = require('express');
var RPC = require('../coin_rpc');
var _ = require('lodash');
var router = express.Router();
var request = require('request');
var RIPPLE_IP = config.nodeServer.ripple.rpc;
var RippleAPI = require('ripple-lib').RippleAPI;
var api = new RippleAPI({
    server: RIPPLE_IP
});
//     ____  _             __        ___    ____  ____
//    / __ \(_)___  ____  / /__     /   |  / __ \/  _/
//   / /_/ / / __ \/ __ \/ / _ \   / /| | / /_/ // /
//  / _, _/ / /_/ / /_/ / /  __/  / ___ |/ ____// /
// /_/ |_/_/ .___/ .___/_/\___/  /_/  |_/_/   /___/
//        /_/   /_/
//
//defining function for the requests
var service = {};
service.getFee = getFee;
service.newAccount = newAccount;
service.getBalance = getBalance;
service.transfer = transfer;
service.listTransactionsByAddress = listTransactionsByAddress;
service.checkStatus=checkStatus;
//Setup  API connection status 
api.on('error', (errorCode, errorMessage) => {
});
api.on('connected', () => {
});
api.on('disconnected', (code) => {
});
module.exports = service;
/**
 * @description Get estimated fees
 * @param {*}
 * @returns {} estimated fees
 */
async function getFee(req,res,next) {
    try {
        var connection = await api.connect();
        var result = await api.getFee();
        api.disconnect();
        return result;
    } catch (error) {
        return error;
    }
}
/**
 * @description Function to generate new account
 * @param {*}
 * @returns status,pk,addr
 */
async function newAccount(){
    try {
        var connection = await api.connect();
        var response = await api.generateAddress();
        let pk = '{"pk":"'+response.secret+'","addr":"'+response.address+'"}';
        let resp = JSON.parse(pk); 
        return (resp);
    } catch (error) {
       return error;
    }
}
/**
 * @description Get balance by address
 * @param {*} address 
 * @returns {} Balance
 */
async function getBalance(address) {
    try {
        var connection = await api.connect();
        var response = await api.getBalances(address);
        //api.disconnect();
         var resp = response[0];
         var resp2 = resp.value;
         let result = JSON.parse('{"balance":"'+resp2+'"}');
        return result;
    } catch (error) {
       return error;
    }
}
/**
 * @description This API transfers funds from one account to another
 * @param {*} pk 
 * @param {*} fromAddress 
 * @param {*} toAddress 
 * @param {*} amount 
 */
async function transfer(pk, fromAddress, toAddress, amount) {
    try {
        var connection = await api.connect();
        var payment = JSON.parse('{"source": {"address": "'+fromAddress+'","amount": { "currency": "XRP","value": "'+amount+'"}},"destination": {"address": "'+toAddress+'","minAmount": {"currency": "XRP","value": "'+amount+'"}}}');
        var preparedPayment = await api.preparePayment(fromAddress, payment);
        var signedHash = await api.sign(preparedPayment.txJSON, pk)
        var response = await api.submit(signedHash.signedTransaction);
        response.resultHash = signedHash.id;
        let result =response.resultHash;
        return result;
  } 
catch (error) {
        return error;
    }

}
/**
 * @description This API returns list of transaction sorted by address
 * @param {*} address
 * @returns {} List of Transactions
 */ 
async function listTransactionsByAddress(address) {
    try {
        var query = "https://data.ripple.com/v2/accounts/"+address+"/transactions?type=Payment&result=tesSUCCESS";
          await request(query,(err,reslt)=>
           {
                if(err){
                    throw err;
                }
                else
                {
                    var json = JSON.parse(reslt.body)
                    var final='{"list":[';
                    for(index=0;index<json.transactions.length;index++){
                    if(json.transactions[index].tx.Destination==address)
                    var txid='{"txid" :"'+json.transactions[index].hash+'",'; 
                    final=final+txid;
                    final=final+'"type": "receive",';  
                    var amount = '"amount" :"'+json.transactions[index].tx.Amount+'",';
                    if(typeof(json.transactions[index].tx.Amount)=='object'){
                        var amount = '"amount" :"'+json.transactions[index].tx.Amount.value+''+json.transactions[index].tx.Amount.currency+'",';
                        final=final+amount;
                    }
                    else{ 
                        final=final+'"amount" :"'+api.dropsToXrp(json.transactions[index].tx.Amount)+'",';
                    }
                    if(index<json.transactions.length-1) {
                    var date = '"date" :"'+json.transactions[index].date+'"'+'},'; 
                    final=final+date;
                    }
                    else {
                        var date = '"date" :"'+json.transactions[index].date+'"'+'}'; 
                        final=final+date;
                    }
                }
                final=final+"]}";
                let respo = JSON.parse(final);
                global.result =respo;
                }   
        });
    } 
    catch (error) {
       return error;
    }  
    return result;
}

/**
 *
 * @api {post} /DropsToXrp convert XRP to drops
 * @apiDescription convert XRP to drops
 * @apiGroup Ripple
 * @apiVersion  0.1.0
 *
 * @apiHeaderExample Request-Headers:
 * {
 *     Accept: application/json
 *     Content-Type: application/json
 * }
 *
 * @apiParam  {string} Value that is required to convert
 * @apiParamExample  {type} Request-Example:
 * {
 *     "val" : "120000000"
 * }
 *
 */
router.post('/XrpToDrops', async function (req, res, next) {
    try {
        var connection = await api.connect();
        var response = await api.xrpToDrops(req.body.val);
        api.disconnect();
        res.status(200).send(JSON.parse(response));
    } catch (error) {
        res.status(404).send(error);
    }
});
/**
 * @description Check the blockchain status for this node
 * @param {}
 * @returns {} promise
 */
async function checkStatus(){
let deferred = Q.defer();
	let return_val = {
		coin: "XRP",
		status: false
    }
    var connection = await api.connect();
    var result = await api.connection;
    try{
		return_val.status = result;
		deferred.resolve(return_val);
    }
    catch(err){
		return_val.status = false;
		deferred.resolve(return_val);
	}
	return deferred.promise;
}