'use strict';

const jwt = require('jsonwebtoken'),
	PATH = require('path'),
	mongoose = require('mongoose'),
	ERROR = require(PATH.resolve('./app/config/libs/error')),
	env = require(PATH.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	SECRET = env.secret,
	Log  = require(PATH.resolve('./app/models/logs')),
	{ detect } = require('detect-browser'),
	os = require('os'),
	useragent = require('useragent'),
	{ getTimezone} =require(PATH.resolve("./app/config/libs/date")),
	ObjectId = mongoose.Types.ObjectId;


exports.verify = (req, res, next ) => {
	let token = req.headers.authorization.replace('Bearer ', "");
	jwt.verify(token, SECRET, (err, decodedToekn) => {
		let userId = req.body.loginId || req.query.loginId;
		
		let HexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

		/*User ID is mandatory!*/
		if(!userId) return res.status(412).json({type:"error",message:ERROR.oops(),errors:["User id not provided."]});

		/*check if user id & other ids are valid*/
		if(userId && !HexRegExp.test(userId)) return res.status(412).json({type:"error",message:ERROR.oops(),errors:["User id not a valid ID."]});

		if(userId===decodedToekn._id){
			/**to get decoded information */
			req.user = decodedToekn;
			next();
		
		}else{
			return res.status(417).json({type:"error",message:"Invalid token",errors:[ERROR.jwt()]});
		}
	});
};

/**to save the access logs  */
exports.logs = (req, res, next) => {
	let obj = {
		type:"access",
		ip: (req.connection.remoteAddress).replace("::ffff:", ""),
		browser: useragent.parse(req.headers['user-agent']),
		os: os.type(),
		url: req.headers.referer,
		timezone: getTimezone()

		
	};
	/**to get userId either from parms or body */
	let userId = req.body.loginId || req.query.loginId ;
	/**to check if the userid is valid or not */
	if (ObjectId.isValid(userId)) obj.userId = ObjectId(userId);
	 /**to save the data in Log collection */
	new Log(obj).save()
	next();
};