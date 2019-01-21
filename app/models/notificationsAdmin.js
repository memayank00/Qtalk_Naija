'use strict';

const 
    mongoose    = require('mongoose'),
    path        = require('path'),
    Schema      = mongoose.Schema,

NotificationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String
    },
    type: {
        type: Number,
        default : 0
    },
    content: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    metadata : Object
},{timestamps: true });

module.exports = mongoose.model('notification_Admin', NotificationSchema);