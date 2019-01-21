'use strict';
const path = require('path'),
      Chat         = require(path.resolve('./app/models/Chat')),
      Conversation = require(path.resolve('./app/models/Conversation')),
      Notification = require(path.resolve("./app/models/Notification")),
      config = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
      ObjectId= require("mongoose").Types.ObjectId;


/**
 * [function used to send email]
 * @param  {[type]}   userId  [userId to get records]
 */

exports.badge =(userId) => {
    return new Promise((resolve,reject)=>{
        let query = {receiver: userId,read: { $nin: [ userId ] } };
        Chat.count(query,(err,count)=>{
            console.log('count--########### ',count)
            query = { to: ObjectId(userId),seen : false };
            Notification.count(query,(err,count2)=>{
                console.log('count2--########### ',count2)
                resolve(count+count2);
            });
        })
    }) 
};

/*module.exports = {
    badge : (userId)=>{
       return userId ; 
    } 
};*/