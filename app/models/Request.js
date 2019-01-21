'use strict';

const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    schema              =   mongoose.Schema;

    var requestSchema = new schema({
        to_userId: schema.Types.ObjectId,
        from_userId: schema.Types.ObjectId,
        type:{ 
                type:String,
                enum: ['Friend', 'Track']
            },
        status : { 
                type:String,
                enum: ['Pending', 'Accepted' ,"Rejected", "Deleted"]
            }
    },{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'         
        }
    });

    module.exports = mongoose.model('request', requestSchema);