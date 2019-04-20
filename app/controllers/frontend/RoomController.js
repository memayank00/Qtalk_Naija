
const path = require("path"),
  jwt = require("jsonwebtoken"),
  _ = require("lodash"),
  formidable = require("formidable"),
  fs = require("fs-extra"),
  mv = require("mv"),
  crypto = require("crypto"),
  n = require("needle"),
  /**/
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  error = require(path.resolve(`./app/config/libs/error`)),
  Mailer = require(path.resolve(`./app/config/libs/mailer`)),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  Badge = require(path.resolve(`./app/config/libs/badgeCount`)),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  App = require(path.resolve("./app/controllers/frontend/AppController")),
  shared = require("../../config/libs/shared"),
  Conversation = require(path.resolve("./app/models/Conversation")),
  Post = require(path.resolve("./app/models/post")),
  Request = require(path.resolve("./app/models/Request")),
  CLOUDINARY = require(path.resolve('./app/config/libs/cloudinary')),
  User = require(path.resolve("./app/models/User")),
  Room = require(path.resolve("./app/models/Room"));
//OTP  = require(path.resolve("./app/models/OTP"));
ObjectId = require("mongoose").Types.ObjectId;

class RoomController extends App {
  constructor() {
    super();
    /**/
    this.addRooms = this.addRooms.bind(this);
    this.getRooms = this.getRooms.bind(this);
  }
   /** add user room */
  addRooms(req, res) {
  	//console.log("add rooms ",req.body)
  	//{ _id: '5c87e7d718869c28b3a88544', name: 'test2', status: true, "type" : "add" }
  	let obj = req.body,
  		user = req.user;
  	User.findOne({_id:user._id},{userRoom:1},(err,userinfo)=>{
  		if(err) return res.json(this.response({ err: "error during find.", message: error.oops() }));
  		else{
  			console.log(userinfo)
  			if(obj.type === 'add'){
  				let update_obj = {room_id:obj._id,name:obj.name,status:true};
  				User.update({ _id: userinfo._id},
	  	    		{ $addToSet: { userRoom: update_obj } },
	  	    		(err,result)=>{
	  	    		if(err) return res.json(this.response({ err: "error during add.", message: error.oops() }));
		            else res.json(this.response({ data: result, message: "Room has been added." }));
	  	    	});
  			}else{
  				//let update_obj = {room_id:obj._id,name:obj.name,status:true};
  				User.update({ _id: userinfo._id},
  					{ $pull: {userRoom:{room_id:obj._id} }},
	  	    		//{ $push: { userRoom: update_obj } },
	  	    		(err,result)=>{
	  	    		if(err) return res.json(this.response({ err: "error during remove.", message: error.oops() }));
		            else res.json(this.response({ data: result, message: "Room has been removed." }));
	  	    	});
  			}
  		}
  	});	

  }

  getRooms(req, res) {
  	function search(nameKey, myArray){
	    for (var i=0; i < myArray.length; i++) {
	        if (myArray[i].name === nameKey) {
	            return myArray[i];
	        }
	    }
	}
  	let user = req.user;
  	Room.find({status:true},(err,rooms)=>{
  		if(err) return res.json(this.response({ err: "error during geting room.", message: err }));
  		else{
  			if(rooms.length>0){
  			  User.findOne({_id:user._id},{userRoom:1},(err,userRoom)=>{
  			  	if(err) return res.json(this.response({ err: "error during geting user rooms.", message: err }));
  			  	else{
  			  		
  			  		let lastArray = [];
  			  		rooms.forEach(function(value) {
					  var resultObject = search(value.name, userRoom.userRoom);
					  if(typeof resultObject != 'undefined'){
					  	console.log('value-- ',value)
					  	value["member"] =   true;
					  	console.log('value--2 ',value)
					 }else{
					 	value["member"] =   false;
					 }
					  lastArray.push(value);
					});
					console.log(lastArray);
					res.json(this.response({ data: rooms, message: "Rooms is available" }));
  			  	}
  			  });
  			}else{
  				res.json(this.response({ data: rooms, message: "Rooms is not available" }));
  			}
  		}	
  	}).lean()
  }
}
module.exports = RoomController;