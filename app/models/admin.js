const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    date   = require(path.resolve(`./app/config/libs/date`)),
    crypto = require('crypto'),
    Notification = require(path.resolve('./app/controllers/backend/NotificationController')),
    uniqueValidator = require('mongoose-unique-validator'),
    schema = mongoose.Schema;


var adminSchema = new schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: "Username is required.",
        unique: "This username is already exists."
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: "Email address is required.",
        unique: "This email address is already exists."
    },
    image: Object,
    password: String,
    mobile: {
        type: String,
        trim: true,
        // required: "Email address is required.",
        unique: "This Mobile no.already exists."
    },
    role: {
        type: Object,
        default: {title:"Admin"}
    },
    status: {
        type: Boolean,
        default: true
    },
    otp: String,
    resetKey: String,
    otpValidity: Number,
    lastLogin: Number,
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });


adminSchema.pre('save', function (next) {
    // this.auth = crypto.randomBytes(16).toString('hex');
    this.password = this.encryptPassword(this.password);
    next();
});

/* encrypt password by using crypto and mongoose methods*/
adminSchema.methods.encryptPassword = function (password) {
    // console.log(crypto.createHmac('sha512', config.secret).update(password).digest('base64'));
    return crypto.createHmac('sha512', config.secret).update(password).digest('base64');
};


/* match password by using crypto and mongoose methods*/
adminSchema.methods.matchPassword = function (password) {
    // console.log("sent",this.encryptPassword(password));
    // console.log("saved ",this.password)
    return this.password === this.encryptPassword(password);
};

/* encrypt password by using crypto and mongoose methods*/
adminSchema.statics.hashPassword = function (password) {
    // console.log(crypto.createHmac('sha512', config.secret).update(password).digest('base64'));
    return crypto.createHmac('sha512', config.secret).update(password).digest('base64');
};

/**
 * this fn will save current login time of user & return last login time
 * @return {[obj]} last login time
 */
adminSchema.statics.promptLoginTime = function(_id){
    /**/
    this.findOneAndUpdate({
        _id : _id,
    },{
        $set : {
            lastLogin : date.timestamp()
        }
    },{
        new : false
    }, (err, result) => {
        /*save user last login time*/
        if(result){
            /*if user login time saved then release a notification*/
            /*send notificaiton of login time*/
            if (result.lastLogin) Notification.saveOne({ title: Notification.getNotification("LAST_LOGIN", { time: date.formatDate(result.lastLogin, "DD MMM YYYY hh:mm:ss A") }).title, read: false, type: Notification.getNotification("LAST_LOGIN").type, userId: _id, metadata: { color: "info", icon: "bell-o" }});
        }
    })
}


adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('admin', adminSchema);7