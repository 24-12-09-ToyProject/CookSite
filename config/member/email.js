const nodemailer = require('nodemailer');

const createNewTransport = () => {
	return nodemailer.createTransport({
		pool : true,
		maxConnections : 1,
		service : "naver",
		host : "smtp.naver.com",
		port : 587,
		secure : false,
		requireTLS : true,
		auth : {
			user : process.env.EMAIL_USER,
			pass : process.env.EMAIL_PASS
		},
		tls : {
			rejectUnauthorized : false
		}
	});
}

module.exports = {
	createNewTransport
};