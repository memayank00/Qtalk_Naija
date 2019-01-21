'use strict';

const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    schema              =   mongoose.Schema;

    var requestsSchema = new schema({
        email: String,
        ip: String,
        os: String,
        browser: String,
        otp: String,
        verified:{type:Boolean, default:false}
    },{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'         
        }
    });

    requestsSchema.statics.nullotp = function(email){
        this.update({
            email : email
        },{
            $unset : {
                otp : 1
            }
        }, (err, result) => {
            /*IP ADDED*/
        })
    }

module.exports = mongoose.model('requestsAdmin', requestsSchema);