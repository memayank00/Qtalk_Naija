const path = require("path"),
	  jwt  = require("jsonwebtoken"),
	  _    = require("lodash"),
	  formidable = require('formidable'),
	  fs = require('fs-extra'),
	  mv = require('mv'),
	  ASYNC  =   require('async'),
	  crypto =   require('crypto'),

	  /**/
	  env    = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	  error  = require(path.resolve(`./app/config/libs/error`)),
	  Mailer  = require(path.resolve(`./app/config/libs/mailer`)),
	  HostPath  = require(path.resolve(`./app/config/libs/hostPath`)),
	  Push    = require(path.resolve('./app/config/libs/pushNotification')),
	  Badge   = require(path.resolve(`./app/config/libs/badgeCount`)),
	  App  = require(path.resolve("./app/controllers/frontend/AppController")),

	  User = require(path.resolve("./app/models/User")),
	  Notification = require(path.resolve("./app/models/Notification")),
	  Request = require(path.resolve("./app/models/Request"));
	  ObjectId= require("mongoose").Types.ObjectId;

class MapController extends App {
	constructor(){
		super();
		/**/
		//this.getAllTrackUser = this.getAllTrackUser.bind(this);
		this.sendTrackRequest = this.sendTrackRequest.bind(this);
		this.recievedSentTrackRequest = this.recievedSentTrackRequest.bind(this);	
		this.acceptDeclineTrackRequest = this.acceptDeclineTrackRequest.bind(this);	
		this.cancleTrackRequest = this.cancleTrackRequest.bind(this);
		this.trackList = this.trackList.bind(this);
		this.whoTrackMe = this.whoTrackMe.bind(this);
		this.stopBeingTrack = this.stopBeingTrack.bind(this);
		this.pauseSelfTracking = this.pauseSelfTracking.bind(this);
		this.getPauseStatus = this.getPauseStatus.bind(this);
		this.push = new Push();
	}
	/**this method is used to get all list of users to send track
    * method : GET
    * endpoint: /api/tack-list?page=1&text=
    */
	// getAllTrackUser(req,res){
	 	
	// 	let user = req.user,
	// 		obj = req.query,
	// 		limit = parseInt(process.env.LIMIT) || 10,
	// 		offset = parseInt((obj.page - 1) * limit),
	// 		match = { $and: [{ _id: { '$ne': ObjectId(user._id) } }, { mapAvailability: true }] },
	// 		select2 = {},
	// 		select = {},
	// 		_check_friend_status = function (array = []) {
	// 			return new Promise((resolve, reject) => {
	// 				ASYNC.eachOfSeries(array, (val1, index, _callback) => {
	// 					let filterObj = {
	// 						$and: [{
	// 							to_userId: ObjectId(val1._id),
	// 							from_userId: ObjectId(user._id), type: 'Track'
	// 						}]
	// 					};
	// 					Request.findOne(
	// 						filterObj,
	// 						{ type: 1, status: 1, to_userId: 1, from_userId: 1 }
	// 						, (err, found) => {
	// 							if (err) { _callback(err) }
	// 							else {
	// 								if (found) {
	// 									if (found.status) {
	// 										val1.friend = found.status;
	// 									}
	// 									_callback();
	// 								}
	// 								else { val1.friend = ""; _callback(); };

	// 							}
	// 						})
	// 				}, (err) => {
	// 					if (err) reject(err);
	// 					else resolve(array);
	// 				})
	// 			})
	// 		};

	// 	if (obj.text) {
	// 		match = {
	// 			$and: [
	// 				{
	// 					$or: [
	// 						{ username: new RegExp(`${obj.text}`, 'i') },
	// 						{ name: new RegExp(`${obj.text}`, 'i') },
	// 						{ email: new RegExp(`${obj.text}`, 'i') },
	// 						{ mobile: new RegExp(`${obj.text}`, 'i') },
	// 						/*{ username: new RegExp(`^${obj.text}`, 'i') },
	// 						{ name: new RegExp(`^${obj.text}`, 'i') },
	// 						{ email: new RegExp(`^${obj.text}`, 'i') },*/
	// 					]
	// 				},
	// 				{ _id: { '$ne': ObjectId(user._id) } },
	// 				{ mapAvailability: true }
	// 			]
	// 		};
	// 	}

	// 	let TrackQuery = [
	// 		{
	// 			$match: { _id: ObjectId(user._id) }
	// 		},
	// 		{
	// 			$project: { trackies: 1 }
	// 		},
	// 		{ $unwind: "$trackies" },
	// 		{
	// 			$project: { trackId: "$trackies.user_id" }
	// 		},
	// 		{
	// 			$group: {
	// 				_id: "$_id",
	// 				trackArray: { $addToSet: '$trackId' }
	// 			}
	// 		}
	// 	],
	// 		_get_user_list = function (array = []) {
	// 			let select3 = {};
	// 			return new Promise((resolve, reject) => {
	// 				if (array.length > 0) {
	// 					select3 = { username: 1, name: 1, email: 1, fullno: 1, mobile: 1, ccode: 1, profilePicture: 1, location: { $ifNull: ['$location', ''] }, isfriend: { $cond: { if: { $in: ["$_id", array[0].trackArray] }, then: true, else: false } } };
	// 				} else {
	// 					select3 = { username: 1, name: 1, email: 1, fullno: 1, mobile: 1, ccode: 1, profilePicture: 1, location: { $ifNull: ['$location', ''] }, isfriend: { $cond: { if: { $in: ["$_id", []] }, then: true, else: false } } };
	// 				}
	// 				User.aggregate([
	// 					{ $match: match },
	// 					{
	// 						$project: select3
	// 					},
	// 					{
	// 						$match: { isfriend: false }
	// 					},
	// 					{ $skip: offset },
	// 					{ $limit: limit },

	// 				], (err, result) => {
	// 					if (err) reject(err);
	// 					else resolve(result);
	// 				})
	// 			})
	// 		};

	// 	User.aggregate(TrackQuery, (err, userList1) => {
	// 		if (userList1.length > 0) {
	// 			select = { username: 1, name: 1, email: 1, fullno: 1, mobile: 1, ccode: 1, profilePicture: 1, location: { $ifNull: ['$location', ''] }, trackID: { $cond: { if: { $in: ["$_id", userList1[0].trackArray] }, then: true, else: false } } };
	// 			select2 = { username: 1, name: 1, email: 1, location: 1, fullno: 1, mobile: 1, ccode: 1, count: "count", trackID: { $cond: { if: { $in: ["$_id", userList1[0].trackArray] }, then: true, else: false } } };
	// 		} else {
	// 			select = { username: 1, name: 1, email: 1, fullno: 1, mobile: 1, ccode: 1, profilePicture: 1, location: { $ifNull: ['$location', ''] }, trackID: { $cond: { if: { $in: ["$_id", []] }, then: true, else: false } } };
	// 			select2 = { username: 1, name: 1, email: 1, location: 1, fullno: 1, mobile: 1, ccode: 1, count: "count", trackID: { $cond: { if: { $in: ["$_id", []] }, then: true, else: false } } }
	// 		}
	// 		let query = [
	// 			{
	// 				$facet: {
	// 					count: [
	// 						{
	// 							$match: match
	// 						},
	// 						{
	// 							$project: select2
	// 						},
	// 						{
	// 							$match: { trackID: false }
	// 						},
	// 						{
	// 							$group: {
	// 								_id: '$count',
	// 								total: { $sum: 1 }
	// 							}
	// 						}
	// 					],
	// 					userList: [
	// 						{
	// 							$match: match
	// 						},
	// 						{
	// 							$project: select
	// 						},
	// 						{ $skip: offset },
	// 						{ $limit: limit }
	// 					]
	// 				}
	// 			}
	// 		];
	// 		User.aggregate(query, async (err, userList) => {
	// 			let UserDataList = await _get_user_list(userList1);
	// 			if (err) res.json(this.response({ err: err, message: error.oops() }));
	// 			else {
	// 				let total = (UserDataList.length > 0) ? userList[0].count[0].total : 0;
	// 				if (UserDataList.length > 0) {
	// 					let userListData = await _check_friend_status(UserDataList);
	// 					return res.json(this.response({ data: { users: UserDataList, total: total }, message: "User found" }));
	// 				} else {
	// 					return res.json(this.response({ data: { users: UserDataList, total: total }, message: "User Not found" }));
	// 				}
	// 			}
	// 		});

	// 	});
	// }
	/**this method is used to send Track request
    * method : POST
    * endpoint: /api/send-track-request
    */
	 sendTrackRequest(req,res){
		let user    = req.user,that = this,
			obj     = req.body,
		    match   = {$and:[{to_userId:obj.to_userId,from_userId: user._id,type:'Track'}]},
	  	    select  = {to_userId:1,from_userId:1,type:1,status:1};
	  	    obj['from_userId'] = user._id;
	  	    obj['type'] = 'Track';
	  	    obj['status'] = 'Pending';
	  	//var badge = await Badge.badge(obj.to_userId)
	  	let _obj_to_save = new Request(obj), 
	  	    _check_for_request = function(){
	  	    	return new Promise((resolve, reject) => {
		            Request.findOne(match,select,(err,request)=>{
		            	if(err) reject(err);
		            	else if(request && request.status === 'Pending') reject('Your Track request is Pending.');
		            	else if(request && request.status === 'Rejected') resolve('Rejected');
		            	else if(request && request.status === 'Accepted') reject('This user already in your track list.');
		            	else if(request && request.status === 'Deleted') resolve('Deleted');
		            	else resolve('Request to send.')

		            })
				}); 
	  	    },
	  	    _save_for_request = function(result){
	  	    	let _status_array = ['Rejected','Deleted'];
	  	    	return new Promise((resolve, reject) => {
		  	    	if(_status_array.includes(result) ){
		  	    		/*remove previous request from request model*/
		  	    		Request.remove(match,(err,result)=>{});
		  	    	}
		  	    	/*save track request obj in request collection*/
		  	    	_obj_to_save.save((err,saved_obj)=>{
		  	    		resolve(saved_obj);
				  	})
		  	    });
	  	    },
	  	    _save_for_notification = function(result){
	  	    	//console.log('user---1 ',user);
	  	    	let _notification = new Notification({
	  	    			imageUrl: user.profilePicture,
	  	    	    	title: 'Tracking Request',
						content: `${user.name} sent you tracking request`, 
						to:  obj.to_userId,
						from:  user._id,
						types: `Track`,
						meta : { to: obj.to_userId, from:user._id}
	  	    	    });
	  	    	console.log('_notification---1 ',_notification);
	  	    	return new Promise((resolve, reject) => {
		  	    	/*save notification in */
		  	    	_notification.save((err,saved_obj)=>{
		  	    		console.log('saved_obj---1 ',saved_obj);
		  	    		resolve(result);
				  	})
		  	    });
	  	    },
	  	    _sendPushNotification = function(result){
	  	    	console.log('_sendPushNotification------')
	  	    	
	  	    	return new Promise((resolve, reject) => {
	  	    		
    				User.findOne({_id:obj.to_userId},{mobileDevice:1} , (err, result) => {
	  	    		
                          let data = result.mobileDevice;
                         
                            if(data && data.length>0){
                               //console.log(response.body);  
                               data.map((tokenData) => {
                                const pushData = obj;
                                console.log('tokenData-- ',tokenData)
                                if(tokenData.deviceType=='ios'){
                                    console.log('ios push-----')
                                    /*send push notification to IOS device*/
                                    that.push.APN(
                                        tokenData.deviceToken, 
										"you have a Tracking Request",
										0, 
										pushData,
										'2',
										obj.to_userId
                                    )
                                    .then(result => {
                                        /*send emit to user*/
                                    })
                                    .catch(error => false);
                                }else{
                                    console.log('Andriod push----- ')
                                    /*send push notification to Android device*/
                                    that.push.FCM(
                                        tokenData.deviceToken, 
										"you have a Tracking Request",
										0, 
										pushData,
										'2',
										obj.to_userId
                                    )
                                    .then(result => {
                                        /*send emit to user*/
                                    })
                                    .catch(error => false);
                                  }
                               });
                            }
                          
                          console.log("6---------------");
                          //res.json({ type: "success", message: "Calling started..." });
                      });
		  	    	resolve(result);
		  	    });
	  	    };
	  	    _check_for_request().then((result)=>{
	  	    	return _save_for_request(result)
	  	    }).then((result)=>{
	  	        return _save_for_notification(result)
	  	    }).then((result)=>{
	  	        return _sendPushNotification(result)
	  	    }).then((result)=>{
	  	        res.json(this.response({ data: result._id, message: "Tracking request has been sent." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })  
	}
	/**this method is used to see recived & sent track request
    * method : GET
    * endpoint: /api/recieved-sent-track-request
    */
	recievedSentTrackRequest(req,res){
		let user    = req.user,
			obj     = req.query,
			query   = new Object(),
			/*this method used to get request*/
			_check_for_request = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match =(obj.type==='sent')? {from_userId:ObjectId(user._id)}:{to_userId:ObjectId(user._id)},
	  	    			project = (obj.type==='sent')? {to_userId:1}:{from_userId:1},
	  	    			addToSet = (obj.type==='sent')? `$to_userId`:`$from_userId`;
	  	    			project['group_array']=null;
	  	    			match['status']='Pending';
	  	    			match['type']='Track';
	  	    		query = [
			  	    			{
			  	    				$match:match
				  	    		},
				  	    		{
				  	    			$project:project
				  	    		},
				  	    		{
				  	    			$group : {
									    _id: "$group_array",
									    itemsSold: { $addToSet:addToSet}
								    }
								}
			  	    		]
		            Request.aggregate(query,(err, userList)=>{
		            	if(err) reject(err);
		            	else if (userList.length>0)resolve(userList);
		            	else reject('request not found.')
		            })
				}); 
	  	    },
	  	    /*this method used to get user informations for listing*/
	  	     _get_users_info = function(result){	
	  	    	return new Promise((resolve, reject) => {
	  	    		let user_ids = result[0].itemsSold;
	  	    		let query  = [
	  	    					{
			  	    				$match:{ _id: { $in: user_ids }}
				  	    		},
				  	    		{
				  	    			$project:{
				  	    				name:1,profilePicture:1,location:{$ifNull:["$location",""]}
				  	    			}
				  	    		}
	  	    		]
		  	    	User.aggregate(query,(err,users)=>{
		  	    		if(err) reject(err);
			            else if(users.length>0) resolve(users);
			            else reject('Users not found');
		  	    	})
		  	    });
	  	    	
	  	    };
	  	    _check_for_request().then((result)=>{
	  	    	return _get_users_info(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Request found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
	}
	/**this method is used to see recived & sent track request
    * method : POST
    * endpoint: /api/accept-decline-track-request
    */

	acceptDeclineTrackRequest(req,res){
		let user    = req.user,
			obj     = req.body,
			query = new Object(), 
			/*this method used update status of request*/
			_update_request_status = function(){
				let match = {to_userId:user._id,from_userId:obj._id,type:'Track'},
					toUpdate = (obj.type ==='Accepted')?{$set:{status : "Accepted"}}:{$set:{status : "Rejected"}};
	  	    	return new Promise((resolve, reject) => {
	  	    		Request.findOne(match,(err,result)=>{
	  	    			if(err) reject(err);
	  	    			if(result){
	  	    				Request.update(match,toUpdate,(err,result)=>{
			  	    			if(err) reject(err);
			  	    			else resolve(result);
			  	    		})
	  	    			}else{
	  	    				reject('It seems this request is invalid.')
	  	    			}
	  	    		});	
				}); 
	  	    },
	  	    /*this method used to update user Track listing*/
	  	    _push_friend_User = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		if(obj.type !=='Accepted'){
	  	    			resolve(`Tracking Request ${obj.type}.`);
	  	    		}else{
	  	    			User.update(
					      //{ _id: user._id},
					      { _id: obj._id},
					      { $pull: {trackies:{user_id:user._id} }},
					      (err,update)=>{

					    });
					    //User.findOne({_id : obj._id},(err,userObj)=>{
					     User.findOne({_id : user._id},(err,userObj)=>{
					    	if(err) reject(err);
					    	else{
					    		let trackie = {
					    			user_id : userObj._id,
							        name : userObj.name,
							        location : userObj.location,
							        profilePicture: (userObj.profilePicture)? userObj.profilePicture:null
					    		};
					    		//User.update({ _id: user._id},
					    		User.update({ _id: obj._id},
					  	    		{ $push: { trackies: trackie } },
					  	    		(err,result)=>{
					  	    		if(err) reject(err);
						            else resolve(`Track Request ${obj.type}.`);
					  	    	});
					    	}
					    });
	  	    		}

		  	    });	
	  	    },
	  	    /*this method used to update notification & save new notification*/
	  	    _update_notification = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		let _match = {to:user._id, from:obj._id,types : "Track"},
	  	    			_to_update = {$set:{types:obj.type}};
	  	    			//_to_update = {$set:{status:false}};
	  	    			/*update previous notification*/
	  	    		Notification.update(_match,_to_update,(err,update)=>{
	  	    			console.log("update----##### ",update);
	  	    			console.log("err----##### ",err)
	  	    			if(err){
	  	    				reject(err);
	  	    			}else{
	  	    				/*create new notification*/
		  	    			let _notification = new Notification({
			  	    	    	//title: `Track Request Accepted`,
			  	    	    	imageUrl: user.profilePicture,
			  	    	    	title: `Tracking Request ${obj.type}`,
								content: `${user.name}`, 
								to:  obj._id,
								from:  user._id,
								types: `Normal`,
								meta : { to: obj._id, from:user._id}
			  	    	    });
		  	    			console.log('map _notification--- ',_notification);
				  	    	/*save notification in */
				  	    	_notification.save((err,saved_obj)=>{
				  	    		console.log('saved_obj--- ',saved_obj);
				  	    		resolve(result);
						  	})
		  	   			}
				    });	
		  	    });	
	  	    };
	  	    _update_request_status().then((result)=>{
	  	    	return _push_friend_User(result)
	  	    }).then((result)=>{
	  	    	return _update_notification(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Request found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    }) 

	}
   /**this method is used to cancle or remove track request
    * method : POST
    * endpoint: /api/cancle-track-request
    */
	cancleTrackRequest(req,res){
		let user    = req.user,
			obj     = req.body,
			query = new Object(), 
			/*this method used update status of request*/
			_update_request_status = function(){
				let match = {from_userId:user._id,to_userId:obj.to_userId,type:'Track'};
	  	    	return new Promise((resolve, reject) => {
	  	    		Request.remove(match,(err,result)=>{
	  	    			if(err) reject(err);
	  	    			else resolve(result);
	  	    		});	
				}); 
	  	    },
	  	    /*this method used to update user track listing
	  	     *this function will work in rare case.
	  	    */
	  	    _pull_friend_User = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		User.update(
				      { _id: user._id},
				      { $pull: {trackies:{user_id:obj.to_userId} }},
				      (err,update)=>{
				      	if(err) reject(err);
	  	    			else resolve(result);
				    });
		  	    });	
	  	    };
	  	    _update_request_status().then((result)=>{
	  	    	return _pull_friend_User(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Request has canceled." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
	}
	/**this method is used to see track list
    * method : GET
    * endpoint: /api/track-list
    */
	trackList(req,res){
		let user    = req.user,
			obj     = req.query,
			userInfo= {}, 
			query = new Object(),
			/*this method used to get request*/
			_get_user_trackies = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match = {_id:ObjectId(user._id)},
	  	    			project = {trackies:1};
	  	    			
	  	    		query = [
			  	    			{
			  	    				$match:match
				  	    		},
				  	    		{
				  	    			$project:project
				  	    		},
				  	    		{ $unwind : "$trackies" },
				  	    		{
				  	    			$project:{trackieId:"$trackies.user_id"}
				  	    		},
				  	    		{
				  	    			$group : {
									    _id: "$_id",
									    trackiesArray: { $addToSet:'$trackieId'}
								    }
								}
			  	    		]
		            User.aggregate(query,(err, userList)=>{
		            	if(err) reject(err);
		            	else if (userList.length>0 && userList[0].trackiesArray.length>0)resolve(userList);
		            	else reject('Friend not found.')
		            })
				}); 
	  	    },
	  	    /*this method used to get user informations for listing*/
	  	    _get_trackies_info = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		let user_ids = result[0].trackiesArray;
	  	    			query = [
	  	    				{$match:{_id: { $in: user_ids }}},
	  	    				{$project:{name:1,profilePicture:1,mobile:1,fullno:1,location:{$ifNull:["$location",""]},cordinate:1,speed:1,speedTime:1}}
	  	    			]
		  	    	User.aggregate(query,(err,users)=>{
		  	    		if(err) reject(err);
			            else if(users.length>0) resolve(users);
			            else reject('Users not found');
		  	    	})
		  	    });
	  	    	
	  	    },
	  	    /*this method used to get userNotes*/
	  	    _get_userNotes = function(result){
	  	    	//console.log('result--- ',result)
	  	    	return new Promise((resolve, reject) => {
	  	    		let query = [
	  	    				{$match:{_id: ObjectId(user._id)}},
	  	    				{$project:{userNotes:1}}
	  	    			]
		  	    	User.aggregate(query,(err,user)=>{
		  	    		userInfo = user;
		  	    		if(err) reject(err);
			            else if(user.length>0) resolve(result);
			            else reject('Users not found');
		  	    	})
		  	    });
	  	    	
	  	    };
	  	    _get_user_trackies().then((result)=>{
	  	    	return _get_trackies_info(result)
	  	    }).then((result)=>{
	  	    	return _get_userNotes(result)
	  	    }).then((result)=>{
	  	    	//console.log('result---2 ',user)
	  	    	//console.log('userInfo---2 ',userInfo)
	  	    	res.json(this.response({ data: result,userInfo:userInfo[0].userNotes, message: "Trackies found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
	}
	/**this method is used to who track me
    * method : GET
    * endpoint: /api/who-track-me
    */
	whoTrackMe(req,res){
		//console.log(req.user)
		let user    = req.user,
			obj     = req.query,
			query   = new Object(),
			/*this method used to get request*/
			_check_for_request = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match ={to_userId:ObjectId(user._id)},
	  	    			project = {from_userId:1},
	  	    			addToSet = `$from_userId`;
	  	    			project['group_array']=null;
	  	    			match['status']='Accepted';
	  	    			match['type']='Track';
	  	    		query = [
			  	    			{
			  	    				$match:match
				  	    		},
				  	    		{
				  	    			$project:project
				  	    		},
				  	    		{
				  	    			$group : {
									    _id: "$group_array",
									    itemsSold: { $addToSet:addToSet}
								    }
								}
			  	    		]
		            Request.aggregate(query,(err, userList)=>{
		            	if(err) reject(err);
		            	else if (userList.length>0)resolve(userList);
		            	else reject('request not found.')
		            })
				}); 
	  	    },
	  	    /*this method used to get user informations for listing*/
	  	     _get_users_info = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		let user_ids = result[0].itemsSold;
	  	    		let query  = [
	  	    					{
			  	    				$match:{ _id: { $in: user_ids }}
				  	    		},
				  	    		{
				  	    			$project:{
				  	    				name:1,profilePicture:1,location:{$ifNull:["$location",""]}
				  	    			}
				  	    		}
	  	    		]
		  	    	User.aggregate(query,(err,users)=>{
		  	    		if(err) reject(err);
			            else if(users.length>0) resolve(users);
			            else reject('Users not found');
		  	    	})
		  	    });
	  	    	
	  	    };
	  	    _check_for_request().then((result)=>{
	  	    	return _get_users_info(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Request found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
	}
	/**this method is used stop Being Track by anyone
    * method : POST
    * endpoint: /api/stop-being-track
    */
	stopBeingTrack(req,res){
		let obj = req.body,
			user = req.user;
		User.update(
	      { _id: obj.trackById},
	      { $pull: {trackies:{user_id:user._id} }},
	      (err,update)=>{
	      	if(err) res.json(this.response({ err: err, message: error.oops() }));
	      	else{
	      		let query = {to_userId:ObjectId(user._id),from_userId:ObjectId(obj.trackById),type: 'Track'};
			    Request.remove(query,(err, request)=>{
		        	//console.log(request)
		        	if(err) res.json(this.response({ err: err, message: error.oops() }));
		        	else res.json(this.response({ data: request, message: "Now you can't be track." }));
		        })
	      	}
	    });
	}
	/**this method is used stop Being Track by anyone
    * method : POST
    * endpoint: /api/stop-being-track
    */
	pauseSelfTracking(req,res){
		let obj = req.body,
			user = req.user,
			message = '';
		User.update(
	      { _id: user._id},
	      { $set:{beingTrack:obj.pause}},
	      (err,update)=>{
	      	if(err) res.json(this.response({ err: err, message: error.oops() }));
	      	else{
	      		message = (obj.pause==="true")?"Now nobody can track you.":"Now Anyone can track you."
			    res.json(this.response({ data: update, message: message }));
	      	}
	    });
	}
	/**this method is used stop Being Track by anyone
    * method : GET
    * endpoint: /api/get-pause-status
    */
	getPauseStatus(req,res){
		let user = req.user;
		User.find(
	      { _id: user._id},
	      {beingTrack:1},
	      (err,result)=>{
	      	if(err) res.json(this.response({ err: err, message: error.oops() }));
	      	else{
			    res.json(this.response({ data: result[0], message: 'success' }));
	      	}
	    });
	}
}
module.exports = MapController
