var Q = require('q');
var request = require("request");
var _ = require('lodash');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var config = require('config.json');

const GAS_PRICE = 10000000000;
const GAS_LIMIT = 25000;

const contractABI = require('human-standard-token-abi');

// import smart contracts
var sERC20ABI = require('abi/next'); // NEXT Token
// web3.setProvider(new web3.providers.HttpProvider(config.nodeServer.eth));
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/swptqj6853hAYSLLRyPz"));
// making TXPOOL work to get pending transactions before mining them. Only works with GETH not Parity
//web3.eth.extend({
//  property: 'txpool',
//  methods: [{
//    name: 'content',
//    call: 'txpool_content'
//  },{
//    name: 'inspect',
//    call: 'txpool_inspect'
//  },{
//    name: 'status',
//    call: 'txpool_status'
//  }]
//});

var service = {};
service.newAccount = newAccount;
service.getBalance = getBalance;
service.transfer = transfer;
service.listTransactionsByAddress = listTransactionsByAddress;

service.getTokenBalance = getTokenBalance;
service.transferToken = transferToken;
service.getFee = getFee;
service.listTokenTransactionsByAddress = listTokenTransactionsByAddress;
service.checkStatus = checkStatus;
service.checkTransactionStatus = checkTransactionStatus;
module.exports = service;

function newAccount() {
	let deferred = Q.defer();
	deferred.resolve(web3.eth.accounts.create());
    return deferred.promise;
}

function getFee(coin_type) {
	// console.log('GAS COIN: '+coin_type);
	// console.log('GAS PRICE: '+GAS_PRICE);
	// console.log('GAS_LIMIT: '+GAS_LIMIT);
	let fee = 0;

	if (coin_type === 'eth') {
		fee = (GAS_PRICE * GAS_LIMIT).toString();
	}
	else {
		// If token -> You need 2,5x more gas to get it executed
		fee = (GAS_PRICE * GAS_LIMIT * 2.5).toString();
	}
	// console.log('GAS FEE: '+fee);

	return web3.utils.fromWei(fee);

	 //try {
	 //	web3.eth.getGasPrice().then(function(gasPrice) {
	 //		console.log('Gas Price: '+gasPrice);
	 //	 	if (coin_type === 'eth') {
	 //	 		web3.eth.estimateGas({}).then(function(gasEstimate) {
	//				console.log('Gas Estimate: '+gasEstimate);
	// 	 			fee = (parseFloat(gasPrice) * parseFloat(gasEstimate) / 1e18).toFixed(9);
	// 	 			console.log('Gas fee: '+fee);
	// 	 			deferred.resolve(fee);
//			});
	 	 //	} else { // For token, gasEstimate is 250K
	 //	 		fee = (parseFloat(gasPrice) * 250000 / 1e18).toFixed(9);
	//			console.log('Gas fee: '+fee);
	// 	 		deferred.resolve(fee);
	// 	 	}
	// 	 });
	 //} catch(err) {
	 //	deferred.reject(err.message);
	 //}
	 //return deferred.promise;
}

function getBalance(address) {
	let deferred = Q.defer();
	if (!address) {
		deferred.reject('Invalid Address!');
	}
	try {
		web3.eth.getBalance(address).then(function(value) {
			let balance = web3.utils.fromWei(value.toString(), 'ether');
			deferred.resolve({balance: balance, locked_balance: 0});
	    }).catch(function(err) {
	    	deferred.reject(err.message);
	    });
	} catch(error) {
		deferred.reject(error.message);
	}
    return deferred.promise;
}

function transfer(pk, fromAddress, toAddress, p_amount) {
	let deferred = Q.defer();
	let fee = getFee('eth'); // Fee as ether
	let tx_nonce = 0;
	var tx_gas_price = 0;
	var tx_gas_limit = 0;

	// console.log('ETH: Starting');
	// console.log('ETH: fromAddress: '+fromAddress);
	// console.log('ETH: toAddress: '+toAddress);
	// console.log('ETH: Amount: '+p_amount);
	// console.log('ETH: FeeAmount '+fee);

	try {
		if (parseFloat(p_amount) < parseFloat(fee)) {
			throw {message: 'Amount should be bigger than fee!'};
		}
		let w_amount = web3.utils.toWei(p_amount.toString()) - web3.utils.toWei(fee.toString());
		getBalance(fromAddress).then(function(balance) {
			if (balance.balance < p_amount) {
				throw {message: 'Insufficient funds!'};
			} else {
				//return web3.eth.getTransactionCount(fromAddress, "pending");
				return getNonce(fromAddress);
			}
		}).then(function(nonce) {
			tx_nonce = nonce;
            // console.log('ETH: nonce count--------');
            // console.log(nonce);
			return web3.eth.estimateGas({
				from: fromAddress,
				to: toAddress
			});
		}).then(function(estimated_gas_limit) {
			// console.log('ETH: estimated_gas_limit--------');
			// console.log(estimated_gas_limit);
			tx_gas_limit = estimated_gas_limit;
			return web3.eth.getGasPrice();
		}).then(function(estimated_gas_price) {
			tx_gas_price = estimated_gas_price;
			let privateKey = new Buffer(pk.replace('0x',''),'hex');
			let rawTx = {
				nonce: tx_nonce,
				gasPrice: web3.utils.toHex(tx_gas_price),
				gasLimit: web3.utils.toHex(tx_gas_limit),
				to: toAddress,
				value: web3.utils.toHex(w_amount),
			};


			// console.log('ETH: RawTX: '+JSON.stringify(rawTx));

			let tx = new Tx(rawTx);
			tx.sign(privateKey);

			let serializedTx = tx.serialize();

			let transaction = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

			transaction.on('transactionHash', (hash) => {
			})
			.on('receipt', (receipt) => {
				let wei_tx_fee = receipt.gasUsed * tx_gas_price;
				// console.log('ETH: TransactionID: '+receipt.transactionHash);
				deferred.resolve({txid: receipt.transactionHash, txfee: web3.utils.fromWei(wei_tx_fee.toString(), 'ether')});
			})
			.on('confirmation', (confirmationNumber, receipt) => {
			})
			.on('error', (error, receipt) => {
				// console.log('error-------------------');
				// console.log(error);
				deferred.reject(error.message);
			});
			// transaction.once('transactionHash', function(hash) {
			// 	deferred.resolve({txid: hash});
			// });
			// transaction.once('error', function(err) {
			// 	console.log(err.message);
			// 	deferred.reject(err.message);
			// 	// deferred.reject('Sorry, Ethereum network is busy now. Please try again in a few of minutes.');
			// });
			// transaction.on('receipt', function() {
			// })
		}).catch(function(err) {
			// console.log('err===================');
			// console.log(err);
			deferred.reject(err.message);
		});
	} catch(error) {
		// console.log('error1-------------------');
		// console.log(error);
		deferred.reject(error.message);
	}
	return deferred.promise;
}

function listTransactionsByAddress(addr) {
	console.log("Inside list transaction eth")
	// console.log("Inside list transaction ",addr)
	let deferred = Q.defer();
	let return_txs = [];

	// if (pagenum === undefined) {
	// 	pagenum = 1;
	// }

	// if (limit === undefined) {
	// 	limit = 10;
	// }

	// let url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + addr + "&startblock=0&endblock=99999999&page=" + pagenum + "&offset=" + limit + "&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	let url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + addr + "&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	// console.log("this is the uri",url)
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		// console.log("inside the function",body)
		if (error) {
			deferred.reject('Error while getting the ETH transaction details by address');
		} else {
			let r_txs = [];
			if (body.length > 0) {
				r_txs = JSON.parse(body);
				// console.log("This is r_txs",r_txs)
				if (Array.isArray(r_txs.result) && r_txs.result.length > 0) {
					_.each(r_txs.result, (tx) => {
						// console.log("This is transaction",tx)
						let amount = parseFloat(tx.value) / 1e18;
						let fee = parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice) / 1e18;
						let sender_amount = amount + fee;
						if (tx.to.toLowerCase() == addr.toLowerCase()) {
							return_txs.push({
								txid: tx.hash,
								type: 'receive',
								time: tx.timeStamp,
								amount: amount,
							});
							console.log("Return tx",return_txs)
						}
						deferred.resolve(r_txs);
					});
					
				}
				
			}
			// console.log("This is the return value",return_txs)
			
		}
	});
	return deferred.promise;
}

function getTokenBalance(address, contractAddress) {
    // console.log("Inside token balance of eth",address,contractAddress)
	// web3.eth.txpool.status().then(status => {
	// 	console.log('status');
	// 	console.log(status);
	// }).catch(err => {
	// 	console.log('error');
	// 	console.log(err);
	// });

	let deferred = Q.defer();
	if (!address) {
		deferred.reject('Invalid Address!');
	}
	let tokenContract = null;
	let tokenDecimals = 18;
	try {
		_getABI(contractAddress).then(function(contractABI) {
			tokenContract = new web3.eth.Contract(contractABI, contractAddress);
			// console.log("This is token contract",tokenContract.methods.decimals);
			if (typeof tokenContract.methods.decimals == 'function') {
				return tokenContract.methods.decimals().call();
			} else {
				// console.log("Inside decimal else")
				return 18;
			}
		}).then(async function(decimals) {
			// console.log("Inside decimal of eth",await tokenContract.methods)
			tokenDecimals = parseFloat(decimals);
			return await tokenContract.methods.balanceOf(address).call();
		}).then(function(balance) {
			console.log("Inside balance",balance);
			let token_balance = (balance / Math.pow(10, tokenDecimals)).toFixed(9);
			// console.log("Inside balance ***", token_balance);
			deferred.resolve({balance: token_balance, locked_balance: 0});
	    }).catch(function(err) {
			// console.log("error from here2")
	    	deferred.reject(err.message);
	    });
	} catch(error) {
		// console.log("error from here")
		deferred.reject(error.message);
	}
	// console.log("return response",{balance: token_balance, locked_balance: 0})
    return deferred.promise;
}

function transferToken(pk, fromAddress, toAddress, p_amount, contractAddress) {
	// console.log("Inside transfer token function",+"PK:"+pk,+"fromAddress:"+ fromAddress,+"toAddress:"+ toAddress,+"p_amount:"+ p_amount,+"contractAddress:"+ contractAddress)
	// console.log('Starting: ERC20 transfer');
	return new Promise(async function (resolve, reject) {
        let tokenContract = web3.utils.toHex(0);
        let tx_nonce = web3.utils.toHex(0);
        let tx_gas_price = web3.utils.toHex(0);
        let tx_data = web3.utils.toHex(0);
		let privateKey = web3.utils.toHex(0);
		const GAS_LIMIT = 100000;

		// console.log('ERC20: Starting');
		// console.log('ERC20: fromAddress: '+fromAddress);
		// console.log('ERC20: toAddress: '+toAddress);
		// console.log('ERC20: Amount: '+p_amount);
		// console.log('ERC20: Contract: '+contractAddress);

        try {
			console.log("Error from here 1")
        	// console.log('ERC20: Get ABI');
            _getABI(contractAddress).then(function (contractABI) {
                tokenContract = new web3.eth.Contract(contractABI, contractAddress);
                // console.log('ERC20: TokenContract: '+tokenContract);
                return getTokenBalance(fromAddress, contractAddress);
            }).then(function (balance) {
				console.log("Error from here 2")
                if (parseFloat(balance.balance) < p_amount) {
                    throw {message: 'Insufficient funds!'};
                } else {
                    if (typeof tokenContract.methods.decimals == 'function') {
                        return tokenContract.methods.decimals().call();
                    } else {
                        return 18;
                    }
                }
            }).then(function (decimals) {
				console.log("Error from here 3")
				// console.log('ERC20: Decimals: '+decimals);

				let amount = p_amount * Math.pow(10, decimals);
                amount = "0x" + amount.toString(16);

				// console.log('ERC20: Amount ORIG: '+p_amount);
                // console.log('ERC20: Amount: '+amount);
				// console.log('ERC20: Amount HEX: '+web3.utils.toHex(amount));
                // console.log('ERC20: Amount BN: '+web3.utils.toBN(amount));

				tx_data = tokenContract.methods.transfer(toAddress, web3.utils.toHex(amount)).encodeABI();
                console.log("Error from here 3.1",tx_data)
                //return web3.eth.getTransactionCount(fromAddress, "pending");
                return getNonce(fromAddress);
            }).then(function (nonce) {
				console.log("Error from here 4")
                tx_nonce = nonce;
                // console.log('ERC20: Nonce: '+nonce);
                return web3.eth.getGasPrice();
            }).then(function (estimated_gas_price) {
				console.log("Error from here 5")
                tx_gas_price = estimated_gas_price;
                return web3.eth.estimateGas({
                    from: fromAddress,
                    to: toAddress,
                    data: tx_data
                });
            }).then(function (estimated_gas_limit) {
				console.log("Error from here 6",tx_nonce)
                let rawTx = {
                    nonce: web3.utils.toHex(tx_nonce),
                    gasPrice: web3.utils.toHex(tx_gas_price),
                    gasLimit: web3.utils.toHex(GAS_LIMIT),
                    to: contractAddress,
                    value: web3.utils.toHex(0),
                    data: tx_data
                };

				// console.log('ERC20: RawTX: '+JSON.stringify(rawTx));
                let tx = new Tx(rawTx);

				if(pk.indexOf('0x') !== -1){
					console.log("Error from here 7",rawTx)
					privateKey = new Buffer(pk.replace('0x',''),'hex');
				}else{
					privateKey = Buffer.from(pk, 'hex');
				}

                tx.sign(privateKey);
                console.log("Error from here 7.1")
                let serializedTx = tx.serialize();
                let transaction = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
                transaction.on('transactionHash', (hash) => {
					resolve({
						txid: hash
					});
				})
                .on('receipt',async (receipt) => {
						console.log("Error from here 7.3",receipt)
                        let wei_tx_fee = await receipt.gasUsed * tx_gas_price;
						console.log('ERC20: TransactionID: '+receipt.transactionHash);
                        resolve({
                            txid: receipt.transactionHash,
                            txfee: web3.utils.fromWei(wei_tx_fee.toString(), 'ether')
                        });
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                    })
                    .on('error', (error) => {
                        console.log(error);
                        reject(error.message);
                    });
            }).catch(function (err) {
                reject(err.message);
            });
        } catch (error) {
            reject(error.message);
        }
    })
}

// Only for Parity local node
function getNonce(address) {
	console.log("Error from here Nonce")
    return new Promise(async function (resolve, reject) {
        var confirmed_transactions = 0;
        var pending_transactions = 0;
        var nonce = 0;

        try {
			console.log("Error from here Nonce 1")
            confirmed_transactions = await web3.eth.getTransactionCount(address);
            console.log('--- confirmed transactions: '+confirmed_transactions,address);
            pending_transactions = await sendMethod(address);
            console.log('--- pending transactions: '+pending_transactions);
            nonce = confirmed_transactions + pending_transactions;
            console.log('--- new nonce: '+nonce);
            resolve(nonce);
        } catch (err) {
            reject(err)
        }

    })
}
// Only for Parity local node
function sendMethod(address) {
	console.log("Error from send method 1")
    return new Promise(function (resolve, reject) {
        var pending_tx = 0;
        console.log("Error from send method 2")
        request('https://mainnet.infura.io/swptqj6853hAYSLLRyPz',{
			jsonrpc: "2.0",
            method: "parity_pendingTransactions",
            params: [],
            id: 1
		},(error, result, body)=>{
			console.log(error, result, body)
			console.log("Error from send method 3")
            //console.log('--error: '+error);
            if (error) reject(error);
            if (result.result) {
				console.log("Error from send method 3")
                //console.log('--results: '+JSON.stringify(result.result));
                const p_tx = _.filter(result.result, function (f) {
                    //console.log('--results: '+JSON.stringify(f));
                    return f.from.toLowerCase() === address.toLowerCase();
                });
                if (p_tx.length > 0) {
					console.log("Error from send method 3")
                    pending_tx = pending_tx+p_tx.length;
                    return resolve(pending_tx)
                }else {
					console.log("Error from send method 3")
                    return resolve(pending_tx)
                }
            } else {
				
                return resolve(pending_tx)
            }
        })
    }); 
}

function listTokenTransactionsByAddress(address, contract_address) {
	// console.log("Inside list token transaction by address",address, contract_address)
	let deferred = Q.defer();
	let return_txs = [];

	let url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + contract_address + "&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		if (error) {
			deferred.reject('Error while getting the ETH transaction details by address');
		} else {
			let r_txs = [];
			if (body.length > 0) {
				r_txs = JSON.parse(body);
				if (Array.isArray(r_txs.result) && r_txs.result.length > 0) {
					// console.log("Inside list token transaction by address if body")
					_.each(r_txs.result, (tx) => {
						
						let tx_input = tx.input;
						let tx_method_id = tx_input.substring(0, 10);
						let tx_receiver = tx_input.substring(10, 74);
						let amount = parseInt(tx_input.substring(74), 16) / 1e18;
						// console.log("++++++++++++++++++",tx_receiver.toLowerCase().indexOf(address.substring(2).toLowerCase()))
						// let r_address = address.substring(2)

						// if (tx.to.toLowerCase() == addr.toLowerCase()) {
						if (tx_receiver.toLowerCase().indexOf(address.substring(2).toLowerCase()) > -1) {
							// console.log("Inside last IF",return_txs)
							return_txs.push({
								txid: tx.hash,
								type: 'receive',
								time: tx.timeStamp,
								amount: amount,
							});
						}
					});
				}
			}
			// console.log("Result from list token transactions", return_txs)
			deferred.resolve(return_txs);
		}
	});
	return deferred.promise;
}

function _getABI(contract_address) {
	let deferred = Q.defer();

	let url = "https://api.etherscan.io/api?module=contract&action=getabi&address=" + contract_address;
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		if (error) {
			deferred.reject({message: 'Error while getting the ABI'});
		} else {
			let contractABI = null;

			if (body && body.length > 0) {
				try {
					let json_body = JSON.parse(body);
					if (json_body.status == 0 && json_body.result == "Invalid Address format") {
						deferred.reject({message: 'Invalid contract address'});
					} else {
						contractABI = json_body.result;
						if (contractABI && contractABI != '') {
							deferred.resolve(JSON.parse(contractABI));
						} else {
							deferred.resolve(sERC20ABI);
						}
					}
				} catch (err) {
					deferred.resolve(sERC20ABI);
				}



				// try {
				// 	var json_body = JSON.parse(body);
				// } catch (err) {
				// 	deferred.resolve(sERC20ABI);
				// }

				// if (json_body.status == 0 && json_body.result == "Invalid Address format") {
				// 	deferred.reject({message: 'Invalid contract address'});
				// } else {
				// 	contractABI = json_body.result;
				// 	if (contractABI && contractABI != '') {
				// 		try {
				// 			deferred.resolve(JSON.parse(contractABI));
				// 		} catch(err) { // Return Standard ERC20 Token ABI when unexpected error
				// 			deferred.resolve(sERC20ABI);
				// 		}
				// 	} else {
				// 		deferred.resolve(sERC20ABI);
				// 	}
				// }
			} else {
				deferred.reject({message: 'Returned Empty Contract ABI!'});
			}

		}
	});

	return deferred.promise;
}

function checkStatus() {
	let deferred = Q.defer();

	let return_val = {
		coin: "ETH",
		status: false
	}

	web3.eth.isSyncing().then(result => {
		if (result) {
			return_val.status = "Syncing";
		} else {
			return_val.status = "OK";
		}
		deferred.resolve(return_val);
	}).catch(err => {
		return_val.status = false;
		deferred.resolve(return_val);
	})

	return deferred.promise;
}

function checkTransactionStatus(hash){
	console.log(hash)
	let deferred = Q.defer();
	let a = check(hash);
	async function check(hash){
	let transactionstatus = await web3.eth.getTransactionReceipt(hash)
	.then(transactionstatus => {
		console.log(transactionstatus)
		if (transactionstatus == null){
			deferred.resolve("Pending");
		}
		else if (transactionstatus.status == true){
		deferred.resolve("Success");
		}
		else if (transactionstatus.status == false){
	    deferred.resolve("Failed");
		}
	}).catch(err => {
		deferred.reject("Incorrect Hash");
	})
  }
	return deferred.promise;
}

// function _getTokenObj(token_name) {
// 	if (token_name == 'next') {
// 		return nextToken;
// 	} else {
// 		return false;
// 	}
// }

// function _getTokenContractAddress(token_name) {
// 	if (token_name == 'next') {
// 		return nextTokenContractAddress;
// 	} else {
// 		return false;
// 	}
// }
