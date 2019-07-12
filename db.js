var mysql = require('mysql');

var mysqlConnection = {
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nextexchange_node_db'
}
var state = {
  pool: null
}
exports.connect = function(done) {
	state.pool = mysql.createPool(mysqlConnection);
	done();
}
exports.get = function() {
  return state.pool
}