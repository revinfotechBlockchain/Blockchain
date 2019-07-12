require('rootpath')();
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');
// var querystring = require('querystring');
var http = require('http');
var server = http.createServer(app);

var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('db');
var config = require('config.json');
var IPCheck = require('./services/ipcheck');
var verifyRequest = require('./services/auth');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Check the IP address
app.use(IPCheck());

// Verify the request
app.use(verifyRequest());

app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use('/', require('./app/view/view.controller'));
app.use('/wallet', require('./app/wallet/wallet.controller'));
app.use('/transaction', require('./app/transaction/transaction.controller'));
app.use('/alias',require('./app/alias/alias.controller'));
app.use('/assets',require('./app/assets/assets.controller'));

app.all('*', function(req, res, next) {
	res.send({status: false, message: 'Bad request!'});
});

app.use(function(err, req, res, next) {
	res.send({status: false, message: err.message});
});

db.connect(function(err) {
	if (err) {
	} else {
	}
	var port = 3000;
	server.listen(port, function () {
	});
})
