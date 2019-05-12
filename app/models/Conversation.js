'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    config          = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    //Mysql2          = require(path.resolve(`./app/config/libs/mysql2`)),
    Schema          = mongoose.Schema,
    ObjectId        = mongoose.Types.ObjectId,

    conversationSchema  = new Schema({
        chatUsers : Array, // list of all users who are/were the part of this chat
        currentUsers : Array, // array of users who are avilable in chat - can be more than 2
        status : {
            type : String,
            default : "Connected"
        },
        muteObj :{
            mute_by:Number,
            mute_to :Number,
            expTime : Number
        },
        block_id: String,
        blocker_user_id: String,
        chat_status :{ 
                type:String,
                enum: ['Stop', 'Start'],    // this variable is used to identify chat is start or not
                default: 'Stop'
            }    
    },{
        timestamps : {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    // conversationSchema.statics.assignConversationId = function(connectionId, conversationId){
    //     /*create chat room for new users*/
    //     mysql.query("UPDATE `user_friends` set `conversation_id` = ? WHERE id = ?", [conversationId, connectionId], (err, result) => {
    //         console.log(err);
    //         console.log(result);
    //     });
    // }

    // conversationSchema.statics.updateRoom = function(room){
    //     /*create chat room for new users*/
    //     this.findOneAndUpdate({
    //         _id : mongoose.Types.ObjectId(room.conversationId)
    //     }, room.info, {
    //         new : true
    //     }, (err, updated) => {
    //         if(updated.nmodified){
    //             /*Room has been updated*/
    //         }
    //     });
    // }

module.exports = mongoose.model('conversation', conversationSchema);