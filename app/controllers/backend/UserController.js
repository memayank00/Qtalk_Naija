
const path = require("path"),
  jwt = require("jsonwebtoken"),
  _ = require("lodash"),
  formidable = require("formidable"),
  fs = require("fs-extra"),
  mv = require("mv"),
  crypto = require("crypto"),
  /**/
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  error = require(path.resolve(`./app/config/libs/error`)),
  Mailer = require(path.resolve(`./app/config/libs/mailer`)),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  App = require(path.resolve("./app/controllers/frontend/AppController")),
  shared = require("../../config/libs/shared"),
  User = require(path.resolve("./app/models/User"));
//OTP  = require(path.resolve("./app/models/OTP"));
ObjectId = require("mongoose").Types.ObjectId;

class UserController extends App {
  constructor() {
    super();
    /**/
    this.getUsers = this.getUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getActiveUser = this.getActiveUser.bind(this);
  }

  /**this method is used get all users for Admin
   * method : GET
   * endpoint: /admin-api/get-users
   */
  getUsers(req, res){
    console.log(req.user)
        //req.query.page = 1;
    let user    = req.user,
        obj     = req.query,
        limit   = parseInt(process.env.LIMIT),
        offset  = parseInt((obj.page - 1) * limit),
        match   = {$and:[{_id: {'$ne': ObjectId(user._id)}}]},
        select  = {username:1,name:1,email:1,fullno:1,mobile:1,ccode:1,profilePicture:1,created_at:1,status:1,location: {$ifNull: ['$location', ''] }}; 
           if(obj.searchQuery){
            match = {$and:[
              {$or:[
                {username:new RegExp(`^${obj.searchQuery}`, 'i')},
                {name:new RegExp(`^${obj.searchQuery}`, 'i')},
                {email:new RegExp(`^${obj.searchQuery}`, 'i')},
              ]},
              { _id: {'$ne': ObjectId(user._id)}}
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
            return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "Users found" })); 
          }else{
            return res.json(this.response({ data: { users: userList[0].userList ,total:total}, message: "Users Not found" })); 
          }
         }
        });
  }
  /**this method is used delete user from users list
   * method : POST
   * endpoint: /admin-api/delete-user
   */
  deleteUser(req, res){
    let user    = req.user,
        obj     = req.body;
    User.remove({_id:obj._id},(err, result)=>{
     if(err) res.json(this.response({ err: err, message: error.oops() }));
     else{
       return res.json(this.response({ data: result, message: "User is deleted successfully." }));
     }
    });      
  }
  /**this method is used delete user from users list
   * method : POST
   * endpoint: /admin-api/get-active-user
   */
  getActiveUser(req, res){
     let query = [
          {$match :
            {$and:[
                {status:true},
                {updated_at:{"$gte":new Date(new Date().setDate(new Date().getDate()-1))}},
                {cordinate: { $exists: true } } 
              ]
            }
          },
          {$project:{
              name:1,
              profilePicture:1,
              cordinate:{
                lat:1,
                lng: { $arrayElemAt: [ "$cordinate.lon", 0 ] },
              }
            }
          },
          { $unwind: "$cordinate" }
         
     ];   
     User.aggregate(query,(err,users)=>{
      if(err) res.json(this.response({ err: err, message: error.oops() }));
      else{
        if(users.length>0){
          res.json(this.response({ data: users, message: "User is deleted successfully." }));
        }else{
          res.json(this.response({ data: users, message: "User is deleted successfully." }));
        }
      }
     });        
  }
}

module.exports = UserController;


