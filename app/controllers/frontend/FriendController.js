const path = require("path"),
	  jwt  = require("jsonwebtoken"),
	  n    = require("needle"),
	  _    = require("lodash"),
	  formidable = require('formidable'),
	  fs = require('fs-extra'),
	  mv = require('mv'),
	  crypto =   require('crypto'),
	  ASYNC  =   require('async'),

	  /**/
	  env    = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
	  error  = require(path.resolve(`./app/config/libs/error`)),
	  Mailer  = require(path.resolve(`./app/config/libs/mailer`)),
	  HostPath  = require(path.resolve(`./app/config/libs/hostPath`)),
	  Badge = require(path.resolve(`./app/config/libs/badgeCount`)),
	  DECODE  = require(path.resolve(`./app/config/libs/verify_jwt`)),
	  Push    = require(path.resolve('./app/config/libs/pushNotification')),
	  App  = require(path.resolve("./app/controllers/frontend/AppController")),

	  User = require(path.resolve("./app/models/User")),
	  Request = require(path.resolve("./app/models/Request")),
	  Conversation = require(path.resolve("./app/models/Conversation")),
	  Notification = require(path.resolve("./app/models/Notification")),
	  ObjectId= require("mongoose").Types.ObjectId;
//{location: {$ifNull: ['$location', '']} }
class FriendController extends App {
	constructor(){
		super();
		/**/
		this.getAllUser = this.getAllUser.bind(this);
		this.sendFriendRequest = this.sendFriendRequest.bind(this);
		this.recievedSentFriendRequest = this.recievedSentFriendRequest.bind(this);	
		this.acceptDeclineFriendRequest = this.acceptDeclineFriendRequest.bind(this);	
		this.cancleFriendRequest = this.cancleFriendRequest.bind(this);
		this.friendList = this.friendList.bind(this);
		this.getFriends = this.getFriends.bind(this);
		//this.unfriend = this.unfriend.bind(this);
		this.push = new Push();
	}

	getAllUser(req,res){

		/* let user={ _id: '5b67e73c7ee8ba15ea36b30f',
		name: 'User1 u1_L',
		email: 'user1@yopmail.com',
		username: 'user1',
		mobile: '987654321',
		profilePicture: 'http://69f995bd.ngrok.io/profilePicture/5b67e73c7ee8ba15ea36b30f/image.jpg',
		iat: 1539157228,
		exp: 1540366828 };  */
		let 
		user    = req.user,
		obj     = req.query,
	    limit   = parseInt(process.env.LIMIT)|| 10000,
        offset  = parseInt((obj.page - 1) * limit),
	    match   = {$and:[{_id: {'$ne': ObjectId(user._id)}}]},
		  select	= {},
		  select2={},
		  _check_friend_status=function (array=[]){
			  return new Promise((resolve, reject) => {
				ASYNC.eachOfSeries(array,(val1,index,_callback)=>{
					let filterObj = {
						$and: [{
							to_userId:ObjectId(val1._id),
							from_userId: ObjectId(user._id), type: 'Friend'
						}]
					};
					Request.findOne(
						filterObj,
						{ type: 1, status: 1, to_userId: 1, from_userId: 1 }
					, (err, found) => {
						if (err){  _callback(err) }
						else{
							if(found){
								if(found.status){
									val1.friend=found.status;
								}
								_callback();
							}
							else{val1.friend="";_callback();};
						
						}
					})
				  },(err)=>{
					  if(err) reject(err);
					  else resolve(array) ;
				  })
			  })
		  };
  	   if(obj.text){
  	   	match = {$and:[
  	   		{$or:[
  	   			{username:new RegExp(`${obj.text}`, 'i')},
  	   			{name:new RegExp(`${obj.text}`, 'i')},
  	   			{email:new RegExp(`${obj.text}`, 'i')},
  	   			{mobile:new RegExp(`${obj.text}`, 'i')}
  	   			/*{username:new RegExp(`^${obj.text}`, 'i')},
  	   			{name:new RegExp(`^${obj.text}`, 'i')},
  	   			{email:new RegExp(`^${obj.text}`, 'i')},*/
  	   		]},
  	   	    {_id: {'$ne': ObjectId(user._id)}}
  	   	]};
  	   }
  	  
  	  let friendQuery = [
	    			{
	    				$match:{_id:ObjectId(user._id)}
		    		},
		    		{
		    			$project:{friends:1}
		    		},
		    		{ $unwind : "$friends" },
		    		{
		    			$project:{friendId:"$friends.user_id"}
		    		},
		    		{
			    			$group : {
						    _id: "$_id",
						    friendsArray: { $addToSet:'$friendId'}
					    }
					}
			   ],
			   _get_user_list=function(array=[]){
					let select3={};
				return new Promise((resolve,reject)=>{
					if(array.length>0){
							select3  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', '']},isfriend:{$cond: { if: { $in: [ "$_id", array[0].friendsArray  ] }, then: true, else: false }}};
						}else{
							 select3  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', ''] },isfriend:{$cond: { if: { $in: [ "$_id",  []  ] }, then: true, else: false }}};
						}
					User.aggregate([
						{ $match: match },
						{
							$project: select3
						},
						{
							$match:{isfriend:false}
						},
						{ $skip: offset },
						{ $limit: limit },

					],(err,result)=>{
						if(err) reject(err);
						else resolve(result);
					})
				})
			   };
  	  User.aggregate(friendQuery,(err, userList1)=>{
  	  	if(userList1.length>0){
			select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', '']},friendIDD:{$cond: { if: { $in: [ "$_id",  userList1[0].friendsArray  ] }, then: true, else: false }}};
			select2={username:1,name:1,email:1,location:1,fullno:1,mobile:1,ccode:1,count:"count",friendID:{$cond: { if: { $in: [ "$_id",  userList1[0].friendsArray ] }, then: true, else: false }}};
  	  	}else{
				select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', ''] },friendIDD:{$cond: { if: { $in: [ "$_id",  []  ] }, then: true, else: false }}};
				select2={username:1,name:1,email:1,location:1,fullno:1,mobile:1,ccode:1,count:"count",friendID:{$cond: { if: { $in: [ "$_id",  [] ] }, then: true, else: false }}};
  	  	}
  	  	let query = [
	  	  	{
	  	  		$facet:{
	  	  			count:[
	  	  			   {
	  	  			   	$match:match
						},
	  	  			   {
	  	  			   	  $project:select2
						},
					 	{$match:{friendID:false}}, 
	  	  			   {
			             $group: {
			               _id: '$count',
			               total: { $sum: 1 }
			             }
			           }
	  	  			],
	  	  			userList:[
	  	  			   {
	  	  			 	  $match:match
						},
	  	  			   {
	  	  			   	  $project:select
						},
	  	  			   { $skip: offset },
					   { $limit: limit },
	  	  			]
	  	  		}
	  	  	}
			]; 
			
			  User.aggregate(query, async (err, userList) => {
				  let UserDataList = await _get_user_list(userList1);

				  if (err) res.json(this.response({ err: err, message: error.oops() }));
				  else {
					  let total = (UserDataList.length > 0) ? userList[0].count[0].total : 0;
					  if (UserDataList.length > 0) {
						  let userListData = await _check_friend_status(UserDataList);
						  return res.json(this.response({ data: { users: UserDataList, total: total }, message: "User found" }));
					  } else {
						  return res.json(this.response({ data: { users: UserDataList, total: total }, message: "User Not found" }));
					  }
				  }
			  });
		  });	

	}
	/**this method is used to get all list of users
    * method : GET
    * endpoint: /api/get-all-user
    */
 //    getAllUserV1(req,res){
 //    	let user    = req.user,
	// 	obj     = req.query,
	//     limit   = parseInt(process.env.LIMIT)|| 10,
 //        offset  = parseInt((obj.page - 1) * limit),
	//     match   = {$and:[{_id: {'$ne': ObjectId(user._id)}}]},
	// 	  select	= {}; 
 //  	   if(obj.text){
 //  	   	match = {$and:[
 //  	   		{$or:[
 //  	   			{username:new RegExp(`^${obj.text}`, 'i')},
 //  	   			{name:new RegExp(`^${obj.text}`, 'i')},
 //  	   			{email:new RegExp(`^${obj.text}`, 'i')},
 //  	   		]},
 //  	   	    {_id: {'$ne': ObjectId(user._id)}}
 //  	   	]};
 //  	   }
  	  
 //  	  let friendQuery = [
	//     			{
	//     				$match:{_id:ObjectId(user._id)}
	// 	    		},
	// 	    		{
	// 	    			$project:{friends:1}
	// 	    		},
	// 	    		{ $unwind : "$friends" },
	// 	    		{
	// 	    			$project:{friendId:"$friends.user_id"}
	// 	    		},
	// 	    		{
	// 		    			$group : {
	// 					    _id: "$_id",
	// 					    friendsArray: { $addToSet:'$friendId'}
	// 				    }
	// 				}
 //    		   ];
 //  	  User.aggregate(friendQuery,(err, userList1)=>{
 //  	  	if(userList1.length>0){
	// 		select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', ''] },friend:{$cond: { if: { $in: [ "$_id",  userList1[0].friendsArray  ] }, then: true, else: false }}};
 //  	  	}else{
 //  	  		select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', ''] },friend:{$cond: { if: { $in: [ "$_id",  []  ] }, then: true, else: false }}};
 //  	  	}
 //  	  	let query = [
	//   	  	{
	//   	  		$facet:{
	//   	  			count:[
	//   	  			   {
	//   	  			   	$match:match
	//   	  			   },
	//   	  			   {
	//   	  			   	  $project:{username:1,name:1,email:1,location:1,fullno:1,mobile:1,ccode:1,count:"count"}
	//   	  			   },
	//   	  			   {
	// 		             $group: {
	// 		               _id: '$count',
	// 		               total: { $sum: 1 }
	// 		             }
	// 		           }
	//   	  			],
	//   	  			userList:[
	//   	  			   {
	//   	  			 	  $match:match
	//   	  			   },
	//   	  			   {
	//   	  			   	  $project:select
	//   	  			   },
	//   	  			   { $skip: offset },
	//               	   { $limit: limit }
	//   	  			]
	//   	  		}
	//   	  	}
	//   	  ];
 //  	  	  User.aggregate(query, async (err, userList)=>{
	// 	   if(err) res.json(this.response({ err: err, message: error.oops() }));
	// 	   else{
	// 	   	let total = (userList[0].userList.length>0)?userList[0].count[0].total:0;
	// 	   	if(userList[0].userList.length>0){
	// 	   		return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "User found" }));	
	// 	   	}else{
	// 	   		return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "User Not found" }));	
	// 	   	}
	// 	   }
	// 	  });
 //  	  });	
	// }
	/*getAllUser(req,res){
    let user    = req.user,
		obj     = req.query,
	    limit   = parseInt(process.env.LIMIT),
        offset  = parseInt((obj.page - 1) * limit),
	    match   = {$and:[{_id: {'$ne': ObjectId(user._id)}}]},
  	    select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,location: {$ifNull: ['$location', ''] }}; 
  	   if(obj.text){
  	   	match = {$and:[
  	   		{$or:[
  	   			{username:new RegExp(`^${obj.text}`, 'i')},
  	   			{name:new RegExp(`^${obj.text}`, 'i')},
  	   			{email:new RegExp(`^${obj.text}`, 'i')},
  	   		]},
  	   	    {_id: {'$ne': ObjectId(user._id)}}
  	   	]};
  	   }
  	  let query = [
  	  	{
  	  		$facet:{
  	  			count:[
  	  			   {
  	  			   	$match:match
  	  			   },
  	  			   {
  	  			   	  $project:{username:1,name:1,email:1,location:1,fullno:1,mobile:1,ccode:1,count:"count"}
  	  			   },
  	  			   {
		             $group: {
		               _id: '$count',
		               total: { $sum: 1 }
		             }
		           }
  	  			],
  	  			userList:[
  	  			   {
  	  			 	  $match:match
  	  			   },
  	  			   {
  	  			   	  $project:select
  	  			   },
  	  			   { $skip: offset },
              	   { $limit: limit }
  	  			]
  	  		}
  	  	}
  	  ];
  	  User.aggregate(query,(err, userList)=>{
	   if(err) res.json(this.response({ err: err, message: error.oops() }));
	   else{
	   	let total = (userList[0].userList.length>0)?userList[0].count[0].total:0;
	   	if(userList[0].userList.length>0){
	   		return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "User found" }));	
	   	}else{
	   		return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "User Not found" }));	
	   	}
	   }
	  });	
	}*/
	/**this method is used to send friend request
    * method : POST
    * endpoint: /api/send-friend-request
    */
	 sendFriendRequest(req,res){
		console.log("req.bodyy===>",req.body);
		//console.log("req.bodyy===>",this);
		let user    = req.user,that = this,
			obj     = req.body,
		    match   = {$and:[{to_userId:obj.to_userId,from_userId: user._id,type:'Friend'}]},
	  	    select  = {to_userId:1,from_userId:1,type:1,status:1};
	  	    obj['from_userId'] = user._id;
	  	    obj['type'] = 'Friend';
	  	    obj['status'] = 'Pending';
	  	//let badge = await Badge.badge(obj.to_userId)
	  	let _obj_to_save = new Request(obj), 
	  	    _check_for_request = function(){
	  	    	return new Promise((resolve, reject) => {
		            Request.findOne(match,select,(err,request)=>{
						console.log("resquest==>",request);
		            	if(err) reject(err);
		            	else if(request && request.status === 'Pending') reject('Your Friend request is Pending.');
		            	else if(request && request.status === 'Rejected') resolve('Rejected');
		            	else if(request && request.status === 'Accepted') reject('This user already in your friend list.');
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
		  	    	/*save friend request obj in request collection*/
		  	    	_obj_to_save.save((err,saved_obj)=>{
		  	    		resolve(saved_obj);
				  	})
		  	    });
	  	    },
	  	    _save_for_notification = function(result){
	  	    	//console.log('user---1 ',user);
	  	    	let _notification = new Notification({
	  	    			imageUrl: user.profilePicture,
	  	    	    	title: 'Friend Request',
						content: `${user.name} sent you friend request`, 
						to:  obj.to_userId,
						from:  user._id,
						types: `Friend`,
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
	  	    	console.log('_sendPushNotification------',this)
	  	    	
	  	    	return new Promise((resolve, reject) => {
    				User.findOne({_id:obj.to_userId},{mobileDevice:1} , (err, result) => {
	  	    		
                          let data = result.mobileDevice;
                         
                            if(data && data.length>0){
                               //console.log(response.body);  
                               data.map((tokenData) => {
                                const pushData = obj;
                                console.log('tokenData-- ',tokenData)
                                //console.log('get badge count--------',badge);
                                if(tokenData.deviceType=='ios'){
                                    console.log('ios push----->>>>>>>>>')
                                    /*send push notification to IOS device*/
                                    that.push.APN(
                                        tokenData.deviceToken, 
										"you have a Friend Request",
										0, 
										pushData,
										'1',
										obj.to_userId
                                    )
                                    .then(result => {
                                        /*send emit to user*/
                                    })
                                    .catch((error) => {console.log('error--- ',error)});
                                }else{
                                    console.log('Andriod push----->>>>>>> ')
                                    /*send push notification to Android device*/
                                    that.push.FCM(
                                        tokenData.deviceToken, 
										"you have a Friend Request",
										0, 
										pushData,
										'1',
										obj.to_userId
                                    )
                                    .then(result => {
                                        /*send emit to user*/
                                    })
                                    .catch((error) => {console.log('error--- ',error)});
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
	  	        res.json(this.response({ data: result._id, message: "Friend request has been sent." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })  
	}
	/**this method is used to see recived & sent friend request
    * method : GET
    * endpoint: /api/recieved-sent-friend-request
    */
	recievedSentFriendRequest(req,res){
		let user    = req.user,
			obj     = req.query,
			query = new Object(),
			/*this method used to get request*/
			
			_check_for_request = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match =(obj.type==='sent')? {from_userId:ObjectId(user._id)}:{to_userId:ObjectId(user._id)},
	  	    			project = (obj.type==='sent')? {to_userId:1}:{from_userId:1},
	  	    			addToSet = (obj.type==='sent')? `$to_userId`:`$from_userId`;
	  	    			//project['group_array']=null;
	  	    			project['group_array']=1;
	  	    			match['status']='Pending';
	  	    			match['type']='Friend';
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
						console.log("userList",userList)
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
	/**this method is used to see recived & sent friend request
    * method : POST
    * endpoint: /api/accept-decline-friend-request
    */
	acceptDeclineFriendRequest(req,res){
		let user    = req.user,that = this,
			obj     = req.body,
			query = new Object(),
			user1 =  new Object(),
			user2 =  new Object(),
			/*this method used update status of request*/
			_update_request_status = function(){
				let match = {to_userId:user._id,from_userId:obj._id,type:'Friend'},
					toUpdate = (obj.type ==='Accepted')?{$set:{status : "Accepted"}}:{$set:{status : "Rejected"}};
	  	    	return new Promise((resolve, reject) => {
	  	    		/*Request.update(match,toUpdate,(err,result)=>{
	  	    			if(err) reject(err);
	  	    			else resolve(result);
	  	    		})*/

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
	  	    /*this method used to update user1 friend listing*/
	  	    _push_friend_User1 = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		if(obj.type !=='Accepted'){
	  	    			resolve(`Friend Request ${obj.type}.`);
	  	    		}else{
	  	    			User.update(
					      { _id: user._id},
					      { $pull: {friends:{user_id:obj._id} }},
					      (err,update)=>{

					    });
					    User.findOne({_id : obj._id},(err,userObj)=>{
					    	if(err) reject(err);
					    	else{
					    		user1 = userObj;
					    		let friend = {
					    			user_id : userObj._id,
							        name : userObj.name,
							        location : userObj.location,
							        profilePicture: (userObj.profilePicture)? userObj.profilePicture:null
					    		};
					    		User.update({ _id: user._id},
					  	    		{ $push: { friends: friend } },
					  	    		(err,result)=>{
					  	    		if(err) reject(err);
						            else resolve(`Friend Request ${obj.type}.`);
					  	    	});
					    	}
					    });
	  	    		}

		  	    });	
	  	    },
	  	    /*this method used to update user2 friend listing*/
	  	    _push_friend_User2 = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		if(obj.type !=='Accepted'){
	  	    			resolve(`Friend Request ${obj.type}.`);
	  	    		}else{
	  	    			User.update(
					      { _id: obj._id},
					      { $pull: {friends:{user_id:user._id} }},
					      (err,update)=>{

					    });
					    User.findOne({_id : user._id},(err,userObj)=>{
					    	if(err) reject(err);
					    	else{
					    		user2 = userObj;
					    		let friend = {
					    			user_id : userObj._id,
							        name : userObj.name,
							        location : userObj.location,
							        profilePicture: (userObj.profilePicture)? userObj.profilePicture:null
					    		};
					    		User.update({ _id: obj._id},
					  	    		{ $push: { friends: friend } },
					  	    		(err,result)=>{
					  	    		if(err) reject(err);
						            else resolve(`Friend Request ${obj.type}.`);
					  	    	});
					    	}
					    });
	  	    		}

		  	    });	
	  	    },
	  	     /*this method used to update notification & save new notification*/
	  	    _update_notification = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		let _match = {to:user._id, from:obj._id,types : "Friend"},
	  	    			_to_update = {$set:{types:obj.type}};
	  	    			/*update previous notification*/
	  	    		Notification.update(_match,_to_update,(err,update)=>{
	  	    			if(err){
	  	    				reject(err);
	  	    			}else{
	  	    				/*create new notification*/
		  	    			let _notification = new Notification({
				  	    	    	//title: 'Friend Request Accepted',
				  	    	    	imageUrl: user.profilePicture,
				  	    	        title: `Friend Request ${obj.type}`,
									content: `${user.name}`, 
									to:  obj._id,
									from:  user._id,
									types: `Normal`,
									meta : { to: obj._id, from:user._id}
				  	    	    });
			  	    		console.log('friend _notification--- ',_notification);
				  	    	/*save notification in */
				  	    	_notification.save((err,saved_obj)=>{
				  	    		console.log('saved_obj--- ',saved_obj);
				  	    		resolve(result);
						  	})
		  	   			}
				    });	
		  	    });	
	  	    },
	  	    /*this method used to create initial conversation*/
	  	    _create_initial_convertation = function(result){
	  	    	return new Promise((resolve, reject) => {
			        const users = [
			            {
			                _id : user1._id,
			                name : user1.name,
			                image : user1.profilePicture
			            },
			            {
			                _id : user2._id,
			                name : user2.name,
			                image : user2.profilePicture
			            }
			        ];
			        /**
			         * params : chatUsers, currentUsers, status currentUsers:[]
			         */
			        DECODE.required(req, res, (user)=> {
			            let query = {
			                 "currentUsers": { $size : 2, $all: that.getUserIds(users) }  
			            };
			            Conversation.find(query,(err,conver)=>{
			                if(err){
			                    res.status(412).json({type:"error",message:ERROR.oops(),errors:ERROR.pull(err)})
			                }else{
			                   if(conver.length>0) {
			                    /*if convertation found*/
			                    Conversation.update({_id:conver[0]._id},{$set:{status:"Connected"}},
			                    (err,result)=>{
			                        if(err) reject(err);
			                        if(result) resolve(`Friend Request ${obj.type}.`);
			                    });
			                   }else{
			                    /*if convertation not found*/
			                    ASYNC.waterfall([
			                        (_callback) => {
			                            Conversation.find({
			                                currentUsers : {
			                                    $all : that.getUserIds(users)
			                                }
			                            }, (err, userGroup) => {
			                                if(userGroup && userGroup.length){
			                                    _callback("This room is already exists.");
			                                }else{
			                                    _callback(null);
			                                }
			                            });
			                        },
			                        (_callback) => {
			                            let newConversation = {
			                                chatUsers : users,
			                                currentUsers : that.getUserIds(users),
			                                status : "Connected"
			                            };

			                            /*create a connection between users*/
			                            Conversation(newConversation).save()
			                            .then(conversationId => _callback(null,conversationId))
			                            .catch(error => _callback(error));
			                        }
			                    ], (err, result) => {
			                        if(err) reject(err);
			                        if(result){
			                            resolve(`Friend Request ${obj.type}.`)
			                        }
			                    });
			                   }
			                }
			            });
			        });

		  	    });	
	  	    };
	  	    _update_request_status().then((result)=>{
	  	    	return _push_friend_User1(result)
	  	    }).then((result)=>{
	  	    	return _push_friend_User2(result)
	  	    }).then((result)=>{
	  	    	return _update_notification(result)
	  	    }).then((result)=>{
	  	    	return _create_initial_convertation(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Request found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    }) 

	}
   /**this method is used to cancle friend request
    * method : POST
    * endpoint: /api/cancle-friend-request
    */
	cancleFriendRequest(req,res){
		let user    = req.user,
			obj     = req.body,
			query = new Object(), 
			/*this method used update status of request*/
			_update_request_status = function(){
				let match = {from_userId:user._id,to_userId:obj.to_userId,type:'Friend'};
	  	    	return new Promise((resolve, reject) => {
	  	    		Request.remove(match,(err,result)=>{
	  	    			if(err) reject(err);
	  	    			else resolve(result);
	  	    		});	
				}); 
	  	    },
	  	    /*this method used to update user friend listing
	  	     *this function will work in rare case.
	  	    */
	  	    _pull_friend_User = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		User.update(
				      { _id: user._id},
				      { $pull: {friends:{user_id:obj.to_userId} }},
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
	/**this method is used to see friend list
    * method : GET
    * endpoint: /api/friend-list
    */

   friendList(req,res){
	let user    = req.user,
		obj     = req.query,
		query = new Object(),
		/*this method used to get request*/
		_get_user_friend = function(){
			  return new Promise((resolve, reject) => {
				  let match = {_id:ObjectId(user._id)},
					  project = {friends:1};
					  
				  query = [
							  {
								  $match:match
							  },
							  {
								  $project:project
							  },
							  { $unwind : "$friends" },
							  {
								  $project:{friendId:"$friends.user_id"}
							  },
							  {
								  $group : {
									_id: "$_id",
									friendsArray: { $addToSet:'$friendId'}
								}
							}
						  ]
				User.aggregate(query,(err, userList)=>{

					if(err) reject(err);
					else if (userList.length>0 && userList[0].friendsArray.length>0)resolve(userList);
					else reject('Friend not found.')
				})
			}); 
		  },
		  /*this method used to get user informations for listing*/
		  _get_friends_info = function(result){
			  return new Promise((resolve, reject) => {
				  let user_ids = result[0].friendsArray,
					  query = [
						  //{$match:{_id: { $in: user_ids }}},
						  {$match:{$and:[
						  	{_id: { $in: user_ids }}
						  	]}},
						  {$project:{name:1,profilePicture:1,mobile:1,fullno:1,location:{$ifNull:["$location",""]},cordinate:1,speed:1,speedTime:1}}
					  ];
					 
				  if (obj.text) {
				  	let or = {
								$or: [
									  { username: new RegExp(`${obj.text}`, 'i') },
									  { name: new RegExp(`${obj.text}`, 'i') },
									  { email: new RegExp(`${obj.text}`, 'i') },
									  { mobile: new RegExp(`${obj.text}`, 'i') }
									  /*{ username: new RegExp(`^${obj.text}`, 'i') },
									  { name: new RegExp(`^${obj.text}`, 'i') },
									  { email: new RegExp(`^${obj.text}`, 'i') }*/
								 ]
							 };
				  	query[0].$match.$and.push(or);
						
				   } 
				  User.aggregate(query,(err,users)=>{
					  if(err) reject(err);
					else if(users.length>0) resolve(users);
					else reject('Users not found');
				  })
			  });
			  
		  },
		  _get_track_info=function(result){
			  return new Promise((resolve,reject)=>{
				ASYNC.eachOfSeries(result, (val1, index, _callback) => {
					let filterObj = {
						$and: [{
							to_userId: ObjectId(val1._id),
							from_userId: ObjectId(user._id), type: 'Track'
						}]
					};
					Request.findOne(
						filterObj,
						{ type: 1, status: 1, to_userId: 1, from_userId: 1 }
						, (err, found) => {
							//console.log("found==>",found)
							if (err) { _callback(err) }
							else {
								if (found) {
									
									if (found.status) {
										val1.trackStatus = found.status;
									}
									_callback();
								}
								else { val1.trackStatus = ""; _callback(); };

							}
						})
				}, (err) => {
					if (err) reject(err);
					else resolve(result);
				})

			  })
		  };
		  _get_user_friend().then((result)=>{
			  return _get_friends_info(result)
		  }).then((result)=>{
			  return _get_track_info(result)
		  }).then((result)=>{
			  //console.log("result==>",result)
			  res.json(this.response({ data: result, message: "Friends found." }));
		  }).catch((err)=>{
			   res.json(this.response({ err: err, message: error.oops() }));
		})
}
	friendListV1(req,res){
		let user    = req.user,
			obj     = req.query,
			query = new Object(),
			/*this method used to get request*/
			_get_user_friend = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match = {_id:ObjectId(user._id)},
	  	    			project = {friends:1};
	  	    			
	  	    		query = [
			  	    			{
			  	    				$match:match
				  	    		},
				  	    		{
				  	    			$project:project
				  	    		},
				  	    		{ $unwind : "$friends" },
				  	    		{
				  	    			$project:{friendId:"$friends.user_id"}
				  	    		},
				  	    		{
				  	    			$group : {
									    _id: "$_id",
									    friendsArray: { $addToSet:'$friendId'}
								    }
								}
			  	    		]
		            User.aggregate(query,(err, userList)=>{

		            	if(err) reject(err);
		            	else if (userList.length>0 && userList[0].friendsArray.length>0)resolve(userList);
		            	else reject('Friend not found.')
		            })
				}); 
	  	    },
	  	    /*this method used to get user informations for listing*/
	  	    _get_friends_info = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		let user_ids = result[0].friendsArray;
		  	    		query = [
	  	    				{$match:{_id: { $in: user_ids }}},
	  	    				{$project:{name:1,profilePicture:1,mobile:1,fullno:1,location:{$ifNull:["$location",""]}}}
	  	    			]
		  	    	User.aggregate(query,(err,users)=>{
		  	    		if(err) reject(err);
			            else if(users.length>0) resolve(users);
			            else reject('Users not found');
		  	    	})
		  	    });
	  	    	
	  	    };
	  	    _get_user_friend().then((result)=>{
	  	    	return _get_friends_info(result)
	  	    }).then((result)=>{
	  	    	res.json(this.response({ data: result, message: "Friends found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
	}

    /**this method is used to see friend list 
    * method : GET
    * endpoint: /api/get-friends
    */
    getFriends(req, res) {
        let obj     = req.query,
			query = new Object(),
			/*this method used to get request*/
			_get_user_friend = function(){
	  	    	return new Promise((resolve, reject) => {
	  	    		let match = {_id:ObjectId(obj._id)},
	  	    			project = {friends:1};
	  	    			
	  	    		query = [
			  	    			{
			  	    				$match:match
				  	    		},
				  	    		{
				  	    			$project:project
				  	    		},
				  	    		{ $unwind : "$friends" },
				  	    		{
				  	    			$project:{friendId:"$friends.user_id"}
				  	    		},
				  	    		{
				  	    			$group : {
									    _id: "$_id",
									    friends: { $addToSet:'$friendId'}
								    }
								}
			  	    		]
		            User.aggregate(query,(err, userList)=>{
		            	if(err) reject(err);
		            	else if (userList.length>0 && userList[0].friends.length>0)resolve(userList);
		            	else reject('Friend not found.')
		            })
				}); 
	  	    },
	  	    /*this method used to get user informations for listing*/
	  	    _get_friends_info = function(result){
	  	    	return new Promise((resolve, reject) => {
	  	    		resolve(result)
	  	    		/*let user_ids = result[0].friendsArray;
		  	    		query = [
	  	    				{$match:{_id: { $in: user_ids }}},
	  	    				{$project:{name:1}}
	  	    			]
		  	    	User.aggregate(query,(err,users)=>{
		  	    		if(err) reject(err);
			            else if(users.length>0) resolve(users);
			            else reject('Users not found');
		  	    	})*/
		  	    });	
	  	    };
	  	    _get_user_friend().then((result)=>{
	  	    	return _get_friends_info(result)
	  	    }).then((friends)=>{
	  	    	friends = JSON.parse(JSON.stringify(friends));
	  	    	delete friends[0]._id;
	  	    	res.json({type:"success", data:(friends && friends.length)?friends[0]:{friends:[]}});
	  	    	//res.json(this.response({ data: result, message: "Friends found." }));
	  	    }).catch((err)=>{
		  	 	res.json(this.response({ err: err, message: error.oops() }));
		    })
    }

    /**this method is used to see friend list 
    * method : GET
    * endpoint: /api/get-friends
    */
    unfriend(req,res){
		let obj  = req.body,
			user = req.user,
			_remove_friend_request = function(obj) {
				return new Promise((resolve, reject) => {
					//resolve({"dsfds":"drfesdf"})
					let query =[
						{
							$match:{$or:[
								{"type" : "Friend", to_userId:ObjectId(obj.friendId),from_userId:ObjectId(user._id)},
								{"type" : "Friend", from_userId:ObjectId(obj.friendId),to_userId:ObjectId(user._id)}
							]
						  }
						},
						{$project:{type:1,array:"fix"}},
						{$group : {
						    _id: "$array",
						    ids: { $addToSet: "$_id" }
					    }}
					];
					Request.aggregate(query,(err,request)=>{
						//console.log('request----- ',request);
						if(request[0] && request[0].ids.length>0){
							//console.log('request----- ',request[0].ids);
							/*write code to remove request*/
							Request.remove({_id:request[0].ids},(err,remove)=>{
								console.log('remove-- ',remove.result);
							})
						}
						resolve(null);
					})
				});
			},
			_remove_from_own = function(obj) {
				return new Promise((resolve, reject) => {
					User.update(
					  {_id: user._id },
					  { $pull: { friends: { user_id: ObjectId(obj.friendId) } } }
					,(err,update)=>{
						if(err) reject('err');
						else{
							resolve(null);
						}
					})
				});
			},
			_remove_from_other = function(obj){
				return new Promise((resolve, reject) => {
					User.update(
					  {_id: obj.friendId },
					  { $pull: { friends: { user_id: ObjectId(user._id) } } }
					,(err,update)=>{
						if(err) reject('err');
						else{
							resolve('user unfriend successfully.');
						}
					})
				});
			};

		(async ()=>{
			try {
				let _remove_friend = await _remove_friend_request(obj),
				    _remove_own    = await _remove_from_own(obj),
				    _remove_other  = await _remove_from_other(obj);
				return res.json(this.response({ data:_remove_other, message: "success" }));
			}catch(e){
				res.json(this.response({ err: err, message: error.oops() }));
			}
		})();
    }

  //   asyncAwait(req,res){

		// let obj = req.body;
		// // step 1 _remove_friend_request

		// //step2 _remove_from_own
		// 	const _remove_friend_request =  (obj) =>{
		// 		return new Promise((resolve,reject)=>{
					
		// 			setTimeout(() => {resolve("ok")}, 6000)
		// 		})
		// 		 // setTimeout(() => {return "ok"}, 6000)
		// 	   //return "ok"
				

				
		// 	};
		// 	const _remove_from_own = async (obj)=> {
		// 		throw "error"
		// 	};
		// 	const fn3 = async (obj)=> {
		// 		return "ok"
		// 	};


		// (async ()=>{
		// 	try{
		// 		let _remove_friend = await _remove_friend_request(obj);
		// 		console.log("-------1",_remove_friend);
		// 		let _remove_own    = await _remove_from_own(_remove_friend);
		// 		console.log("---------------2",_remove_own);
		// 		let three = await fn3();
		// 		console.log("============3",three)
		// 	}	catch(error){
		// 		console.log("in error block",error)
		// 	}		
			
		// })();
  //   }
    /*
    1- Normal call-

		function printString(string){
		  setTimeout(
		    () => {
		      console.log(string)
		    }, 
		    Math.floor(Math.random() * 100) + 1
		  )
		}
		function printAll(){
		  printString("A")
		  printString("B")
		  printString("C")
		}
		printAll()

    2- With callback hell-		
		function printString(string){
		  setTimeout(
		    () => {
		      console.log(string)
		    }, 
		    Math.floor(Math.random() * 100) + 1
		  )
		}
		function printAll(){
		  printString("A", () => {
		    printString("B", () => {
		      printString("C", () => {})
		    })
		  })
		}
		printAll()

	3- With callback hell-		
		function printString(string){
		  setTimeout(
		    () => {
		      console.log(string)
		    }, 
		    Math.floor(Math.random() * 100) + 1
		  )
		}
		function printAll(){
		  printString("A")
		  .then(() => {
		    return printString("B")
		  })
		  .then(() => {
		    return printString("C")
		  })
		}
		printAll()
    */
}
module.exports = FriendController
