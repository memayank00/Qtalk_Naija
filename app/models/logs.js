'use strict';

const 
    mongoose    = require('mongoose'),
    path        = require('path'),
    Schema      = mongoose.Schema,

LogSchema = new Schema({
    userId: {
    type:mongoose.Schema.Types.ObjectId,
    default:null
},
    url:String,
    timezone:String,
    username: {
        type: String
    },
    password: {
        type: String
    },
    browser: Object,
    os: Object,
    ip: {
        type: String
    },
    status : {
        type : Boolean,
        default : false
    },
    type: {
        type: String,
        default: "login"
    },
    comment: String
},{timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}});

module.exports = mongoose.model('log', LogSchema);