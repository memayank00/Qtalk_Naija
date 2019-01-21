'use strict';

const jwt 	= require('jsonwebtoken'),
	  PATH  = require('path'),
	  ERROR = require(PATH.resolve('./app/config/libs/error')),
	  env   = require(PATH.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	  SECRET= new Buffer(env.secret).toString('base64')

exports.run = (req, key, callback) => {
	let token = req.headers.authorization.replace('Bearer ', "");
	jwt.verify(token, key, function(err, decodedToekn){
		callback(decodedToekn);
	});
};

exports.verify = (req, res, callback) => {
	let token = req.headers.authorization.replace('Bearer ', "");
	jwt.verify(token, SECRET, (err, decodedToekn) => {
		let userId = req.body._id || req.query._id;
		if(!userId) return res.status(412).json({type:"error",message:ERROR.oops(),errors:["User id not provided."]});
		if(userId===decodedToekn._id){
			callback(decodedToekn);
		}else{
			return res.status(417).json({type:"error",message:"Invalid token",errors:[ERROR.jwt()]});
		}
	});
};
exports.required = (req, res, callback) => {
	let userId = req.body._id || req.query._id || req.body.conversationId;

	// if(process.env.NODE_ENV!=='development'){
	// 	let token = req.headers.authorization;
	// 	if(!token) return res.status(417).json({type:"error",message:"User token not provided.",errors:[]});

	// 	/*Verify user token*/
	// 	mysql2.prepared("SELECT user_id, oauth_token FROM `user_access_token` WHERE user_id = ? && oauth_token = ?", [userId, token])
	// 	.then(response => {
	// 		if(response && response.length) callback({_id : userId}); else res.status(417).json({type:"error",message:"User token is not valid.",errors:["User token is not valid."]});
	// 	})
	// 	.catch(error => res.status(417).json({type:"error",message:"Invalid UserId",errors:[error]}));
	// }else{
	// 	/*Bypassing token*/
	// 	callback({_id : userId});
	// }

	if (!userId) res.status(417).json({ type: "error", message: "Invalid UserId", errors: ["User id not provided or invalid."] });

	callback({_id : userId});
};