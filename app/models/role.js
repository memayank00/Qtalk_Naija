'use strict';

const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    schema = mongoose.Schema,
    slug = require('mongoose-slug-generator'),
    uniqueValidator = require('mongoose-unique-validator');


/*Use Plugin*/
mongoose.plugin(slug);

var roleSchema = new schema({
    title: {
        type:String,
        unique:"This Role Already Exists",
        required:true
    },
    permissions: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: true
    },
    preBuilt: {
        type: Boolean,
        default: false
    },
    type :{
        type:String
    },
    slug: { type: String, slug: ["title"], slug_padding_size: 1, unique: true }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

roleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('role', roleSchema);