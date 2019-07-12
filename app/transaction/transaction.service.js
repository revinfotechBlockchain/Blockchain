var config = require('config.json');
var Q = require('q');
// var walletService = require('../wallet/wallet.service');
var encryptService = require('../../services/encrypt');
var blockchainServices = require('../../services/blockchain');
var service = {};
service.create = create;
service.getFee = getFee;
service.listTransactionsbyAddress = listTransactionsbyAddress;
/**
 * Service methods for tokens
 */
service.getTokenBalance = getTokenBalance ;
service.transferToken = transferToken;
service.listTokenTransactionsByAddress = listTokenTransactionsByAddress;
service.checkTransactionStatus = checkTransactionStatus;
module.exports = service;
function create(coin_type, params) {
	let deferred = Q.defer();
	let pk=null;
	if (params.pk) {
		if (coin_type =="XRP"){
			pk = params.pk;
		  }
		//   else if (coin_type =="DGB"){
		// 	pk = params.pk;
		//   }
		   else if (coin_type ==""){
		 	pk = params.pk;
		   }
		else{
            pk =encryptService.decrypt(params.pk);
		}
		let from_address = params.from;
		let to_address = params.to;
		let amount = params.amount;
		let contract_address = (params.contract)? params.contract : ''; // Smart contract address in Ethereum tokens
		let memo = (params.memo)? params.memo : ''; // Memo in MUSE Blockchain
		let asset_id = (params.asset)? params.asset : ''; // Asset in NEO Blockchain
		let tx_response = {
			txid: null,
			balance: 0,
			locked_balance: 0,
			fee: 0,
			fee_type: null
		}
		if (from_address != to_address) {
			switch (coin_type) {
				case 'btc':
					blockchainServices.btcService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.btcService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.btcService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'btc';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'XRP':
					pk = params.pk;
					blockchainServices.rippleService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result;
						return blockchainServices.rippleService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.rippleService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'XRP';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'DGB':
					blockchainServices.digibytesService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.digibytesService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.digibytesService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'DGB';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'DASH':
					blockchainServices.dashService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.dashService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.dashService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'DASH';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'CIR':
					blockchainServices.ciredoService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.ciredoService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.ciredoService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'CIR';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'EFL':
					blockchainServices.eGuldenService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.eGuldenService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.eGuldenService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'EFL';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'VITES':
					blockchainServices.vitesService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.vitesService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.vitesService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'VITES';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'ETN':
					blockchainServices.electroneumService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.electroneumService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.electroneumService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'ETN';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'NEXT':
					blockchainServices.nextService.transfer(pk, from_address, to_address, amount).then(function(result) {
						// console.log(pk, from_address, to_address, amount)
						console.log("Error wallet 1")
						tx_response.txid = result.txid;
						return blockchainServices.nextService.getBalance(from_address);
					}).then(function(balance) {
						console.log("Error wallet 2")
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.nextService.getFee();
					}).then(function(tx_fee) {
						console.log("Error wallet 3")
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'NEXT';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'eth':
					blockchainServices.ethService.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.ethService.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.ethService.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'ETH';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				case 'NLC2':
					blockchainServices.nlc2Service.transfer(pk, from_address, to_address, amount).then(function(result) {
						tx_response.txid = result.txid;
						return blockchainServices.nlc2Service.getBalance(from_address);
					}).then(function(balance) {
						tx_response.balance = balance.balance;
						tx_response.locked_balance = balance.locked_balance;
						return blockchainServices.nlc2Service.getFee();
					}).then(function(tx_fee) {
						tx_response.fee = tx_fee;
						tx_response.fee_type = 'NLC';
						deferred.resolve(tx_response);
					}).catch(function(t_err) {
						deferred.reject(t_err);
					});
				break;
				default:
					deferred.reject('Please set the coin type!');
				break;
			}
		} else {
			deferred.reject('Receipt should not be same to your wallet address!');
		}
	} else {
		deferred.reject('Invalid the private key');
	}
	return deferred.promise;
}

function getFee(coin_type, amount) {
	let deferred = Q.defer();

	switch (coin_type) {
		case 'btc':
			deferred.resolve(blockchainServices.btcService.getFee());
		break;
		case 'XRP':
			deferred.resolve(blockchainServices.rippleService.getFee());
		break;
		case 'DGB':
			deferred.resolve(blockchainServices.digibytesService.getFee());
		break;
		case 'DASH':
			deferred.resolve(blockchainServices.dashService.getFee());
		break;
		case 'CIR':
			deferred.resolve(blockchainServices.ciredoService.getFee());
		break;
		case 'EFL':
			deferred.resolve(blockchainServices.eGuldenService.getFee());
		break;
		case 'VITES':
			deferred.resolve(blockchainServices.vitesService.getFee());
		break;
		case 'ETN':
			deferred.resolve(blockchainServices.electroneumService.getFee());
		break;
		case 'NEXT':
			deferred.resolve(blockchainServices.nextService.getFee());
		break;
		case 'eth':
			deferred.resolve(blockchainServices.ethService.getFee());
		break;
		case 'NLC2':
			deferred.resolve(blockchainServices.nlc2Service.getFee());
		break;
		default:
			deferred.resolve(0)
			// deferred.reject('Please set the coin type!');
		break;
	}
	return deferred.promise;
}

function listTransactionsbyAddress(coin_type, address, query) {
	let deferred = Q.defer();
	let limit = config.txLimit;
	let pagenum = query.pagenum;
	if (!address) {
		deferred.reject('Invalid address!');
	} else {
		switch (coin_type) {
			case 'btc':
				blockchainServices.btcService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'XRP':
				blockchainServices.rippleService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'DGB':
				blockchainServices.digibytesService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'DASH':
				blockchainServices.dashService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'CIR':
				blockchainServices.ciredoService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'EFL':
				blockchainServices.eGuldenService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'VITES':
				blockchainServices.vitesService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'ETN':
				blockchainServices.electroneumService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'NEXT':
				blockchainServices.nextService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'eth':
				blockchainServices.ethService.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			case 'NLC2':
				blockchainServices.nlc2Service.listTransactionsByAddress(address).then(function(result) {
					deferred.resolve(result);
				}).catch(function(t_err) {
					deferred.reject(t_err);
				});
			break;
			default:
				deferred.reject('Please set the coin type!');
			break;
		}
	}
	return deferred.promise;
}
/**
 * Functions for tokens transactions
 */
/**Function to get token balance */
function getTokenBalance(address, contractAddress){
	// console.log("Inside transaction service",address,contractAddress)
	let deferred = Q.defer();
	blockchainServices.ethService.getTokenBalance(address,contractAddress).then(function(result) {
		console.log("Result from get Token Balance",result);
		deferred.resolve(result);
	}).catch(function(t_err) {
		deferred.reject(t_err);
	});
	return deferred.promise;
}
/**
 * Function to transferToken 
 */
function transferToken(coin_type,params){
	if (params.fromAddress != params.toAddress){
	let deferred = Q.defer();
	// let limit = config.txLimit;
	// let pagenum = query.pagenum;
	// console.log(params.pk,params.fromAddress,params.toAddress,params.p_amount,params.contractAddress)
	blockchainServices.ethService.transferToken(params.pk,params.fromAddress,params.toAddress,params.p_amount,params.contractAddress).then(function(result) {
		console.log("Error Form 1")
		deferred.resolve(result);
	}).catch(function(t_err) {
		console.log("Error Form 1")
		deferred.reject(t_err);
	});
	return deferred.promise;
}
else{
	let deferred = Q.defer();
	deferred.reject("Invalid transaction input")
	return deferred.promise;
}
}
/**
 * Function to list token transactions 
 */
function listTokenTransactionsByAddress(coin_type,address,contractAddress){
	let deferred = Q.defer();
	// let limit = config.txLimit;
	// let pagenum = query.pagenum;
	blockchainServices.ethService.listTokenTransactionsByAddress(address,contractAddress).then(function(result) {
		deferred.resolve(result);
	}).catch(function(t_err) {
		deferred.reject(t_err);
	});
	return deferred.promise;
}
/**
 * Check Transaction status
 * @param {hash} coin_type 
 *
 */
function checkTransactionStatus(hash){
	// console.log("Inside transaction service",address,contractAddress)
	let deferred = Q.defer();
	blockchainServices.ethService.checkTransactionStatus(hash)
	.then(function(result){
		deferred.resolve(result);
	})
	.catch(function(t_err) {
		deferred.reject(t_err);
	});
	return deferred.promise;
}

