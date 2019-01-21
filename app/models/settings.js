const mongoose = require('mongoose'),
    path = require('path'),
    schema = mongoose.Schema;


var settingsSchema = new schema({
    meta_key: {
        type:String,
        unique:true
    },
    meta_value: schema.Types.Mixed,
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });


settingsSchema.statics.registerIP = function(ip){
    this.update({
        meta_key: "IPManage"
    },{
        $addToSet : {
            "meta_value.whiteList" : {
                value : ip, label:ip
            }
        }
    },{upsert:true}, (err, result) => {
        /*IP ADDED*/
    })
}

module.exports = mongoose.model('settings', settingsSchema); 