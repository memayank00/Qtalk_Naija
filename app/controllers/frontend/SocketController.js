const path = require("path"),
	  n    = require("needle")
	  _    = require("lodash")
	  DECODE=require(path.resolve('./app/config/libs/verify_jwt')),
	  env  = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`));

class SocketController {

	constructor(){
		this.welcome = "SocketController Welcomes you";

		//this.updateReadMessages({ to: "18", conversationId:"5abe3180013122778ddbecc0"});
	}

	/*will return array of ids*/
	getUserIds(_ids){
		let userIds=[];
		/*extract user id from array*/
		if(_ids && _ids.length){
			_ids.map((user) => userIds.push(user._id));
		}

		return userIds;
	}

	/*return length of specified room*/
	/*It tells from how many devices a user is login*/
	getSocketRoomLength(io, _roomName){
		let room = io.sockets.adapter.rooms[_roomName];
		return room?room.length:0;
	}

	/*return sockets of specified room*/
	/*It tells from how many devices a user is login*/
	getSocketsOfRoom(io, _roomName){
		let room = io.sockets.adapter.rooms[_roomName];
		return room?room.sockets:[];
	}

	/*return friend online status (bool)*/
	isFriendOnline(friends, user){
		return (friends[user.userId] && friends[user.userId].friends.includes(user.friendId)) ? true : false;
	}

	/*get user friend and online friends*/
	getUserFriends(userId){
		return new Promise((resolve, reject) => {
			n.get(env.base_url+"api/get-friends?_id="+userId, (error, response) => {
			    if(response && response.body) {
			    	resolve(response.body);
			    }
			    if(error) reject(error);
			});
		});
	}

	/*update messages status to Read*/
	/*updateReadMessages(message){
		return new Promise((resolve, reject) => {
			n.put(env.base_url+"api/update-read-messages?_id="+message.from, message, (error, response) => {

			    if(response && response.body) {
			    	resolve(response.body);
			    }
			    if(error) reject(error);
			});
		});
	}*/

	/*list my online friends...*/
	myOnlineFriends(myFriends, allBuddies){
		let olFriends = [];
		if(myFriends && myFriends.length && allBuddies && allBuddies.length){
			myFriends.map((friend) => {
				if(_.find(allBuddies, {userId:friend})) {
					olFriends.push(friend);
				}
			});
		}
		return olFriends;
	}

	/*list my online friends...*/
	getUserDeviceToken(userId){
		console.log('obj-------333 ',userId);
		return new Promise((resolve, reject) => {
			n.get(env.base_url+"api/get-user-device-token?_id="+userId, (error, response) => {
			    console.log('needle error---- ',error);
			    //console.log('needle response---- ',response);
			    if(response && response.body) {
			    	resolve(response.body.data);
			    }else{
					reject(error);
				}
			});
		});
	}

	clrUserCallRecords(userId) {
		return new Promise((resolve, reject) => {
			n.delete(env.base_url + "api/clear-user-call-record?_id=" + userId, (error, response) => {
				if (response && response.body) {
					resolve(response.body.data);
				} else {
					reject(error);
				}
			});
		});
	}
}

module.exports = SocketController;
