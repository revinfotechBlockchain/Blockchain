var config = require('config.json');
var crypto = require('crypto');

const ENCRYPTION_KEY = config.encryptOptions.key;
const IV_LENGTH = config.encryptOptions.length;

var service = {};
service.encrypt = encrypt;
service.decrypt = decrypt;

module.exports = service;

function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
	let textParts = text.split(':');
	let iv = new Buffer(textParts.shift(), 'hex');
	let encryptedText = new Buffer(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}