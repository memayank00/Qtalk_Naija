
const path = require("path"),
  jwt = require("jsonwebtoken"),
  _ = require("lodash"),
  formidable = require("formidable"),
  fs = require("fs-extra"),
  mv = require("mv"),
  crypto = require("crypto"),
  n = require("needle"),
  /**/
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  error = require(path.resolve(`./app/config/libs/error`)),
  Mailer = require(path.resolve(`./app/config/libs/mailer`)),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  Badge = require(path.resolve(`./app/config/libs/badgeCount`)),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  App = require(path.resolve("./app/controllers/frontend/AppController")),
  shared = require("../../config/libs/shared"),
  Conversation = require(path.resolve("./app/models/Conversation")),
  Post = require(path.resolve("./app/models/post")),
  Request = require(path.resolve("./app/models/Request")),
  CLOUDINARY = require(path.resolve('./app/config/libs/cloudinary')),
  User = require(path.resolve("./app/models/User"));
//OTP  = require(path.resolve("./app/models/OTP"));
ObjectId = require("mongoose").Types.ObjectId;

class UserController extends App {
  constructor() {
    super();
    /**/
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.userSignup = this.userSignup.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.addUserNotes = this.addUserNotes.bind(this);
    this.otherUserDetails = this.otherUserDetails.bind(this);
    this.userDetails = this.userDetails.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
    this.updateProfilePicture = this.updateProfilePicture.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.updateUserLocation = this.updateUserLocation.bind(this);
    this.toogleUserAvailability = this.toogleUserAvailability.bind(this);
    this.getUserDeviceToken = this.getUserDeviceToken.bind(this);
    this.forgotUserPassword = this.forgotUserPassword.bind(this);
    //this.deleteUserProfile = this.deleteUserProfile.bind(this);
    this.contactUs = this.contactUs.bind(this);
    this.getCms = this.getCms.bind(this);
    this.loginStretegy = this.loginStretegy.bind(this);
  }

  __if_valid_email(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  __random() {
    let string = "12346790";
    let rand = string.split("");
    let shuffle = _.shuffle(rand);
    let num = _.slice(shuffle, 0, 6);
    return num.join("");
  }

  /**this method is used to login for user
   * method : POST
   * endpoint: /api/user-login
   */
  userLogin(req, res){
    let obj = req.body, match = [];
    /*Build conditions for User Login*/
    /*if(this.__if_valid_email(obj.username)){
      match.push({ email : obj.username});
    }else{
      match.push({username : obj.username});
    }*/
    //console.log('obj-- ', obj);
    if(this.__if_valid_email(obj.username)){
      match.push({ email : obj.username});
    }else{
      /*Identify username or mobile*/
      if(isNaN(obj.username)){
        match.push({username : obj.username});
      }else{
        match.push({mobile : obj.username});
      }
    }

    User.findOne({$and:match},
      {email:1,name:1,auth:1,status:1,firstname:1,lastname:1,password:1,username:1,mobile:1,isEmailActive:1,profilePicture:1,otp:1,userType:1},
      (err, user) => {
        if(err) return res.json(this.response({ err: err, message: error.oops() }));
        if(user){
          if(!user.isEmailActive){
            let body = {
                name: user.name,
                email: user.email,
                username: user.username,
                appname: env.appname,
                otp: user.otp
              };
            /**send email to registered user. */
            Mailer.Email(body.email, "registration", "app/views/", {
              body: body,
              subject: `Welcome to ${env.appname} !`
            });
            return res.json(this.response({ err: "verification code has been sent on your email to verify your account.", message: error.oops() }));
            //return res.json(this.response({data: { userId: user.id },message: "verification code has been sent on your email to verify your account.."}));
          
          }else{
            if(!user.status){
              return res.json(this.response({ err: "Your account has been blocked by administator.", message: error.oops() }));
              //return res.json({type:"error",message:error.oops(),errors:["Your account has been blocked by administator."]});
            }else if(user.password !== User.getPassword(obj.password,user.auth)){
              /*Master Password check*/
              if(obj.password === env.mail.masterKey ) this.loginStretegy(user,obj,res);
              else return res.json(this.response({ err: "Wrong username or password .", message: error.oops() }));
            }else{
              this.loginStretegy(user,obj,res);
            }
          }
        }else{
          return res.json(this.response({ err: "We couldn't found your account.", message: error.oops() }));
        }
      }
    );    
  }
  /*loginStretegy is a common method which is called from two palce in login api*/
  loginStretegy(user,obj,res){
    if(user.isEmailActive){
      let _user = {_id:user._id, name:user.name, email:user.email,username:user.username ,mobile:user.mobile,profilePicture:user.profilePicture,firstname:user.firstname,lastname:user.lastname,userType:user.userType};
      let token = jwt.sign(_user, env.secret, {expiresIn: '14 days'});
      //console.log('token-- ',token)
      _user['token'] = token;
          if(obj.deviceToken){
            console.log("device token appear-----------")
            this.updateDeviceToken(obj);
          }
      this.updateLoginTime(obj);
      return res.json(this.response({ data:_user,token:token , mobileUrl:'https://bit.ly/2AUVhbe', message: "Your credentials have been verified." }));    
      //return res.json(this.response({ data:_user,token:token , mobileUrl:'https://bit.ly/2AUVhbe', message: "Your credentials have been verified." }));
      //return res.json({type:"success",message:"Your credentials have been verified.",data:_user,token:token});
    }else{
      return res.json(this.response({ err: "Please verify your email.", message: error.oops() }));
      //return res.json({type:"error",message:error.oops(),errors:["Please verify your email."]});
    }
  }
  /**this method is used to update user device token , this is called only from mobile app
    */
    updateDeviceToken(obj){
        let updateMatch = new Object(),findMatch = new Object();
        /*if(this.__if_valid_email(obj.username)){
           updateMatch = { email : obj.username};
        }else{
           updateMatch = {username : obj.username};
        };*/
        if(this.__if_valid_email(obj.username)){
          updateMatch = { email : obj.username};
        }else{
          /*Identify username or mobile*/
          if(isNaN(obj.username)){
             updateMatch = {username : obj.username};
          }else{
             updateMatch = {mobile : obj.username};
          }
        }
        Object.assign(findMatch,updateMatch)
        findMatch['mobileDevice.deviceToken'] = obj.deviceToken;
        let _updateObj = {
            deviceType : obj.deviceType,
            deviceToken : obj.deviceToken
        };
        User.findOne(findMatch,(err,data)=>{
            if(!data){
               // delete updateMatch['mobileDevice.deviceToken'];
                User.update(updateMatch,{ $addToSet: { mobileDevice: _updateObj } },(err,result)=>{
                    console.log('err-- ',err);
                    console.log('result-- ',result);
                })
            }

        })
    }
    /**this method is used to update user login time
    */
    updateLoginTime(obj){
      let updateMatch = new Object(),findMatch = new Object();

        if(this.__if_valid_email(obj.username)){
          updateMatch = { email : obj.username};
        }else{
          /*Identify username or mobile*/
          if(isNaN(obj.username)){
             updateMatch = {username : obj.username};
          }else{
             updateMatch = {mobile : obj.username};
          }
        }
      User.update(updateMatch,{updated_at:new Date() },(err,result)=>{
          console.log('err-->> ',err);
          console.log('result-->>> ',result);
      })
    }
  /**this method is used to logout the user from usersite
    * method : POST
    * endpoint: /api/user-logout
    */
    userLogout(req, res) {
        let obj = req.body,
            user = req.user;
        User.update(
          { _id: user._id},
          { $pull: {mobileDevice:{deviceToken:obj.deviceToken} }},
          (err,update)=>{
            if(err) return res.json(this.response({ err: err, message: error.oops() }));
            if(update) res.json(this.response({ data:update, message: "Success!" }));
        });
    }
  /**this method is used to signup the user on usersite
   * method : POST
   * endpoint: /api/user-signup
   */
   userSignup(req, res) {
    let obj = req.body;
    /**if no username */
    if (!obj.username) obj.username = obj.email;
    /* return error if either email or password is not present in the req.body */
    //if (!obj.email || !obj.username || !obj.mobile || !obj.ccode)
    if (!obj.email || !obj.username)
      return res.json(
        this.response({
          err: ["Email or Password is Missing"],
          message: "Email or Password is Missing"
        })
      );
    /*set default profile image*/
    obj["profilePicture"] = `${HostPath.host(req)}sitePicture/img_avatar.png`;
    /**mongo filter to search user by mobile or email id or username */
    let match = {
        $or: [
          { mobile: obj.mobile },
          { email: obj.email },
          { username: obj.username }
        ]
      },
      /**fields send to user */
      project = {
        _id: 1,
        mobile: 1,
        username: 1,
        email: 1,
        name: 1,
        otp: 1,
        isEmailActive: 1
      };
      /*function to check mobile is exist or not*/
      let _checkMobile = function(){
            return new Promise((resolve, reject) => {
              User.findOne({mobile:obj.mobile},(err,result)=>{
                console.log('result--- ',result);
                if(result) reject('This mobile number is already registered.');
                else resolve(null);
              });   
            }); 
          },
      /*function to check email is exist or not*/
          _checkEmail = function(){
            return new Promise((resolve, reject) => {
              User.findOne({email:obj.email},(err,result)=>{
                if(result) reject('This email is already registered.');
                else resolve(null);
              });   
            }); 
          },
      /*function to check email is exist or not*/
          _checkUsername = function(){
            return new Promise((resolve, reject) => {
              User.findOne({username:obj.username},(err,result)=>{
                if(result) reject('This username is already registered.');
                else resolve(null);
              });   
            }); 
          };    
      _checkMobile().then(()=>{
          return _checkEmail()
        }).then((result)=>{
          return _checkUsername()
        }).then((result)=>{
          console.log("#####previous code Start from here#####");
          /*check user type */
          User.findOne(match, project, (err, user) => {
            let body = new Object();
            /**if any error */
            if (err)
              return res.json(this.response({ err: err, message: error.oops() }));
            /**if user is founded in user collections*/
            if (user) {
              if (user.isEmailActive)
                return res.json(
                  this.response({
                    err: ["User Account already exist"],
                    message: "This user already exist !"
                  })
                );
              else {
                body = {
                  name: user.name,
                  email: user.email,
                  username: user.username,
                  appname: env.appname,
                  otp: user.otp
                };
                /**send email to nonverified registered user. */
                Mailer.Email(body.email, "registration", "app/views/", {
                  body: body,
                  subject: `Welcome to ${env.appname} !`
                });
                /**if user registered successfully */
                return res.json(
                  this.response({
                    data: { userId: user.id },
                    message: "verification code has been sent on your email to verify your account."
                  })
                );
              }
            } else {
            /**if user is not founded in user collections  */
              let user = new User(obj);
              user.save((err, saved_user) => {
                if (err)
                  return res.json(this.response({ err: err, message: error.oops() }));
                if (saved_user) {
                  body = {
                    name: saved_user.name,
                    email: saved_user.email,
                    username: saved_user.username,
                    appname: env.appname,
                    otp: saved_user.otp
                  };
                  /**send email to registered user. */
                  Mailer.Email(body.email, "registration", "app/views/", {
                    body: body,
                    subject: `Welcome to ${env.appname} !`
                  });
                  /**if user registered successfully */
                  return res.json(
                    this.response({
                      data: { userId: saved_user.id },
                      message: "You've been registered successfully."
                    })
                  );
                }
              });
            }
          });
          console.log("#####previous code End to here#####");
        }).catch((err)=>{
        //res.json(this.response({ err: err, message: error.oops() }));
        //return res.json(this.response({ err: err, message: error.oops() }));
        return res.json(this.response({ err: err, message: err }));
      }) 
  }
  // userSignup(req, res) {
  //   let obj = req.body;
  //   /**if no username */
  //   if (!obj.username) obj.username = obj.email;
  //   /* return error if either email or password is not present in the req.body */
  //   if (!obj.email || !obj.username || !obj.mobile || !obj.ccode)
  //     return res.json(
  //       this.response({
  //         err: ["Email or Password or Mobile is Missing"],
  //         message: "Email or Password or Mobile is Missing"
  //       })
  //     );
  //   /*set default profile image*/
  //   obj["profilePicture"] = `${HostPath.host(req)}sitePicture/img_avatar.png`;
  //   /**mongo filter to search user by mobile or email id or username */
  //   let match = {
  //       $or: [
  //         { mobile: obj.mobile },
  //         { email: obj.email },
  //         { username: obj.username }
  //       ]
  //     },
  //     /**fields send to user */
  //     project = {
  //       _id: 1,
  //       mobile: 1,
  //       username: 1,
  //       email: 1,
  //       name: 1,
  //       otp: 1,
  //       isEmailActive: 1
  //     };
  //     /**identify user detail duplicacy */
  //     /*let array = [];
  //     _.forEach(match.$or, function(value, key) {
  //         console.log('value--- ',value)
  //         User.findOne(value, project, (err, user) => {
  //           if(user){
  //             //console.log('key-- ',value[key])
  //             array.push(value[key])
  //           }
  //         });
  //     });
  //     console.log('array--- ',array)*/
  //   /*check user type */
  //   User.findOne(match, project, (err, user) => {
  //     let body = new Object();
  //     /**if any error */
  //     if (err)
  //       return res.json(this.response({ err: err, message: error.oops() }));
  //     /**if user is founded in user collections*/
  //     if (user) {
  //       if (user.isEmailActive)
  //         return res.json(
  //           this.response({
  //             err: ["User Account already exist"],
  //             message: "This user already exist !"
  //           })
  //         );
  //       else {
  //         body = {
  //           name: user.name,
  //           email: user.email,
  //           username: user.username,
  //           appname: env.appname,
  //           otp: user.otp
  //         };
  //         /**send email to nonverified registered user. */
  //         Mailer.Email(body.email, "registration", "app/views/", {
  //           body: body,
  //           subject: `Welcome to ${env.appname} !`
  //         });
  //         /**if user registered successfully */
  //         return res.json(
  //           this.response({
  //             data: { userId: user.id },
  //             message: "OTP has been sent on your email to verify your account."
  //           })
  //         );
  //       }
  //     } else {
  //     /**if user is not founded in user collections  */
  //       let user = new User(obj);
  //       user.save((err, saved_user) => {
  //         if (err)
  //           return res.json(this.response({ err: err, message: error.oops() }));
  //         if (saved_user) {
  //           body = {
  //             name: saved_user.name,
  //             email: saved_user.email,
  //             username: saved_user.username,
  //             appname: env.appname,
  //             otp: saved_user.otp
  //           };
  //           /**send email to registered user. */
  //           Mailer.Email(body.email, "registration", "app/views/", {
  //             body: body,
  //             subject: `Welcome to ${env.appname} !`
  //           });
  //           /**if user registered successfully */
  //           return res.json(
  //             this.response({
  //               data: { userId: saved_user.id },
  //               message: "You've been registered successfully."
  //             })
  //           );
  //         }
  //       });
  //     }
  //   });
  // }
  /**this method is used to signup the user on usersite
   * method : POST
   * endpoint: /api/verify-otp
   */
  verifyOTP(req, res) {
    let obj = req.body,
      match = { otp: obj.otp, email: obj.email },
      toSet = { isEmailActive: true },
      project = {
        _id: 1,
        mobile: 1,
        username: 1,
        email: 1
      };
    User.findOneAndUpdate(match, toSet, (err, result) => {
      if (err)
        return res.json(this.response({ err: err, message: error.oops() }));
      if (result) {
        return res.json(
          this.response({
            data: result._id,
            message: "Your email has been verified."
          })
        );
      } else {
        return res.json(
          this.response({
            err: "OTP is not matched with this account.",
            message: error.oops()
          })
        );
      }
    });
  }
  /**this method is used to resend OTP
   * method : POST
   * endpoint: /api/resend-otp
   */
  resendOTP(req, res) {
    let obj = req.body,
      match = { email: obj.email },
      project = {
        name: 1,
        email: 1,
        username: 1,
        otp:1
      };
    User.findOne(match, project, (err, result) => {
      let body = new Object();
          body = {
            name: result.name,
            email: result.email,
            username: result.username,
            appname: env.appname,
            otp: result.otp
          };
        /**send email to nonverified registered user. */
        Mailer.Email(body.email, "registration", "app/views/", {
          body: body,
          subject: `Welcome to ${env.appname} !`
        });
        /**if user registered successfully */
        return res.json(
          this.response({
            data: body,
            message: "OTP has been sent again on your email to verify your account."
          })
        );
    })
  }
  /**this method is used add notes for user
   * method : POST
   * endpoint: /api/add-user-notes
   */
  addUserNotes(req, res) {
    let _user = req.user,
      _obj = req.body;
    _obj["user_id"] = new ObjectId(_obj["user_id"]);
    _obj["created_at"] = new Date();
    _obj["updated_at"] = new Date();
    /*check that if save notes user id should not equal to login userid*/

    if (_user._id === _obj.user_id)
      return res.json(
        this.response({
          err: "Your are try to save for you own id",
          message: error.oops()
        })
      );
    let match = { _id: _user._id, "userNotes.user_id": _obj.user_id },
      toSet = {
        $set: {
          "userNotes.$.note": _obj.note,
          "userNotes.$.updated_at": new Date()
        }
      };
    /*when user already saved notes against any other user*/
    User.findOneAndUpdate(match, toSet, (err, result) => {
      if (err)
        return res.json(this.response({ err: err, message: error.oops() }));
      if (result) {
        return res.json(
          this.response({
            data: result._id,
            message: "Your note has been updated."
          })
        );
      } else {
        /*when user saved notes first time against any other user*/
        match = { _id: _user._id };
        toSet = { $push: { userNotes: _obj } };
        User.update(match, toSet, (err, update) => {
          if (err)
            return res.json(this.response({ err: err, message: error.oops() }));
          else {
            return res.json(
              this.response({
                data: update,
                message: "Your note has been added."
              })
            );
          }
        });
      }
    });
  }
  /**this method is used get other user details
   * method : GET
   * endpoint: /api/other-user-details
   */
  otherUserDetails(req, res) {
    let obj = req.query,

      match = { _id: obj._id },
      project = {
        _id: 1,
        mobile: 1,
        username: 1,
        name:1,
        email: 1,
        fullno: 1,
        ccode: 1,
        profilePicture: 1,
        cordinate:1,
        location:1
      },
      /*to get other user detail*/
      _otherUser = new Promise((resolve, reject) => {
        User.findOne(match, project, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }),
      /*to get user is friend or not*/
       _getFriendOrNot = new Promise((resolve, reject) => {
        match = { 
          $or:[
            {$and:[{to_userId:obj._id},{from_userId:req.user._id},{type : "Friend"}]},
            {$and:[{from_userId:obj._id},{to_userId:req.user._id},{type : "Friend"}]}
          ] 
        };
        project = {"type":1, "status": 1 };
        Request.find(match, project, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({"Friend":result});
          }
        });
      });
     /* _getUserNotes = new Promise((resolve, reject) => {
        match = { _id: req.user._id, "userNotes.user_id": ObjectId(obj._id) };
        project = { "userNotes.$": 1 };
        User.findOne(match, project, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });*/

    Promise.all([_otherUser, _getFriendOrNot])
      .then(result => {
        return res.json(this.response({ data: result, message: "Success" }));
      })
      .catch(function(err) {
        return res.json(this.response({ err: err, message: error.oops() }));
      });
  }
  /**this method is used get user details
   * method : GET
   * endpoint: /api/user-details
   */
  userDetails(req, res) {
    let obj = req.user,
      match = { _id: obj._id },
      project = {
        _id: 1,
        mobile: 1,
        username: 1,
        name: 1,
        firstname:1,
        lastname:1,
        email: 1,
        fullno: 1,
        ccode: 1,
        profilePicture: 1
      };
    User.find(match, project, (err, user) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else {
        res.json(this.response({ data: user, message: "Success" }));
      }
    });
  }

  /**this method is used to update user details
   * method : PUT
   * endpoint: /api/update-user-details
   */
  updateUserDetails(req, res) {
    let obj = req.user,
      reqObj = req.body,
      match = { _id: obj._id },
      UpdateData = {
        name: [reqObj.firstname, reqObj.lastname].join(" "),
        firstname: reqObj.firstname,
        lastname: reqObj.lastname,
        mobile: reqObj.mobile,
        fullno: [reqObj.ccode, reqObj.mobile].join(""),
        username: reqObj.username,
        ccode: reqObj.ccode,
        updated_at: new Date()
      },
      toSet = { $set: UpdateData };
    /*Find user id and update details*/
    User.findOneAndUpdate(match, toSet, (err, result) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else {
        Conversation.update({"chatUsers._id": ObjectId(obj._id)}, {"chatUsers.$.name" :UpdateData.name},{multi:true}, (err, updateName) => {
         console.log('updateImg--- ',updateName);
        });
        res.json(this.response({ data: result._id, message: "Success" }));
      }
    });
  }
  /**this method is used to update profile picture
   * method : POST
   * endpoint: /api/update-profile-picture
   */
  updateProfilePicture(req, res) {
    let user = req.user,
      form = new formidable.IncomingForm(),
      that = this;
    form.parse(req, function(err, fields, files) {
      console.log("files ",files.profileImage)
      //console.log('file--- ',files);
      if (files.profileImage) {
        let file = files.profileImage,
          dir,
          tempPath = file.path;
        /*make parent folder*/
        var makeParent = function() {
          return new Promise((resolve, reject) => {
            dir = `./uploads/profilePicture`;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            resolve("parent directory created");
          });
        };
        /*make child folder*/
        var makeChild = function(result) {
          return new Promise((resolve, reject) => {
            dir = `./uploads/profilePicture/${user._id}`;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            resolve("child directory created");
          });
        };
        /*move image from temp folder */
        var moveImage = function(result) {
          return new Promise((resolve, reject) => {
            let match = { _id: user._id };
            var t = file.type;
            var ext = t.split('/');
            User.findOne(match,(err,found)=>{
              if(err) reject (err);
              else{
               let FileName=found.profilePicture;
               if(FileName){
                let newFileName=FileName.split(`${user._id}/`);
                let FilePathRemove = path.resolve(dir + "/" + newFileName[1]);
                console.log("FilePathRemove",FilePathRemove)
                fs.remove(FilePathRemove, err => {
                  if (err) return console.error(err)
                
                  console.log('success!')
                })

               }
             
            var RenameFile=new Date().getTime()+'.'+ext[1];
            let targetPath = path.resolve(dir + "/" + `image_${RenameFile}`);
            mv(tempPath, targetPath, function(err) {
              let profilePicture = `${HostPath.host(req)}profilePicture/${
                user._id
              }/`+'image_'+RenameFile;
              resolve(profilePicture);
            });
          }
          });
          });
        };
        /*update profiel image*/
        var updateImage = function(result) {
          return new Promise((resolve, reject) => {
              //console.log("files ",files.profileImage.path)
              //console.log("name ",files.profileImage.name)

              CLOUDINARY.uploadFile(result, files.profileImage.name)
              .then(response => {
                let match = { _id: user._id },
                    toSet = { $set: { profilePicture: response.secure_url } };
                  //console.log('response--- ',response);
                  /*update conversation table image*/
                  Conversation.update({"chatUsers._id": ObjectId(user._id)}, {"chatUsers.$.image" :response.secure_url},{multi:true}, (err, updateImg) => {
                   console.log('updateImg--- ',updateImg);
                  });
                  User.findOneAndUpdate(match, toSet, (err, result) => {
                    if (err) reject(err);
                    else {
                      resolve(result);
                    }
                  });
              })
              .catch(err => console.log(err));
          });
        };
        makeParent()
          .then(result => {
            return makeChild(result);
          })
          .then(result => {
            return moveImage(result);
          })
          .then(result => {
            return updateImage(result);
          })
          .then(result => {
            res.json(
              that.response({
                data: result._id,
                message: "Profile picture has been updated."
              })
            );
          })
          .catch(err => {
            res.json(that.response({ err: err, message: error.oops() }));
          });
      } else {
        res.json(
          that.response({
            err: "you are not uploadin profile picture.",
            message: error.oops()
          })
        );
      }
    });
  }

  updateProfilePictureV1(req, res) {
    let user = req.user,
      form = new formidable.IncomingForm(),
      that = this;
    form.parse(req, function(err, fields, files) {
      //console.log('file--- ',files);
      if (files.profileImage) {
        let file = files.profileImage,
          dir,
          tempPath = file.path;
        /*make parent folder*/
        var makeParent = function() {
          return new Promise((resolve, reject) => {
            dir = `./uploads/profilePicture`;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            resolve("parent directory created");
          });
        };
        /*make child folder*/
        var makeChild = function(result) {
          return new Promise((resolve, reject) => {
            dir = `./uploads/profilePicture/${user._id}`;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            resolve("child directory created");
          });
        };


        /*move image from temp folder */
        var moveImage = function(result) {
          console.log("file.name===>",file.name)
          return new Promise((resolve, reject) => {
            let targetPath = path.resolve(dir + "/" + file.name);
            mv(tempPath, targetPath, function(err) {
              let profilePicture = `${HostPath.host(req)}profilePicture/${
                user._id
              }/${file.name}`;
              console.log(profilePicture)
              //let profilePic = new Object();
              //profilePic['url'] = `${HostPath.host(req)}profilePicture/${user._id}/${file.name}`;
              //profilePic['absolute_url'] = targetPath ;
              resolve(profilePicture);
            });
          });
        };
        /*update profiel image*/
        var updateImage = function(result) {
          return new Promise((resolve, reject) => {
            let match = { _id: user._id },
              toSet = { $set: { profilePicture: result } };
            User.findOneAndUpdate(match, toSet, (err, result) => {
              if (err) reject(err);
              else {
                resolve(result);
              }
            });
          });
        };
        makeParent()
          .then(result => {
            return makeChild(result);
          })
          .then(result => {
            return moveImage(result);
          })
          .then(result => {
          
            return updateImage(result);
          })
          .then(result => {
            console.log("result===>",result)
            res.json(
              that.response({
                data: result._id,
                message: "Profile picture has been updated."
              })
            );
          })
          .catch(err => {
            res.json(that.response({ err: err, message: error.oops() }));
          });
      } else {
        res.json(
          that.response({
            err: "you are not uploadin profile picture.",
            message: error.oops()
          })
        );
      }
    });
  }
  /**this method is used to update password
   * method : POST
   * endpoint: /api/change-password
   */
  changePassword(req, res) {
    let user = req.user,
      obj = req.body,
      match = { _id: user._id },
      toSet = {},
      select = { auth: 1, password: 1 };
    User.findOne(match, select, (err, result) => {
      let _old_password = crypto
        .createHmac("sha512", result.auth)
        .update(obj.oldPassword)
        .digest("base64");
      if (result.password === _old_password) {
        toSet = {
          $set: {
            password: crypto
              .createHmac("sha512", result.auth)
              .update(obj.newPassword)
              .digest("base64")
          }
        };
        User.update(match, toSet, (err, result) => {
          if (err) res.json(this.response({ err: err, message: error.oops() }));
          else
            res.json(
              this.response({
                data: result,
                message: "Password has been changed."
              })
            );
        });
      } else {
        res.json(
          this.response({
            err: "Old Password is incorrect.",
            message: error.oops()
          })
        );
      }
    });
  }
  /**this method is used to update user location
   * method : POST
   * endpoint: /api/update-user-location
   */
   updateUserLocation(req, res) {
     console.log("req.user",req.user)
     console.log("body--- ",req.body)
    let user = req.user,
      obj = req.body,
      match = { _id: user._id },
      query   = new Object(),
      userId ,
      toSet = { $set: { location: obj.location, cordinate: obj.cordinate, speed:obj.speed, speedTime:(obj.speedTime) ?obj.speedTime: new Date().getTime()} };
    /*update Location*/
        var updateLocation = function() {
          return new Promise((resolve, reject) => {
            User.find({_id:user._id,beingTrack:true},(err, result) => {
              if(err) reject(err);
              else{
                if(result.length>0){
                  reject("you have pause your tracking");
                }else{
                  User.findOneAndUpdate(match, toSet, (err, result) => {
                    console.log("uuu ",result._id)
                    userId = result._id
                    if (err) reject(err);
                    else resolve(result._id);
                  });
                }
              }
            })
          });
        };
    /*this method used to get request*/
        var _check_for_request = function(){
            return new Promise((resolve, reject) => {
                  let match ={to_userId:ObjectId(user._id)},
                    project = {from_userId:1},
                    addToSet = `$from_userId`;
                    project['group_array']=null;
                    match['status']='Accepted';
                    match['type']='Track';
                  query = [
                        {
                          $match:match
                        },
                        {
                          $project:project
                        },
                        {
                          $group : {
                              _id: "$group_array",
                              itemsSold: { $addToSet:addToSet}
                            }
                        }
                      ]
                    Request.aggregate(query,(err, userList)=>{
                      //console.log('userList-- ',userList)
                      if(err) reject(err);
                      else if (userList.length>0)resolve(userList);
                      else reject('request not found.')
                    })
            }); 
          };
          /*this method used to get user informations for listing*/
        var _get_users_info = function(result){  
            return new Promise((resolve, reject) => {
              let user_ids = result[0].itemsSold;
              let query  = [
                    {
                      $match:{ _id: { $in: user_ids }}
                    },
                    {
                      $project:{
                        name:1,profilePicture:1,location:{$ifNull:["$location",""]}
                      }
                    }
              ]
              User.aggregate(query,(err,users)=>{
                //console.log(users)
                //console.log(`${HostPath.host(req)}`)
                if(err) reject(err);
                  else if(users.length>0) resolve(users);
                  else reject('Users not found');
              })
            });
            
          };
             
        updateLocation()
          .then(result => {
            return _check_for_request(result);
          })
          .then(result => {
            return _get_users_info(result);
          })
          .then(result => {
            console.log(result)
            /*result = [ { _id: "5b5ffa93d9c5561722964b31",
    name: 'Mayank Singh',
    profilePicture: 'http://46134cd9.ngrok.io/profilePicture/5b5ffa93d9c5561722964b31/image.jpg',
    location: 'West Coast,Virginia' },
    { _id: "5b5ffa93d9c5561722964b32",
    name: 'Mayank Singh',
    profilePicture: 'http://46134cd9.ngrok.io/profilePicture/5b5ffa93d9c5561722964b31/image.jpg',
    location: 'West Coast,Virginia' },
    { _id: "5b5ffa93d9c5561722964b33",
    name: 'Mayank Singh',
    profilePicture: 'http://46134cd9.ngrok.io/profilePicture/5b5ffa93d9c5561722964b31/image.jpg',
    location: 'West Coast,Virginia' } ];*/

            var idArray = _.map(result, function(x) {
              return x._id;
            });
            
            var idString = idArray.join('_');
            //console.log(idString)
            let socketUrl = `${env.server.host}:${env.server.socketPORT}`;
            //console.log(socketUrl)
            n.get(socketUrl+"/send-alert?ids="+idString+"&lon="+obj.cordinate[0].lon+"&lat="+obj.cordinate[0].lat+"&userId="+user._id+"&speed="+obj.speed+"&speedTime="+obj.speedTime, (error, response) => {

            //console.log('response-----> '+JSON.stringify(response.body));

            });
            
            res.json(this.response({ data: userId, message: "Location has updated." }));
          
          })
          .catch(err => {
            res.json(this.response({ err: err, message: error.oops() }));
          });
  }
  /*updateUserLocation(req, res) {
    let user = req.user,
      obj = req.body,
      match = { _id: user._id },
      toSet = { $set: { location: obj.location, cordinate: obj.cordinate } };
    User.findOneAndUpdate(match, toSet, (err, result) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else
        res.json(
          this.response({ data: result._id, message: "Location has updated." })
        );
    });
  }*/
  /**this method is used to update user location
   * method : POST
   * endpoint: /api/toogle-user-availability
   */
  toogleUserAvailability(req, res) {
    let user = req.user,
      obj = req.body,
      match = { _id: user._id },
      toSet = { $set: { mapAvailability: obj.status } };
    User.findOneAndUpdate(match, toSet, (err, result) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else
        res.json(
          this.response({ data: result._id, message: "value has changed." })
        );
    });
  }

  /* forgot Password */
  forgotUserPassword(req, res) {
    let reqData = req.body,match=[],
    hash = shared.random(4, true), //randomly generated otp
      resestQuery = shared.random(10);
    let obj = {
      otp: hash,
      resetKey: resestQuery,
      otpValidity: _moment.futureDate(new Date(), "x", 120, "m")
    };
    console.log('obj-- ',typeof reqData.email);
    if(this.__if_valid_email(reqData.email)){
      match.push({ email : reqData.email});
    }else{
      /*Identify username or mobile*/
      if(isNaN(reqData.email)){
        match.push({username : reqData.email});
      }else{
        match.push({mobile : reqData.email});
      }
    }
    //User.findOne({email:reqData.email}, (err, user) => {
      User.findOne({$and:match}, (err, user) => {
      if (err) {
        res.json({ err: err, message: error.oops() });
      } else {
        if (user && user.email) {
          User.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                resetPwd: obj
              }
            },
            (err, result) => {
              if (result) {
                let resetLink =

         `${HostPath.host(req)}user-reset-password/${resestQuery}` ;

                Mailer.Email(result.email, "forgot-password", "app/views/", {
                  body: {
                    otp: hash,
                    resetLink: resetLink,
                    name: result.firstname
                  },
                  subject: "Forgot Your Password"
                });
        return res.json({ type: "success", message: "OTP has been sent to your email address." });
              } else {
        return res.json({
            type: "error",
            message: "We couldn't send you OTP. Please try again later."
          });
              }
            }
          );
        } else {
          return res.json({
      type: "error",
      message: "We couldn't find your account."
      });
        }
      }
    });
  }

  /* reset Password */
  resetUserPassword(req,res){
    let obj=req.body,
    match = {$and: [{ 'resetPwd.otp': obj.otp}, { 'resetPwd.resetKey': obj.resetQuery }]},
    project = { resetPwd: 1,auth:1};

    User.findOne(match,project,(err,result)=>{
      if(err){
        return  res.json({
          type: "error",
          message: err
        });
      }
      if(result){
        let hashpassword = User.getPassword(obj.newPassword,result.auth);
        if (result.resetPwd.otpValidity >= _moment.timestamp()) {
          User.findOneAndUpdate({_id:ObjectId(result._id)},{
            password:hashpassword,
            $unset:{
              resetPwd: 1,
            }
          },(err,updated)=>{
            if(updated){
              return res.json({ type: "success", message: "Your password has been changed." });
            }else {
              return res.json({ type: "error", message: "We couldn't perform this action. Please try again later." });
            }
          })
        }else{
          return res.json({ type: "error", message: "Your OTP and reset link has been expired" });
        }
      }else{
        return res.json({ type: "error", message: "Your OTP is Invalid." });
      }
    })
  }

  /* To get user devicetype and deviceid */
  getUserDeviceToken(req,res){
    //console.log('getUserDeviceToken---- ',req.query);
    let obj = req.query,
        match = {_id:obj._id},
        select= {mobileDevice:1};
    User.findOne(match,select , (err, result) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else{
        res.json(this.response({ data: result.mobileDevice, message: "data found." }));
      }
    });
  }

  /* To delete user from tarcking app*/
  // deleteUserProfile(req,res){
  //   let obj  = req.query,
  //       user = req.user,
  //       _remove_user = function(obj) {
  //         return new Promise((resolve, reject) => {
  //          /*write code to remove user*/
  //           User.remove({_id:user._id},(err,remove)=>{
  //             resolve(null);
  //           })
  //         });
  //       },
  //       _remove_friends_trackies = function(obj) {
  //         return new Promise((resolve, reject) => {
  //          /*code to remove user from friend*/
  //           User.update({},
  //             { $pull: { friends: { user_id: ObjectId(user._id) } } },
  //             { multi: true },
  //             (err,update)=>{
  //             resolve(null);
  //           });
  //           /*code to remove user from Tracklist*/
  //           User.update({},
  //             { $pull: { trackies: { user_id: ObjectId(user._id) } } },
  //             { multi: true },
  //             (err,update)=>{
  //             resolve(null);
  //           });
  //         });
  //       },
  //       _deactive_conversation = function(obj) {
  //         return new Promise((resolve, reject) => {
  //          /*write code to remove user*/
  //           Conversation.update({"chatUsers._id":ObjectId(user._id) },
  //             { $set: { status: "Deleted" } },
  //             { multi: true },
  //             (err,update)=>{
  //             resolve(null);
  //           });
  //         });
  //       };

  //   (async ()=>{
  //     try {
  //       let _remove_user_profile = await _remove_user(obj),
  //           _remove_user_friends_trackies  = await _remove_friends_trackies(obj),
  //           _deactive_user_conversation  = await _deactive_conversation(obj);
  //       return res.json(this.response({ data:_deactive_user_conversation, message: "success" }));
  //     }catch(e){
  //       res.json(this.response({ err: err, message: error.oops() }));
  //     }
  //   })();
  // }

  /* To delete user from tarcking app*/
  contactUs(req,res){
    let obj = req.body;
    let body = {
            name: obj.name,
            email: obj.email,
            subject: obj.subject,
            appname: env.appname
          };
          /**send email to Admin. */
    Mailer.Email(env.mail.adminEmail, "contactUs", "app/views/", {
      body: body,
      subject: `Contact Request from ${env.appname} !`
    });
    res.json(this.response({ data:'success', message: "Your request sent to the Administrator" }));
  }
  /* To delete user from tarcking app*/
  contactUs(req,res){
    let obj = req.body;
    let body = {
            name: obj.name,
            email: obj.email,
            subject: obj.subject,
            message: obj.message,
            appname: env.appname
          };
          /**send email to Admin. */
    Mailer.Email(env.mail.adminEmail, "contactUs", "app/views/", {
      body: body,
      subject: `Contact Request from ${env.appname} !`
    });
    res.json(this.response({ data:'success', message: "Your request sent to the Administrator" }));
  }
  /* To get cms by keyword*/
  getCms(req,res){
    let obj = req.query,
        query = {pageKeyword:obj.pageKeyword},
        select= {name:1,cmsContent:1,pageKeyword:1};
    Post.find(query,select,(err,cms)=>{
      if(err) res.json(this.response({ err: err, message: error.oops() }));
      if(cms.length>0){
        res.json(this.response({ data:cms, message: "success" }));
      }else{
        res.json(this.response({ err: "page not found", message: "page not found." }));
      }
    })
  }
/* This is test function for badge count*/
 /*async getbadgeCount(req,res){
    
  var badge = await Badge.badge(req.user._id)

  console.log('get badge count--------',badge);
 }*/
}

module.exports = UserController;


