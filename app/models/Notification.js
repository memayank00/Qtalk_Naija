'use strict';

const mongoose          =   require('mongoose'),
    path                =   require('path'),
    config              =   require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    schema              =   mongoose.Schema;

    var notificationSchema = new schema({
        title: String,
        content: String,
        seen : {type:Boolean, default:false}, // true= seen ,false= not seen
        status : {type:Boolean, default:true}, // this is for further use,
        to: schema.Types.ObjectId,
        from: schema.Types.ObjectId,  //this will contain id only for `Friend` & `Track` Type
        types: { 
                type:String,
                enum: [`Friend`, `Track`, `Normal`]
               },
        link: {type:String, default:''},
        imageUrl: {type:String, default:''},
        meta : schema.Types.Mixed    // this will contain meta data for `Friend` & `Track` Type 
    },{
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'         
        }
    });

    module.exports = mongoose.model('notification', notificationSchema);
