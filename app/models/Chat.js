'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    config          = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    DATE            = require(path.resolve('./app/config/libs/date')),
    Schema          = mongoose.Schema,

chatSchema  = new Schema({
    conversationId : mongoose.Schema.Types.ObjectId,
    body    : String,
    sender  : String,
    receiver: String,
    attachment : {
       type: Schema.Types.Mixed, default: {}
    },
    read    : Array,
    deliver : Array,
    members : Array,
    deleteBy: Array,
    mimeType : {
        type:String,
        default:'html/plain'
    },
    duration : String,
    trash : {type:Boolean,default:false},
    isEdited : {type:Boolean,default:false},
    timestamp : {type:Number, default:DATE.timestamp()},
    thumbnail : Buffer
},{
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
     minimize: false 
});

module.exports = mongoose.model('chat', chatSchema);