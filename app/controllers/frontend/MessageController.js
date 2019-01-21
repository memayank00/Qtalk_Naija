const path = require("path"),
	  jwt  = require("jsonwebtoken"),
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
	  DECODE  = require(path.resolve(`./app/config/libs/verify_jwt`)),
	  DATE    = require(path.resolve('./app/config/libs/date')),
	  attachment= require(path.resolve('./app/config/libs/image')),
	  CLOUDINARY = require(path.resolve('./app/config/libs/cloudinary')),
	  App  = require(path.resolve("./app/controllers/frontend/AppController")),

	  User = require(path.resolve("./app/models/User"));
	  Request = require(path.resolve("./app/models/Request"));
	  Conversation = require(path.resolve("./app/models/Conversation")),
	  Chat = require(path.resolve("./app/models/Chat")),
	  ObjectId= require("mongoose").Types.ObjectId;

class MessageController extends App {
	constructor(){
		super();
		/**/
		this.getAllChatList = this.getAllChatList.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.getConversationId = this.getConversationId.bind(this);
		this.messageTrails = this.messageTrails.bind(this);
		this.postTextMessage = this.postTextMessage.bind(this);
    this.readMessages = this.readMessages.bind(this);
		
	}
	/**this method is used to get all chat list of users to messaging
    * method : GET
    * endpoint: /api/get-all-chat-list?page=1&q=
    */
	getAllChatList(req,res){
		
    let user    = req.user,
		obj     = req.query,
	    limit   = parseInt(process.env.LIMIT) || 10,
        offset  = (obj.page)?parseInt((obj.page - 1) * limit):0,
	    match   = {
	                $and:[
	                    {currentUsers : {$in : [ObjectId(user._id)]}},
	                    {$or:[
	                            {status : "Connected"},
	                            {status : "Blocked"}
	                        ]
	                    },
	                    {chat_status:"Start"}
	                ]
	            };
  	   /*when filtering message list*/
       /*filter using username*/
        if(obj.q) match.$and.push({"chatUsers.name":{ $regex : obj.q, $options : "i" }})
  	    let query = [
  	  	  {
  	  		$facet:{
  	  			count:[
  	  			   {
  	  			   	$match:match
  	  			   },
  	  			   {
  	  			   	  $project:{status:1,chat_status:1,count:"count"}
  	  			   },
  	  			   {
		             $group: {
		               _id: '$count',
		               total: { $sum: 1 }
		             }
		           }
  	  			],
  	  			userList:[
  	  			   { $lookup : { from : "chats", localField : "_id", foreignField : "conversationId", as : "conversation" } },
                        { $match : match },
                        { $project : { 
                             "_id": 1,
                             "status":1,
                             "block_id":1,
                             "blocker_user_id":1,
                             "expTime":"$muteObj.expTime",
                             "chatUsers":1, 
                             "currentUsers":1,
                             "created_at":1,
                             "lastMessage": { 
                                $filter : {
                                  input : "$conversation",
                                  as : "messages",
                                  cond : {
                                      "$eq": [
                                        { "$size": {
                                           "$setIntersection": [[ObjectId(user._id)], '$$messages.deleteBy']
                                        }},
                                        0
                                      ]
                                  }
                                }
                             },
                             "total": { $size: "$conversation" }, 
                             //"hideprofile" : {$size : "$hidden"},
                             "hidden" : 1,
                             "totalRead" : 
                                { $size : {
                                 $filter :
                                    { input : "$conversation", 
                                    as : "messages", 
                                    cond : { $setIsSubset: [[user._id], '$$messages.read'] } } 
                                    } 
                                }, 

                              "read" : 
                                    { 
                                    $filter : {
                                         input : "$conversation",as : "messages", 
                                         cond : { $setIsSubset: [[user._id], '$$messages.read'] } 
                                        }
                                  } 
                              } 
                        },

                        { 
                            $project : { 
                                 "_id": 1,
                                 "status":1,
                                 "block_id":1,
                                 "blocker_user_id":1, 
                                 "expTime":1,
                                 "lastMessage": { "$arrayElemAt" : ["$lastMessage", -1] },
                                 /*"hidec":{
                                    $cond : {
                                      if : {$eq : ["$hideprofile", 0] },
                                      then : "show",
                                      else : {
                                        $cond : {
                                          if : {
                                            $and : [
                                              {$eq : ["$hideprofile", 1]},
                                              {
                                                "$anyElementTrue": { "$map": {
                                                    "input": "$hidden",
                                                    "as": "el",
                                                    "in": { "$eq": [ "$$el", ObjectId(user._id) ] }
                                                }}
                                              },
                                            ]
                                          },
                                          then : "show",
                                          else : "hide"
                                        }
                                      }
                                    }
                                 },*/
                                
                                 'chattingWith': { 
                                    $filter: { 
                                         input: '$chatUsers', as:'user', 
                                         cond: { $ne: [ObjectId(user._id), '$$user._id'] } 
                                     } 
                                 }, 
                                 "unread" : {$subtract:["$total","$totalRead"]} 
                            } 
                        },

                         { 
                            $project : { 
                              "_id": 1, 
                              "status":1,
                              "lastMessage.body": 1,
	                            "lastMessage.read": 1,
	                            "lastMessage.timestamp": 1, 
	                            "lastMessage.isEdited": 1, 
	                            "lastMessage.trash": 1, 
	                            "lastMessage._id": 1, 
	                            "lastMessage.mimeType": 1, 
	                            "lastMessage.duration": 1,
	                            "lastMessage.attachment": 1, 
                              "lastMessage.deleteBy": 1,
                              "lastMessage.index": { $indexOfArray: [ "$lastMessage.deleteBy", ObjectId(user._id) ] },
                              "block_id":1,
                              "blocker_user_id":1, 
                              "expTime":1, 
                              //"hidec":1, 
                              "chattingWith":1,
                              "cond":1,
                              "unread" : 1 
                            } 
                         },
                         {$match:{"lastMessage.deleteBy":{ $nin: [ user._id ] }}},

                         { 
                            $project : { 
                                "_id": 1, 
                                "status":1,
                                
                                "block_id":1,
                                "blocker_user_id":1, 
                                "expTime":1, 
                                //"hidec":1, 
                                "lastMessage": {
                                    $cond: {
                                        if: { $and:[{ $lt:["$lastMessage.index",0] },{ $ne: [ "$lastMessage.index", null] }] },
                                       then: "$lastMessage",
                                       else: "$REMOVE"
                                    }
                                  },
                                "chattingWith":1,
                                "cond":1,
                                "unread" : 1 
                            } 
                         },

                        //{ $match : { "hidec" : "show"} },  
                        { $unwind : "$chattingWith" },                     
                        { $sort : { "lastMessage.timestamp" : -1 } },
                        { $skip : offset },
                        { $limit : limit }
  	  			]
  	  		}
  	  	  }
  	  ];
  	  Conversation.aggregate(query,(err, chatList)=>{
	   if(err) res.json(this.response({ err: err, message: error.oops() }));
	   else{
	   	//console.log('chatList---- ',JSON.stringify(chatList))
	   	let total = (chatList[0].userList.length>0)?chatList[0].count[0].total:0;
	   	if(chatList[0].userList.length>0){
	   		return res.json(this.response({ data: { total:total, users: chatList[0].userList}, message: "User found" }));	
	   	}else{
	   		return res.json(this.response({ data: { total:total, users: chatList[0].userList}, message: "User Not found" }));	
	   	}
	   }
	  });
	}

	/**this method is used to get conversationId
    * method : GET
    * endpoint: /api/get-conversation-id
    */
	getConversationId(req, res){
		let userinfo = req.user,
			obj 	 = req.query,
		    users = [{_id : userinfo._id},{_id : obj.userId}],
		    query = {
	             "currentUsers": { $size : 2, $all: this.getUserIds(users) }  
	             };
        Conversation.find(query,(err,conver)=>{
        	console.log('conver----- ',conver)
        	if (err) res.json(that.response({ err: err, message: error.oops() }));
        	if (conver.length>0) res.json(this.response({ data: (conver.length>0)?conver[0]._id:"", message: "Success" })); 
	        //if (conver.length>0) res.json(this.response({ data: (conver.length>0)?conver[0]._id:"", message: "Success" }));
	        else res.json(this.response({ data: "", message: "conversationId Not found" }));
        })
	}
	
	/**this method is used to send message
    * method : GET
    * endpoint: /api/send-message
    */
	sendMessage (req, res) {
		console.log("sendMessage--------------",req.user)
		let userinfo = req.user,that = this,
            form = new formidable.IncomingForm(),files=[], fields={}, messages=[];
        /*parse incoming form for files and fields......*/
        try{
        	form.on('field', (field, value) => {
        		console.log('field-- ',field)
	            fields[field] = value;
	        })

	        form.on('file', (field, file) => {
	        	console.log('file-- ',file)
	            files.push(file);
	        })

	        form.on('error', function(err) {
	        	console.log('err== ',err);
			    })
			form.on('aborted', function() {
				console.log('aborted== ');
			})
	        form.on('end', () => {
	        	console.log('end--------- ')
	            req.body._id = fields.receiver;
	            DECODE.required(req, res, (user)=>{

	                ASYNC.waterfall([
	                    (_callback) => {
	                    	console.log('fields--- ',fields)
	                        /** check for required params */
	                        if (fields.conversationId) {
	                            _callback(null);
	                        } else {
	                            _callback("Conversation Id is required.");
	                        }
	                    },
	                    (_callback) => {
	                        /** check conversation thread status */
	                        Conversation.findOne({
	                            _id: new ObjectId(fields.conversationId)
	                        }, {
	                                status: 1,
	                                chat_status:1
	                            }, (err, result) => {
	                                if (result) {
	                                    /** check conversation thread status */
	                                    if (result.status === 'Hide') {
	                                        /** */
	                                        _callback("You can't send message in this chat room.");
	                                    } else if (result.status === 'Deleted') {
	                                        /** */
	                                        _callback("You're no longer able to send message to this user.");
	                                    } else if (result.status === 'Blocked') {
	                                        /** */
	                                        _callback("Your convertation is Blocked for this user.");
	                                    } else {
	                                    	if(result.chat_status === 'Stop'){
	                                    		/** to update for chat start*/
	                                    		Conversation.update(
                                    			 {_id: new ObjectId(fields.conversationId)},
                                    			 {chat_status:'Start'},(err,updated)=>{
                                    			 	console.log("Chat started between both users.....")
                                    			})

	                                    	}
	                                        _callback(null);
	                                    }
	                                } else {
	                                    _callback("You can't send message in this chat room.");
	                                }
	                            });
	                    },
	                    (_callback) => {
	                        /** get data and save message now */
	                        
	                        let data = {
	                            sender: userinfo._id,
	                            receiver:user._id,
	                            read: [userinfo._id],
                              deliver: [userinfo._id],
	                            conversationId: new ObjectId(fields.conversationId),
	                            timestamp: DATE.timestamp(),
	                            members: [userinfo._id,user._id]
	                            //members: (fields.members) ? this._members(fields.members) : []
	                        };


	                        if (fields.attachment) data.attachment = fields.attachment;
	                        if (fields.duration) data.duration = fields.duration;

	                        if (files && files.length) {

	                            /*if received multiple files then process them parallelly*/
	                            /*create directory dynamically based on conversation*/
	                            ASYNC.eachOf(files,
	                                (file, key, callback) => {
	                                    /* Save file on server*/
	                                    let filename = attachment.fileSlug(file);
	                                    let _data = {};
	                                    /*assign message body with file name*/
	                                    _data.body = filename;

	                                    _data.mimeType = file.type;

	                                    CLOUDINARY.uploadFile(file.path, file.name)
	                                        .then(response => {
	                                            _data.attachment = response;
	                                            messages.push(Object.assign(_data, data));
	                                            callback(false);
	                                        })
	                                        .catch(err => console.log(err));

	                                    /* End save file code*/
	                                },
	                                (err) => {
	                                    /*update user details*/
	                                    Chat.insertMany(messages, (err, insertedMany) => {
	                                        if (insertedMany) {
	                                            _callback(null, insertedMany);
	                                        } else {
	                                            _callback(err);
	                                        }
	                                    });
	                                });
	                        } else {
	                            /*Send textual message or from Google drive/Dropbox*/
	                            data.body = fields.body ? fields.body : "N/A___";
	                            //data.attachment = "";
	                            data.attachment = new Object();
	                            var chat = new Chat(data);
	                            chat.save()
	                                .then(result => _callback(null, result))
	                                .catch(err => _callback(err));
	                        }
	                    }
	                ], (err, result) => {
	                	if (err) res.json(this.response({ err: err, message: error.oops() }));
	                	if (result){
	                		result = JSON.parse(JSON.stringify(result));/*this line to modify object*/
	                		result['profilePicture'] = (userinfo.profilePicture)?userinfo.profilePicture:`${HostPath.host(req)}sitePicture/img_avatar.png`;
		                	result['name'] = userinfo.name;
                      result['pushMessage'] = `${userinfo.name} sent you a message.`;
	                		res.json(this.response({ data: (result.constructor === Array) ? result : [result], message: "Your message has been posted.", curtime: DATE.format("YYYY-MM-DD") }));	
	                	} 
	                });

	            });
	            
	        });
	        //form.parse(req);
	        form.parse(req, function(err, fields, files) {
		      console.log('err---->>>> ',err)
		      console.log('fields---->>>> ',fields)
		      console.log('files---->>>> ',files)
		    });
        }catch(e){
        	console.log("e-- ",e)
        	if (err) res.json(that.response({ err: e, message: error.oops() }));
        }
    }
    /**this method is used to send text messages only for ios app developer
    * method : OST
    * endpoint: /api/send-text-message
    */
    postTextMessage (req, res) {
    	let userinfo = req.user,that = this,obj = req.body;
        req.body._id = obj.receiver;
        DECODE.required(req, res, (user) =>{
            ASYNC.waterfall([
                (callback) => {
                    /** check for required params */
                    if (obj.conversationId){
                        callback(null);
                    }else{
                        callback("Conversation Id is required.");
                    }
                },
                (callback) => {
                    /** check conversation thread status */
                    Conversation.findOne({
                        _id : new ObjectId(obj.conversationId)
                    },{
                        status : 1,
                        chat_status:1
                    }, (err, result) => {
                    	if (result) {
                            /** check conversation thread status */
                            if (result.status === 'Hide') {
                                /** */
                                callback("You can't send message in this chat room.");
                            } else if (result.status === 'Deleted') {
                                /** */
                                callback("You're no longer able to send message to this user.");
                            } else if (result.status === 'Blocked') {
                                /** */
                                callback("Your convertation is Blocked for this user.");
                            } else {
                            	if(result.chat_status === 'Stop'){
                            		/** to update for chat start*/
                            		Conversation.update(
                        			 {_id: new ObjectId(obj.conversationId)},
                        			 {chat_status:'Start'},(err,updated)=>{
                                console.log('updated--- ',updated);
                        			 	console.log("Chat started between both users.....")
                        			})

                            	}
                                callback(null);
                            }
                        } else {
                            callback("You can't send message in this chat room.");
                        }
                    });
                },
                (callback) => {
                    /** get data and save message now */
                    let data = {
                        sender: userinfo._id,
                        receiver:user._id,
                        body: obj.body,
                        read: [userinfo._id],
                        deliver: [userinfo._id],
                        conversationId: new ObjectId(obj.conversationId),
                        timestamp: DATE.timestamp(),
                        members: [userinfo._id,user._id]
                        //members: (obj.members) ? this._members(obj.members) : []
                    };

                    var chat = new Chat(data);
                    chat.save().then(result => callback(null, result)).catch(err => callback(err));
                }
            ], (err, result) => {
                if (err) res.json(that.response({ err: err, message: error.oops() }));
                if (result) {
                  result = JSON.parse(JSON.stringify(result));/*this line to modify object*/
                  result['profilePicture'] = (userinfo.profilePicture)?userinfo.profilePicture:`${HostPath.host(req)}sitePicture/img_avatar.png`;
                  result['name'] = userinfo.name;
                  result['pushMessage'] = `${userinfo.name} sent you a message.`;
                	res.json(this.response({ data: (result.constructor === Array) ? result : [result], message: "Your message has been posted.", curtime: DATE.format("YYYY-MM-DD") }));	
                  //res.json({ type: "success", message: "Your message has been posted.", data: [result], curtime: DATE.format("YYYY-MM-DD") });
                }
            });
        });
    }
    /**this method is used to read messages
    * method : POST
    * endpoint: /api/read-messages
    */
  readMessages(req, res){
    let obj = req.body,
        userInfo = req.user;
    Chat.update({
      sender: {
        $ne: userInfo._id.toString()
      },
      conversationId: new ObjectId(obj.conversationId),
      read: {
        $nin: [userInfo._id.toString()]
      }
      }, {
        $addToSet: {
          read: userInfo._id.toString()
        }
      }, {
        multi: true
      }, (err, updated) => {
        ///*unread status changed*/
        //console.log('updated--- ',updated)
        if (err) {
          return res.json(this.response({ err: err, message: error.oops() }));
        } else {
          return res.json(this.response({ data:updated , message: "success" }));
        }
      });
  }  
	/**this method is used to get all one to one messages
    * method : GET
    * endpoint: /api/message-trails
    */
	messageTrails(req, res){
		let userinfo = req.user,
			obj = req.body,
		    data = {},
		    limit   = parseInt(process.env.LIMIT)||10,
			//limit = (obj.page) ? parseInt((obj.page - 1) * limit):0,
			page = obj.page ? parseInt(obj.page) : 1,
			offset = ((page - 1) * limit),
			match = {
				conversationId: new ObjectId(obj.conversationId),
			};
			

		/*if user want to get specific message after time*/
		if (obj.created) {

			match.timestamp = { $gt: parseInt(obj.created) }
		}
		//console.log('obj---- ',obj);
		/*verify user*/
		req.body._id = userinfo._id;
		DECODE.required(req, res, (user) => {
			ASYNC.waterfall([
				(callback) => {
					/*Stage 1 - Validating Conversation ID*/
					if (!obj.conversationId) {
						callback("Conversation Id is required.");
					} else {

						/*update user's unread messages*/
						Chat.update({
							sender: {
								$ne: user._id.toString()
							},
							conversationId: new ObjectId(obj.conversationId),
							read: {
								$nin: [user._id.toString()]
							}
						}, {
								$addToSet: {
									read: user._id.toString()
								}
							}, {
								multi: true
							}, (err, updated) => {
								///*unread status changed*/
								console.log('updated--- ',updated)
							});

						callback(null);
					}
				},
				(callback) => {
					/*Stage 2 - get conversation details*/
					Conversation.aggregate([
						{
							$match: {
								_id:  new ObjectId(obj.conversationId),
								"chatUsers._id": new ObjectId(user._id)
							}
						}, {
							$project: {
								chatUsers: 1,
								currentUsers: 1,
								status: 1,
								created_at: 1
							}
						}
					], (err, conversation) => {
						console.log("conversation==>",conversation)
						if (conversation && conversation.length) {
							conversation = conversation[0];
							if (conversation.chatUsers) {
								let users = {};
								conversation.chatUsers.map(user => {
									users[user._id] = user;
								});
								data.users = users;
							}
							//data.conversation=conversation;
							callback(null, data);
						} else {
							callback("You're not authorized to view this conversation.");
						}
					});
				},
				(r, callback) => {
				/*Stage Extra - get last read message*/
				Chat.aggregate([
						{
							$match:{
								$and:[
									{conversationId:new ObjectId(obj.conversationId)},
								]
							}
						},
						{
							$project:{
							    created_at: 1,
							    timestamp: 1,
							    read:1,
							    index: { $indexOfArray: [ "$read", userinfo._id.toString() ] },
							    readSize: {"$size":"$read"},
							}
						},
						{ '$match': { index: { '$ne': -1 } } },
						{ $sort : { timestamp : -1 } },
						{ $limit : 1 }
					])

					/*Chat.aggregate([
						{
							$match:{
								$and:[
									{conversationId:new ObjectId(obj.conversationId)},
								]
							}
						},
						{
							$project:{
							    created_at: 1,
							    timestamp: 1,
							    readSize: {"$size":"$read"},
							}
						},
						{ $match:{readSize:{$gte:2}}},
						{ $sort : { timestamp : -1 } },
						{ $limit : 1 }
					])*/
					.then(result => {
						//console.log('result--- ',result)
						data["lastReadMessage"]=result[0].timestamp;
						callback(null, data);
					})
					.catch(err => {
						callback("No conversation found")
					});
				},
				(r, callback) => {
					/*Stage 3 - get total message count*/
					Chat.count(match, (err, total) => {
						if (total) {
							data.total = total;
							callback(null, data);
						} else {
							callback("There are currently no messages in this thread.");
						}
					});
				},
				(r, callback) => {
					/*Stage 4 - get Messages of conversation*/
					//
					Chat.aggregate([
						{
							$match: match
						},
						{
							$project: {
								body: 1,
								attachment: 1,
								conversationId: 1,
								sender: 1,
								read: 1,
                deliver:1,
								trash: 1,
								mimeType: 1,
								duration: 1,
								isEdited: 1,
								DateGroup: { "$dateToString": { "format": "%Y-%m-%d", "date": "$created_at" } },
								timestamp: 1,
								deleteBy: 1,
								thumbnail: 1,
								index: { $indexOfArray: [ "$deleteBy", user._id ] },

							}
						},
						{
							$match:{
								index :{$lt:0 }
							}
						},
						{
							$sort: {
								timestamp: -1
							}
						},
						{
							$skip: offset
						},
						{
							$limit: limit
						},
						{
							$group: {
								_id: "$DateGroup", // as group by date
								messages: {
									$push: {
										_id: "$_id",
										body: {
											$cond: {
												if: {
													$eq: ["$trash", true]
												},
												then: "This message has been removed",
												else: "$body"
											}
										},
										messageType: {
											$cond: {
												if: {
													$eq: ["$sender", user._id.toString()]
												},
												then: "send",
												else: "receive"
											}
										},
										attachment: "$attachment",
										conversationId: "$conversationId",
										sender: "$sender",
										read: "$read",
                    deliver: "$deliver",
										duration: "$duration",
										mimeType: "$mimeType",
										trash: "$trash",
										isEdited: "$isEdited",
										timestamp: "$timestamp",
										deleteBy:"$deleteBy",
										thumbnail:"$thumbnail",
										index:"$index"
									}
								}
							}
						},
						{
							$match: {$or:[{"messages.index":-1},{"messages.index":null}]}
						},
						{
							$sort: {
								"messages._id": 1,
								//"messages.$.timestamp": 1,

								//_id: -1,
								//timestamp: -1
							}
						}
					])
						.then(result => {
							data.messages = result
							callback(null, data);
						})
						.catch(err => callback("No conversation found"));
				}
				
			], (err, results) => {
				console.log("result===>",results)
				if (err) {
					return res.json(this.response({ err: err, message: error.oops() }));
				} else {
					return res.json(this.response({ data:results , message: "success" }));
				}
			});
		});
	}
  /**this method is used to delete all messages of particular conversation
    * method : POST
    * endpoint: /api/clear-all-chat
    */
  clearAllChat(req, res) {
      let obj = req.body,
          userInfo = req.user;
    /*verify user*/
      DECODE.required(req, res, (user) => {
        ASYNC.waterfall([
          (callback) => {
            /*Stage 1 - Validating Conversation ID*/
            if (!obj.conversationId) {
              callback("Conversation Id is required.");
            } else {
              let query = {conversationId:ObjectId(obj.conversationId)},
                toUpadte = { $addToSet: { deleteBy: userInfo._id } };
              Chat.update(query,toUpadte,{ multi: true },(err,result)=>{
                callback(err,result);
              })    
            }
          }

        ],(err,results)=>{
          if (err) {
            res.status(412).json({ type: "error", message: ERROR.oops(), errors: [err] });
          } else {
            res.json({ type: "success", message: "chat has been cleared", data: results });
          }
        }); 
      }); 
  }
}
module.exports = MessageController
