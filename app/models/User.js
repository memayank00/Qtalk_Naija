const mongoose            =   require('mongoose'),
      path                =   require('path'),
      config              =   require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
      crypto              =   require('crypto'),
      _                   =   require('lodash'),
      ObjectId            =   mongoose.Types.ObjectId,
      uniqueValidator     =   require('mongoose-unique-validator'),
      schema              =   mongoose.Schema;

var userSchema = new schema({
    auth: String,
    firstname: String,
    lastname: String,
    name: String,
    username: String,
    userType: String,
    email: {
        type : String,
        lowercase: true,
        trim : true,
        required: "Email address is required.", 
        unique: "This email address is already exists."
    },
    password: String,
    mobile: String,
    /*mobile: {
        type : String,
        trim : true,
        required: "Mobile number is required.", 
        unique: "This mobile number is already exists."
    },*/
    fullno: String,
    ccode: String,
    otp:String,
    status : {
        type : Boolean,
        default : true
    },
    isEmailActive : {
        type : Boolean,
        default : false
    },
    alertSent:[{
        user_id : schema.Types.ObjectId,
        status : Boolean
    }],
    /* alertSent:{
        type:Boolean,
        default:false
    }, */
    userNotes: {
        type: Array
    },
    resetPwd:{
        type:Object
    },
    profilePicture:String,
    location: String,
    cordinate: Array,
    speed: String, 
    speedTime: Number, 
    beingTrack: {
        type: String,
        default:"false"
    },
    //useerRoom: Array
    userRoom:[{
        room_id : schema.Types.ObjectId,
        name : String,
        status : Boolean  
    }],
    friends: [{
        user_id : schema.Types.ObjectId,
        name : String,
        location : String,
        profilePicture: String
    }],
    trackies: [{
        user_id : schema.Types.ObjectId,
        name : String,
        location : String,
        profilePicture: String
    }],
    mapAvailability : {
        type : Boolean,
        default : true
    },
    mobileDevice: [{
        deviceType : String,
        deviceToken : String
    }],
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'         
    }
});

/**
 * Pre-Save Hook
 * Used to generate Private Key & Passwords
 * when new user created
 */
userSchema.pre('save', function(next) {
    this.name     = [this.firstname, this.lastname].join(' ');
    this.fullno   = (this.mobile)?[this.ccode, this.mobile].join(''):undefined;
    this.auth     = crypto.randomBytes(16).toString('hex');
    this.password = this.encryptPassword(this.password, this.auth);
    this.otp = (Math.floor(Math.random()*900000) + 100000).toString();
    next();
});

/**
 * encryptPassword - encrypt password 
 * by using crypto and mongoose methods
 * @param  {String} password [user password]
 * @param  {String} secret   [private key to encrypt data]
 * @return {[type]}          [encrypted password using user's Private key]
 */
userSchema.methods.encryptPassword = function(password, secret) {
    return crypto.createHmac('sha512', secret).update(password).digest('base64');
};


/* match password by using crypto and mongoose methods*/
userSchema.methods.matchPassword = function(password) {
    return this.password === this.encryptPassword(password);
};

/* encrypt password by using crypto and mongoose methods*/
userSchema.statics.getPassword = function(password, secret) {
    return crypto.createHmac('sha512', secret).update(password).digest('base64');
};

/* to update user device and token for push notification*/
userSchema.statics._device = function(_id, device){
    this.findOneAndUpdate({
        _id : _id
    },{
        $addToSet : {
            "device" : {
                type : device.type,
                token : device.token
            }
        }
    },(err, result) => {
        /*add device type and token*/
    });
}

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);