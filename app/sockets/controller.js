'use strict';
const path                = require('path'),
	  _				  	  = require("lodash"),
	  //needle 			  = require('needle'),
	  ObjectId	  		  =	require('mongoose').Types.ObjectId,
	  SocketController    = require(path.resolve('./app/controllers/frontend/SocketController')),
      Chat                = require(path.resolve('./app/models/Chat')),
      Conversation        = require(path.resolve('./app/models/Conversation')),
      Push                = require(path.resolve('./app/config/libs/pushNotification')),
      Badge 			  = require(path.resolve(`./app/config/libs/badgeCount`)),
      env                 = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`));
      require('events').EventEmitter.prototype._maxListeners = 100;

/**
 * Socket Task List
 * - Connection/Disconnection to Socket
 * - Sending Realtime messages/media
 * - Same User with Multiple Devices (Multiple Socket IDs)
 * - Realtime Typing Detection
 * - Online User List
 * - Seen (Double Tick Messages)
 * - Auto Connection after restarting socket server
 * - Conversation/Chat Database in MongoDB
 */

class Sockets extends SocketController{
	constructor(io){
		super();
		this.io  = io;
		/*store online users*/
		this.onlineUsers = [];
		/*Store online users friends*/
		this.friends = {};
		/*expected schema*/
		/*{
			"userId" : {
				"friends" : ["UID1", "UID2"],
				"online"  : ["UID2"]
			}
		}*/

		/*INit Push Class for Sending Push Notificaitons*/
		this.push = new Push();

		/*binding current scope*/
		this.init = this.init.bind(this);
		//this.conn = this.conn.bind(this);
		//this.infoAdminMessage = this.infoAdminMessage.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refreshFriendList = this.refreshFriendList.bind(this);
		this.sendPush = this.sendPush.bind(this);
		this.sendAlert = this.sendAlert.bind(this);
		//this.sendDataToApprtc = this.sendDataToApprtc.bind(this);
		//this.checkPush = this.checkPush.bind(this);
	}
	
	sendAlert(body){
		//console.log('in socket controller----',body)
		/*{   ids: '5b5ffa93d9c5561722964b31_5b5ffa93d9c5561722964b32_5b5ffa93d9c5561722964b33',
			  lon: '-78.02491',
			  lat: '37.926868',
			  userId: '5b5066851540791ebcc10235' }*/
		var array = body.ids.split("_");
		//console.log('array-- ',array)
		//console.log('onlineUsers-- ',this.onlineUsers)
		for(let i=0;i<array.length;i++){
			//console.log('onlineUsers-- %%%>>> ',this.onlineUsers)
			//console.log('array-- %%%>>> ',array[i])
			if(_.find(this.onlineUsers, {userId : array[i]})){
				console.log('onlineUsers-- %%%>>> ',this.onlineUsers)
				console.log('array[i]--- ',array[i]);
				/*id= to whome sent
				lat = updated lat 
				lon = updated lon
				userId = who sent */
				this.io.sockets.to(array[i]).emit("send.alert", { id: array[i],lat:body.lat,lon:body.lon,userId:body.userId,speed:body.speed,speedTime:body.speedTime});
			}
		}
	}
	init(){
		
		this.io.on('connection', socket => {

			console.log('connection------')
			/*socket connection created*/

			/*let current socket id know then it is connected to socket*/
			this.io.sockets.to(socket.id).emit("connected", {socket: socket.id});

			socket.on("disconnecting", () => {
				console.log("-------->>>>>>>>>>", socket.id);
				/*if user is going to disconnected then --(minus) room length*/
				if(this.io.sockets.adapter.sids[socket.id]){
					/*loop to find appropriate room to decrease the length*/
					for(let key in this.io.sockets.adapter.sids[socket.id]){
						/*If key=userId or Room exists in our online user list then decrease length*/
						if(_.find(this.onlineUsers, {userId : key})){
							/*room found*/
							let index = _.findIndex(this.onlineUsers, {userId : key});
							if(index>=0) {
								this.onlineUsers[index].length = this.getSocketRoomLength(this.io, key)-1;
								/*if length equals to zero*/
								if(this.onlineUsers[index].length===0){
									/*then remove user from online users array*/
									_.remove(this.onlineUsers, {"userId": key});
									/** clear user call records */
									console.log("clear call records for ", key)
									
									/*unregister user friends list*/
									/*Intimate other users that their friend is going to offline*/
									if(this.friends[key] && this.friends[key].online.length){
										/*loop loggedin user friends*/
										/*and refresh their friend's online status*/
										this.friends[key].online.map((friend) => {
											this.refresh(friend);
											/*intimate client as well*/
											this.io.sockets.to(friend).emit("friend.offline", {friendId:key, message:"Friend has been disconnected from system."});
										});
									}
									delete this.friends[key];
								}
							}
							/*exit the loop if condition matched*/
							break;
						}
					}
				}
				console.log("online User on disconnect-------->>> ", this.onlineUsers);
			});

			

			socket.on("disconnect", () => {
				console.log("-----------------", socket.id);
				/*socket connection disconnected*/
				/*socket.id got disconnected*/
			});

			/*login action - inserting a user in online user object*/
			socket.on("login", (user) => {
				console.log('login----->>> ',user);
				/*convert into object*/
				/*for android users*/
				if(typeof user === 'string') user = JSON.parse(user);
				
				/*make sure userId is provided*/
				if(!user.userId) return false;

				if(!_.find(this.onlineUsers, { userId : user.userId }) ){
					/*bind socket id with user data*/
					//user.socketid = socket.id;
					/*user room length*/
					// user.length = this.getSocketRoomLength(this.io, user.userId)+1;
					user.length = 1;
					/*check if users is already online then skip the process*/
					/*otherwise insert into online user list*/
					this.onlineUsers.push(user);
				}
				console.log('onlineUsers-----1 ',this.onlineUsers);
				/*join users to own room to communicate with themself - if same user is logged in multiple devices - ios, android, web*/
				/*a user can join the same room multiple times with different socket ids*/
				socket.join(user.userId);
				socket.join("online");
				/*assign users's friends and online friends */
				this.refresh(user.userId);
				

				if(_.find(this.onlineUsers, { userId : user.userId }) ){
					/*increase socket room length for a specific room*/
					let index = _.findIndex(this.onlineUsers, {userId : user.userId});
					/*if user found then ++ length*/
					if(index >= 0){
						this.onlineUsers[index].length = this.getSocketRoomLength(this.io, user.userId);
					}
				}

				//setTimeout(() => this.refreshFriendList(user), 1000);

				this.io.sockets.to(user.userId).emit("login", {message:"You logged into socket."});
				/*to acnowledge to all online friends that user online again*/
				/*console.log('this.friends--- ',this.friends);
				if(this.friends[user.userId] && this.friends[user.userId].online.length){
					this.friends[user.userId].online.map((friend) => {
						console.log('friend---##---> ',friend);
						this.io.sockets.to(friend).emit("friend.online", {friendId:user.userId, message:"Friend has been Online."});
					});
			    }*/
			});
			socket.on("acknowledge.login", (user) => {
				//console.log('user--->> ',typeof user);
				if(this.friends[user.userId] && this.friends[user.userId].online.length){
					this.friends[user.userId].online.map((friend) => {
						this.io.sockets.to(friend).emit("friend.online", {friendId:user.userId, message:"Friend has been Online."});
					});
			    }
			});
			/*message deliver......*/
			socket.on("message.deliver", (writer) => {
				/*First check whether user is online or not*/
				console.log('message.deliver-------------->>>>>>>###', writer);
				try{
					console.log("within try block....")
					Chat.update({
						receiver: writer.from.toString(),
						sender: writer.to.toString()
						/*sender: {
							$ne: writer.from.toString()
						},
						conversationId: new ObjectId(writer.conversationId),
						deliver: {
							$nin: [writer.from.toString()]
						}*/
					}, {
						$addToSet: {
							deliver: writer.from.toString()
						}
					}, {
						multi: true
					}, (err, updated) => {
						console.log('err--- ',err)
						console.log('updated--- ',updated)
					});
				}catch(e){
					console.log('e-- ',e)
				}
				if(_.find(this.onlineUsers, {userId : writer.to})){
					/*User is online - send emit to user regarding typing event*/
					this.io.sockets.to(writer.to).emit("message.deliver", { id: writer.to, from: writer.from ? writer.from:undefined, message:"Your message has been delivered."});
				}
			});
			/*logout - remove user from online users list*/
			socket.on("logout", (user) => {
				if(typeof user === 'string') user = JSON.parse(user);

				/*leave room as well*/
				socket.leave(user.userId);
				socket.leave("online");

				if(_.find(this.onlineUsers, {userId : user.userId}) && !this.getSocketRoomLength(this.io, user.userId)) {
					/*if user is online remove from online users array*/
					_.remove(this.onlineUsers, {userId : user.userId});
				}else{
					/*increase socket room length for a specific room*/
					let index = _.findIndex(this.onlineUsers, {userId : user.userId});
					/*minus then length of room user*/
					this.onlineUsers[index].length = this.getSocketRoomLength(this.io, user.userId);
				}

				this.io.sockets.to(socket.id).emit("logout", { message: "You've been logged out." });
			});

			/*Join Room......*/
			socket.on("room.join", (obj) => {
				console.log("room type---- ",typeof obj);
				console.log("room join---- ",obj);
				// request- {rooms :["A", "B"]}
				socket.join(obj.rooms);
				/*obj.rooms.forEach(function(room) {
					console.log('room_name--', room);
					socket.join(room);
				});*/
			});
			/*Leave Room......*/
			socket.on("room.leave", (obj) => {
				// request- {room : "A"}
				console.log('leave room--',obj)
				socket.leave(obj.room);
			});
			/*Bulk Room Join......*/
			// socket.on("room.bulk.join", (obj) => {
				
			// 		Format-
			// 		obj = {convertationIds:['5c45ae523b4de660f7e4c889','5c234a44e306e331c0282de0','5c45948c4bcd80055636b948','5c2f5bbd8d9d677230955f0b','5c45928b4bcd80055636b947']}
				
			// 	socket.join(obj.convertationIds);
			// });

			/*Listeners......*/
			socket.on("typing.listener", (writer) => {
				/*First check whether user is online or not*/
				console.log('writer-------------->>>>>>>###', writer);
				if(_.find(this.onlineUsers, {userId : writer.to})){
					/*User is online - send emit to user regarding typing event*/
					this.io.sockets.to(writer.to).emit("typing.listener", { id: writer.to, from: writer.from ? writer.from:undefined, message:writer.name+" is typing...",status:writer.status});
				}
			});

			socket.on("message.group_send", (message) => {
				console.log("------>>>>inside group message ",message)
				console.log("------>>>>typeof group message ",typeof message)
				if(message.is_group === "1"){
					console.log("message room---->> ",message.room);
					console.log("message room to ---->> ",this.io.to());
               	 this.io.sockets.to(message.room).emit("message.group_get", {message:`You have a group message.`, data:message});
                }
			});

			socket.on("message.send", (message) => {
				//message = {};
				//console.log('this.friends-------------->>>>>>>###', this.friends)
				console.log('message.send-------------->>>>>>>###', message)
				//this.sendPush(message)
				//message = JSON.parse(message);
				if(typeof message === 'string') message = JSON.parse(message);
				//console.log('message type-------------->>>>>>>###', typeof message)
				/*send a message to message.to if he is online*/
				console.log('this.onlineUsers-------------->>>>>>>###', this.onlineUsers);
				//console.log('receiver-------------->>>>>>>###', message.receiver)
				if(_.find(this.onlineUsers, {userId : message.receiver})){
					/*User is online - send emit to user regarding a new message*/
					console.log("emit to ------ ",message.receiver);
					this.io.sockets.to(message.receiver).emit("message.get", {message:message.name+" has sent you a mesage", data:message});
				}
				if(message.is_group === "1"){
               	 console.log("------>>>>inside group message ")
               	 this.io.to(message.room).emit("message.get", {message:`You have a group message.`, data:message});
                }
				if(!_.find(this.onlineUsers, {userId : message.receiver})){
					/*User is online - send emit to user regarding a new message*/
					console.log("send push to ------ ",message.receiver);
					this.sendPush(message)
				}
				/*Send push to get user know that they got a message*/
				/*will send only to offline users*/
				/*message.event = "message.acknowledge";
				//console.log('message---- ',message);
				var convertationId = message.conversationId;
		        Conversation.findOne({_id:convertationId},(err,record)=>{
		        //Conversation.findOne({_id:convertationId,isPaid:true},(err,record)=>{	
		            if(record){
		                //console.log('record---- ', Object.keys(record.muteObj))
		                //console.log('record---- ', record.muteObj.expTime)
		                //console.log('Now--- ',new Date().getTime())
		                if((record.muteObj.expTime && new Date().getTime()>record.muteObj.expTime) ||(!record.muteObj.expTime)){
		                    //console.log('write code here to push data')
		                    this.sendPush(message, true);
		                }else{
		                	
		                	this.sendPush(message, true, true);
		                }
		            }
		        })*/

				//this.sendPush(message);
			});

			// socket.on("message.send", (message) => {
			// 	/*send a message to message.to if he is online*/
			// 	if(_.find(this.onlineUsers, {userId : message.to})){
			// 		/*User is online - send emit to user regarding a new message*/
			// 		this.io.sockets.to(message.to).emit("message.get", {message:message.name+" has sent you a mesage", data:message});
			// 	}

			// 	/*Send push to get user know that they got a message*/
			// 	/*will send only to offline users*/
			// 	message.event = "message.acknowledge";
			// 	this.sendPush(message);
			// });

			socket.on("message.delete", (message) => {
				/*send a message to message.to if he is online*/
				if(_.find(this.onlineUsers, {userId : message.to})){
					/*User is online - send emit to user regarding a deleted message*/
					this.io.sockets.to(message.to).emit("message.delete", {message:"Message Deleted", data:message});
				}
			});

			socket.on("message.acknowledge", (message) => {
				/*acknowledge to message.to that message is received*/
				if(_.find(this.onlineUsers, {userId : message.to})){
					/*User is online - send emit to user regarding a received message*/
					this.io.sockets.to(message.to).emit("message.acknowledge", {message:"Message Received", data:message});
				}

				/*Send push to get user know that they got a message*/
				/*will send only to offline users*/
				//message.messageType = "MESSAGE_DEV1OFF";
				
				message.x=true;
				this.sendPush(message, true, true);
				//this.sendPush(message);
			});

			socket.on("message.read", (message) => {
				console.log('message.read--###--> ',message);
				if(_.find(this.onlineUsers, {userId : message.to})){
					console.log('message.read--True--> ');
					/*User is online - send emit to user regarding a received message*/
					this.io.sockets.to(message.to).emit("message.read", {message:"Message Read", data:message});
				}

				//this.sendPush(message);
				
		    	/*receieve message from client (web/mob)*/
				/*if (message.conversationId && message.messageId && message.from){
		    		this.updateReadMessages(message).then(r=>true).catch(e=>false);
		  		}*/
		    });

			/*My Online Friends*/
			socket.on("get.online.friends", (user) => {
				/*get request user online friends*/
				console.log("get.online.friends----> ",user)
				console.log("get.online.friends 2----> ",this.friends);
				this.io.sockets.to(user.userId).emit("get.online.friends", {friends:this.friends[user.userId]?this.friends[user.userId]:[]});
			});

			/*Check if Friend is online or not*/
			socket.on("friend.online.status", (user) => {
				/*get request user online friends*/
				this.io.sockets.to(user.userId).emit("friend.online.status", {friendId: user.friendId, isFriendOnline:this.isFriendOnline(this.friends, user)});
			});

			/*if friend block*/
			socket.on("friend.block", (data) => {
				/*send block/unblock request to friend*/
				if (_.find(this.onlineUsers, { userId: data.to})){
					this.io.sockets.to(data.to).emit("friend.block", { message:"convertation Blocked", data:data });
				}
			});
			/*Check if Friend is online or not*/
			// socket.on("friend.block.unblock", (data) => {
			// 	/*send block/unblock request to friend*/
			// 	if (_.find(this.onlineUsers, { userId: data.to})){
			// 		this.io.sockets.to(data.to).emit("friend.block.unblock", { data });
			// 	}
			// });
			/*Check if Friend is online or not*/
			socket.on("request.type", (data) => {
				console.log("request.type------ ",data);
				/*send block/unblock request to friend*/
				if (_.find(this.onlineUsers, { userId: data.to})){
					this.io.sockets.to(data.to).emit("request.type", { message:data.message, type:data.type, to:data.to});
				}
			});
			/*user calling to another user......*/
			/*socket.on("user.calling", (data) => {
				// var data = {
				//   hostUserName:"test",	
				//   hostId:'XXX',
				//   guestId:'YYY',
				//   callType:'video'
				// }
				if(_.find(this.onlineUsers, {userId : data.to})){
					User is online - send emit to user regarding user calling
					this.io.sockets.to(data.to).emit("user.calling", { id: data.to, from: data.from ? data.from:undefined, message:data.hostUserName+" is calling....."});
				}
			});*/
			/*error*/
			socket.on("error", (e) => {
				/* console.log("showing errors----> ", e); */
			});

		});

		setInterval(() => {
			// console.log(this.friends);
			//console.log(this.onlineUsers);
			/* console.log(this.io.sockets.adapter.sids); */
		}, 5000)
	}

	refresh(userId){
		//console.log('refresh----> ',userId);
		this.getUserFriends(userId)
		.then(result => {
			//console.log('refresh----> ',result);
			this.friends[userId] = {
				friends : result.data.friends,
				online : this.myOnlineFriends(result.data.friends, this.onlineUsers)
			};
		})
		.catch((err) => {
			//console.log('refresh err----> ',err);
		});
		//.catch(err => false);
	}

	refreshFriendList(user){
		if(this.friends[user.userId] && this.friends[user.userId].friends.length){
			/*loop loggedin user friends*/
			/*and refresh their friend's online status*/
			this.friends[user.userId].friends.map((friend) => {
				
				if(_.find(this.onlineUsers, {userId:friend})){
					/*if friend is online then refresh their list*/
					this.refresh(friend);
					
					/*intimate client as well*/
					this.io.sockets.to(friend).emit("friend.online", {friendId:user.userId, message:"Friend has come Online."});
				}
			});
		}
	}

	/**
	 * [sendPush description]
	 * @param  {[object]} datagram [this will have message, message.to, message.from]
	 * @return {[type]}          [acknowledgement]
	 */
	 sendPush(datagram){
		/*check if user is offline or not*/	
		/*if friend is offline currently*/
		/**if user is offline then send push only */
		console.log('datagram111---> ',datagram);
		//let badge = await Badge.badge(datagram.receiver)
		//console.log('badge--->>>>> ',badge);
		//datagram.to = '5b5ffa93d9c5561722964b31';
		/*only assign from 'receiver' to 'to' variable*/
		datagram.to = datagram.receiver;
		datagram.from = datagram.sender;
		if (!_.find(this.onlineUsers, { userId: datagram.to })) {
			//console.log('datagram.to---222> ',datagram.to);

			
			this.getUserDeviceToken(datagram.to)
			.then(result => {
				console.log('result---3333> ',result);
				/*array of token received here*/
				if (result && result.length){
					result.map((tokenData) => {
						//console.log('tokenData---> ',tokenData);
						let fromId = (datagram.from)?datagram.from : undefined;
						const pushData = {
							conversationId: datagram.conversationId ? datagram.conversationId : undefined,
							messageId: datagram._id ? datagram._id : undefined,
							action: !datagram.event ? 'dbupdate' : 'none',
							body: (datagram.body) ? datagram.body : undefined,
							timestamp: (datagram.timestamp) ? datagram.timestamp : undefined,
							from: datagram.from ? datagram.from : undefined,
							profilePicture: datagram.profilePicture ? datagram.profilePicture : undefined,
							name: datagram.name ? datagram.name : undefined,
							isFriendOnline:this.isFriendOnline(this.friends, {userId:fromId})
						};


						//var detector = pushData.body || "You got a new message";
						var detector = pushData.body;
						//console.log('detector-- ',detector);
						if (detector && detector.indexOf("image/") >=0){
							detector = "Image"
						}
						if (detector && detector.indexOf("video/") >= 0) {
							detector = "Video"
						}
						if (detector && detector.indexOf("audio/") >= 0) {
							detector = "Audio"
						}

						//console.log('pushData--->>> ',pushData.slient);
						if(tokenData.deviceType=='ios'){
						//if(tokenData.deviceType==2 && pushData.slient ===false ){	
							console.log('deviceType==2---> Apple---- ',pushData);
							/*send push notification to IOS device*/
							this.push.APN(
								tokenData.deviceToken, 
								//datagram.x ? "Message Delivered" : detector, 
								datagram.pushMessage ? datagram.pushMessage :"you have a notification from Tracking app" ,
								tokenData.badge + 1,
								//badge, 
								pushData,
								'0',
								datagram.receiver
							)
							.then(result => {
								/*send emit to user*/
								console.log('result---- ',JSON.stringify(result));
								if(datagram.event) {
									let socketData = {
										conversationId: datagram.data[0].conversationId,
										messageId: datagram.data[0]._id,
										from: datagram.from, 
										to: datagram.to
									}
									this.io.sockets.to(datagram.from).emit("message.acknowledge", { message: "Message Recevied", data: socketData});
								}
							})
							//.catch(error => false);
							.catch((error) => {
								console.log("error-----1 ",error);
							});
						}else{
							//console.log('deviceType==2---> Android',);
							/*send pushMessagepush notification to Android device*/
							this.push.FCM(
								tokenData.deviceToken, 
								//'evGMKfgQcVQ:APA91bGxd5BL3Nmp7ECZRNwwePAVlTEhA80PnA7Jbd5koGGfin0x8QEsMuzyLW4Dme_x8nhqpsa8OaWkmFhsEzE6g6d2MU2_N9DmAG44iEBJYhrZsUc_QcT7awojFK7wG0zuVgRDJYjE',
								//datagram.x ? "Message Delivered" : detector,
								datagram.pushMessage ? datagram.pushMessage :"you have a notification from Tracking app" , 
								tokenData.badge + 1, 
								//badge,
								pushData,
								'0',
								datagram.receiver
							)
							.then(result => {

								console.log("=============================================*");
								if(typeof result === 'string'){
									result = JSON.parse(result);
								}

								console.log(result, datagram);

								/*send emit to user*/
								if(datagram.event) {
									let socketData = {
										conversationId: datagram.data[0].conversationId,
										messageId: datagram.data[0]._id,
										from: datagram.from,
										to: datagram.to
									}
									if(result && result.success && result.success.toString() === "1"){
										console.log("sending emit to " + datagram.from)
										 this.io.sockets.to(datagram.from).emit("message.acknowledge", { message: "Message Recevied", data: socketData });
									}
								}
							})
							//.catch(error => false);
							.catch((error) => {
								console.log("error-----2 ",error);
							});
						}
					});
				}
			})
			//.catch(err => false);
			.catch((err) => {
				console.log("error-----3 ",err);
			});
			
		}
	}
}

module.exports = Sockets;
