var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var request = require('request');
var encryptService = require('../../services/encrypt');
var blockchainServices = require('../../services/blockchain');

var service = {};

service.create = create;
service.getBalance = getBalance;
service.migrate = migrate;
service.validateAddress = validateAddress;

module.exports = service;

function create(cointype) {
	let deferred = Q.defer();
	let address = {
		pk: null,
		addr: null
	};

	switch (cointype) {
		case 'btc': // Create BitCoin Wallet Address
			blockchainServices.btcService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'XRP': // Create Ripple Wallet Address
			blockchainServices.rippleService.newAccount().then(function(response) {
				address.pk = response.pk;
				address.addr = response.addr;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'DGB': // Create digibytes Wallet Address
			blockchainServices.digibytesService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'DASH': // Create dash Wallet Address
			blockchainServices.dashService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'CIR': // Create ciredo Wallet Address
			blockchainServices.ciredoService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'EFL': // Create eGulden Wallet Address
			blockchainServices.eGuldenService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'VITES': // Create eGulden Wallet Address
			blockchainServices.vitesService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'ETN': // Create Electroneum Wallet Address
			blockchainServices.electroneumService.newAccount().then(function(response) {
				address.pk = response.pk;
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'NEXT': // Create Electroneum Wallet Address
			blockchainServices.nextService.newAccount().then(function(response) {
				console.log("Error wallet 1")
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				console.log("Error wallet 1")
				deferred.reject(err);
			});
			break;
			case 'eth': // Create Next Wallet Address
			blockchainServices.ethService.newAccount().then(function(response) {
				address.pk = encryptService.encrypt(response.privateKey);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
			case 'NLC2': // Create NLC2 Wallet Address
			blockchainServices.nlc2Service.newAccount().then(function(response) {
				console.log(response.pk)
				address.pk = encryptService.encrypt(response.pk);
				address.addr = response.address;
				deferred.resolve(address);
			}).catch(function(err) {
				deferred.reject(err);
			});
			break;
		default:
			deferred.reject('Unsupported Coin!');
		break;
	}
	return deferred.promise;
}

function getBalance(cointype, address, req_query) {
	let deferred = Q.defer();
	switch (cointype) {
		case 'btc':
			blockchainServices.btcService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
			case 'XRP':
				blockchainServices.rippleService.getBalance(address).then(function(balance) {
					deferred.resolve(balance);
				}).catch(function(err) {
					deferred.reject(err);
				})
			break;
		case 'DGB':
			blockchainServices.digibytesService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'DASH':
			blockchainServices.dashService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'CIR':
			blockchainServices.ciredoService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'EFL':
			blockchainServices.eGuldenService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'VITES':
			blockchainServices.vitesService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'ETN':
			blockchainServices.electroneumService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'NEXT':
			blockchainServices.nextService.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'eth':
			blockchainServices.ethService.getBalance(address).then(function(balance) {
				deferred.resolve({balance: balance, locked_balance: 0});
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'NLC2':
			blockchainServices.nlc2Service.getBalance(address).then(function(balance) {
				deferred.resolve(balance);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		default:
			deferred.reject('Unsupported Coin!')
		break;
	}
	
	return deferred.promise;
}

function migrate(cointype, old_address) {
	let deferred = Q.defer();
	let return_val = {
		old_address: old_address,
		new_address: {
			addr: '',
			pk: ''
		},
		amount: 0
	}
	switch (cointype) {
		case 'btc':
			blockchainServices.btcService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'DASH':
			blockchainServices.dashService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'CIR':
			blockchainServices.dashService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'EFL':
			blockchainServices.eGuldenService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'VITES':
			blockchainServices.vitesService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'ETN':
			blockchainServices.electroneumService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'eth':
			blockchainServices.ethService.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		case 'NLC2':
			blockchainServices.nlc2Service.newAccount().then(function(result) {
				return_val.new_address.pk = encryptService.encrypt(result.pk);
				return_val.new_address.addr = result.address;
				return blockchainServices.btcInsightService.getBalance(old_address.addr);
			}).then(function(result) {
				let amount = parseFloat(result.balance);
				if (amount > 0.000006) {
					return_val.amount = amount;
					let old_dec_pk = encryptService.decrypt(old_address.pk);
					blockchainServices.btcInsightService.transfer(old_dec_pk, old_address.addr, return_val.new_address.addr, amount);
				}
				deferred.resolve(return_val);
			}).catch(function(err) {
				deferred.reject(err);
			});
		break;
		default:
			deferred.reject('Unsupported Coin!')
		break;
	}
	
	return deferred.promise;
}

function validateAddress(cointype, address) {
	let deferred = Q.defer();
	switch (cointype) {
		case 'btc':
			blockchainServices.digibytesService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'DGB':
			blockchainServices.digibytesService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'DASH':
			blockchainServices.dashService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break;
		case 'CIR':
			blockchainServices.ciredoService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'EFL':
			blockchainServices.eGuldenService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'VITES':
			blockchainServices.vitesService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'ETN':
			blockchainServices.electroneumService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'NEXT':
			blockchainServices.nextService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'eth':
			blockchainServices.ethService.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		case 'NLC2':
			blockchainServices.nlc2Service.validateAddress(address).then(function(result) {
				deferred.resolve(result);
			}).catch(function(err) {
				deferred.reject(err);
			})
		break
		default:
			deferred.reject('Unsupported Coin!')
		break;
	}
	
	return deferred.promise;
}