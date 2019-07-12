var express = require('express');
var router = express.Router();
var blockchainServices = require('../../services/blockchain');
var Q = require('q');

router.get('/btc', indexbtc);
router.get('/XRP',indexindexXRP);
router.get('/DGB',indexcheckDGB);
router.get('/DASH',indexDASH);
router.get('/CIR',indexCIR);
router.get('/EFL',indexEFL);
router.get('/VITES',indexVITES);
router.get('/ETN',indexETN);
router.get('/NEXT',indexNEXT);
router.get('/eth',indexeth);
router.get('/NLC2',indexNLC2);

module.exports = router;

 function indexbtc(req, res, next) {
	 Q.allSettled([
		blockchainServices.btcService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexindexXRP(req, res, next) {
	 Q.allSettled([
		blockchainServices.rippleService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexcheckDGB(req, res, next) {
	 Q.allSettled([
		blockchainServices.digibytesService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexDASH(req, res, next) {
	 Q.allSettled([
		blockchainServices.dashService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexCIR(req, res, next) {
	 Q.allSettled([
		blockchainServices.ciredoService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexEFL(req, res, next) {
	 Q.allSettled([
		blockchainServices.eGuldenService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexVITES(req, res, next) {
	 Q.allSettled([
		blockchainServices.vitesService.checkStatus()
	]).then(results => {
		var params = {
			title: "Blockchain Nodes Status",
			status: []
		}
		results.forEach(function (result) {
			if (result.state === "fulfilled") {
				params.status.push(result.value);
			}
		});
		res.render('index', params);
	});
}
 function indexETN(req, res, next) {
	Q.allSettled([
	   blockchainServices.electroneumService.checkStatus()
   ]).then(results => {
	   var params = {
		   title: "Blockchain Nodes Status",
		   status: []
	   }
	   results.forEach(function (result) {
		   if (result.state === "fulfilled") {
			   params.status.push(result.value);
		   }
	   });
	   res.render('index', params);
   });
}
function indexNEXT(req, res, next) {
	Q.allSettled([
	   blockchainServices.nextService.checkStatus()
   ]).then(results => {
	   var params = {
		   title: "Blockchain Nodes Status",
		   status: []
	   }
	   results.forEach(function (result) {
		   if (result.state === "fulfilled") {
			   params.status.push(result.value);
		   }
	   });
	   res.render('index', params);
   });
}                     
function indexeth(req, res, next) {
	Q.allSettled([
	   blockchainServices.ethService.checkStatus()
   ]).then(results => {
	   var params = {
		   title: "Blockchain Nodes Status",
		   status: []
	   }
	   results.forEach(function (result) {
		   if (result.state === "fulfilled") {
			   params.status.push(result.value);
		   }
	   });
	   res.render('index', params);
   });
}
function indexNLC2(req, res, next) {
	Q.allSettled([
	   blockchainServices.nlc2Service.checkStatus()
   ]).then(results => {
	   var params = {
		   title: "Blockchain Nodes Status",
		   status: []
	   }
	   results.forEach(function (result) {
		   if (result.state === "fulfilled") {
			   params.status.push(result.value);
		   }
	   });
	   res.render('index', params);
   });
}

