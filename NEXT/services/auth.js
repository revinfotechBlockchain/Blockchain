var config = require('config.json');

module.exports = function () {
	return function(req, res, next) {
		var parsed_url = req.url.split('/');
		if (parsed_url[1] == 'wallet' || parsed_url[1] == 'transaction') {
			var auth = req.headers['authorization'];
			if(!auth) {
				res.end('Forbidden access.');
			} else {
				var tmp = auth.split(' ');
				var buf = new Buffer(tmp[1], 'base64');
				var plain_auth = buf.toString(); 
				var creds = plain_auth.split(':');
				var username = creds[0];
				var password = creds[1];

				if((username == config.auth.user) && (password == config.auth.pass)) {
					next();
				}
				else {
					res.end('Forbidden access.');
				}
			}
		}
		else {
			next();
		}
	}
};