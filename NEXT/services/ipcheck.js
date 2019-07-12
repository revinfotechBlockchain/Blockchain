var config = require('config.json');
var allowedIPs = config.allowedIPs;
module.exports = function() {
	return function(req, res, next) {
		var remote_address = req.connection.remoteAddress.replace(/^.*:/, '');
		var host = req.get('host');
		var is_allow_localhost = (allowedIPs.indexOf("localhost") !== -1 && host.indexOf("localhost") !== -1);
		if (allowedIPs.indexOf(remote_address) !== -1 || is_allow_localhost) {
			next();
		} else {
			res.end('Requested from unallowed IP Address');
		}
	}
};