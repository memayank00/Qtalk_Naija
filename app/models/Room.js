'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    config          = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    DATE            = require(path.resolve('./app/config/libs/date')),
    Schema          = mongoose.Schema,

chatRoomSchema  = new Schema({
    name    : String,
    status : {type:Boolean,default:false}, 
},{
    
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
     minimize: false 
});

module.exports = mongoose.model('chatRoom', chatRoomSchema);