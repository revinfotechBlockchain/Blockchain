var nodemailer = require('nodemailer');
var nmt = require('nodemailer-mailgun-transport');

var config = require('config.json');

var service = {};

service.sendMail = sendMail;

module.exports = service;

function sendMail(subject, body) {

	// var auth = {
	// 	auth: config.mailgun.auth
	// }

	// var nodemailerMailgun = nodemailer.createTransport(nmt(auth));

	// nodemailerMailgun.sendMail({
	// 	from: 'NEXT Exchange node<mobileweb1989@hotmail.com>',
	// 	to: config.mailgun.to, // An array if you have multiple recipients.
	// 	subject: subject,
	// 	html: body,
	// }, function (err, info) {
	// 	if (err) {
	// 	} else {
	// 	}
	// });

	var smtpConfig = {
		host: config.nodemailer.host,
		port: 465,
		secure: true,
		auth: config.nodemailer.auth
	};

	var transporter = nodemailer.createTransport(smtpConfig);

	var mailOptions = {
		from: config.nodemailer.from_name + '<' + config.nodemailer.from + '>',
		to: config.nodemailer.to, // An array if you have multiple recipients.
		subject: subject,
		html: body
	}

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		} else {
		}
	});
}