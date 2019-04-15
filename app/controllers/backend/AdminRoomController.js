const crypto = require("crypto"),
  path = require("path"),
  mongoose = require("mongoose"),
  os = require("os"),
  { detect } = require("detect-browser"),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  useragent = require("useragent"),
  jwt = require("jsonwebtoken"),
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  secret = env.secret,
  async = require("async"),
  /**Collections */
  Admin = require(path.resolve("./app/models/admin")),
  Role = require(path.resolve("./app/models/role")),
  Room = require(path.resolve("./app/models/Room")),
  User = require(path.resolve("./app/models/User")),
  Settings = require(path.resolve("./app/models/settings")),
  Requests = require(path.resolve("./app/models/requestsAdmin")),
  JWT = require(path.resolve("./app/config/libs/jwt")),
  App = require(path.resolve("./app/controllers/backend/AppController")),
  Notification = require(path.resolve(
    "./app/controllers/backend/NotificationController"
  )),
  Logs = require(path.resolve("./app/controllers/backend/LogsController")),
  needle = require("needle"),
  WrapData = require(path.resolve("./app/config/libs/wrapData")),
  shared = require("../../config/libs/shared"),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  Mailer = require(path.resolve("./app/config/libs/mailer")),
  ERROR = require(path.resolve(`./app/config/libs/error`)),
  formidable = require("formidable"),
  Cloudinary = require(path.resolve("./app/config/libs/cloudinary")),
  ObjectId = mongoose.Types.ObjectId;

class AdminController extends App {
  constructor() {
    super();
    this.getAdminAllRoom = this.getAdminAllRoom.bind(this);
  }
  /** get all admin room */
  getAdminAllRoom(req, res) {
    console.log("kgrhgihruih")
    Room.find({},(err,result)=>{
      if(err)return res.status(412).json({type: "error",message: "We couldn't proceed with this request.",error: ERROR.pull(err)});
      if(result){
        return res.json({type: "success",data: result});
      }
    })
  }
  /** update admin room */
  updateAdminRoom(req, res) {
    console.log(req.body);
    let obj = req.body;
    Room.update({_id:obj._id},{$set:obj},(err,update)=>{
      if(err)return res.status(412).json({type: "error",message: "We couldn't proceed with this request.",error: ERROR.pull(err)});
      if(update){
        return res.json({type: "success",data: update});
      }
    })
  }

  /** add admin room */
  addAdminRoom(req, res) {
    console.log(req.body);
    let obj = req.body;
    Room.find({name:obj.name.trim()},(err,room)=>{
      if(err)return res.status(412).json({type: "error",message: "We couldn't proceed with this request.",error: ERROR.pull(err)});
      if(room.length>0){
        return res.status(412).json({type: "error",message: "Room Already Exist.",error: ERROR.pull('Room Already Exist.')});
      }else{
        let room = new Room(obj);
        room.save((err,saved_obj)=>{
         if(err)return res.status(412).json({type: "error",message: "Error during save.",error: ERROR.pull(err)}); 
         else{
          return res.json({type: "success",data: saved_obj});
         }
        });
      }
    })
  }

  /** add admin room */
  addCounselor(req, res) {
    console.log(req.body);
    let obj = req.body;
    obj["status"] = true;
    obj["isEmailActive"] = true;
    obj["userType"] = 'Counselor';
    let user = new User(obj);
    user.save((err,saved_obj)=>{
       if(err)return res.status(412).json({type: "error",message: "Error during save.",error: ERROR.pull(err)}); 
       else{
          let body = {
                name: obj.name,
                email: obj.email,
                username: obj.username,
                appname: env.appname,
                password: obj.password
              };
          /**send email to nonverified registered user. */
          Mailer.Email(body.email, "counselor_registration", "app/views/", {
            body: body,
            subject: `Welcome to ${env.appname} !`
          });
          return res.json({type: "success",data: saved_obj});
         }
    })
    
  }
}
module.exports = AdminController;