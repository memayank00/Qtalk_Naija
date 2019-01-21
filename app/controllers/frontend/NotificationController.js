const path = require("path"),
  jwt = require("jsonwebtoken"),
  _ = require("lodash"),
  formidable = require("formidable"),
  fs = require("fs-extra"),
  mv = require("mv"),
  crypto = require("crypto"),
  /**/
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  error = require(path.resolve(`./app/config/libs/error`)),
  Mailer = require(path.resolve(`./app/config/libs/mailer`)),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  Push    = require(path.resolve('./app/config/libs/pushNotification')),
  App = require(path.resolve("./app/controllers/frontend/AppController")),
  DATE = require(path.resolve("./app/config/libs/date")),
  User = require(path.resolve("./app/models/User")),
  Notification = require(path.resolve("./app/models/Notification")),
  Request = require(path.resolve("./app/models/Request"));
ObjectId = require("mongoose").Types.ObjectId;

class NotificationController extends App {
  constructor() {
    super();
    /**/
    this.notificationView = this.notificationView.bind(this);
    //this.getUsersToAlert = this.getUsersToAlert.bind(this);
    //this.sendAlert = this.sendAlert.bind(this);
    this.unreadNotificationCount = this.unreadNotificationCount.bind(this);
    this.saveMessage = this.saveMessage.bind(this);
    this.updateNotificationType=this.updateNotificationType.bind(this);
    this.push = new Push();
  }
  /**this method is used to update & see for all Notification
   * method : GET
   * endpoint: /api/notification-view
   */
  notificationView(req, res) {
    let user = req.user,
      _match = { to: user._id, seen: false },
      _toUpdate = { $set: { seen: true } };
    /**/
    let _updateNotification = function() {
        return new Promise((resolve, reject) => {
          //Notification.find
          Notification.update(
            _match,
            _toUpdate,
            { multi: true },
            (err, update) => {
              if (err) {
                reject(err);
              } else {
                resolve("success");
              }
            }
          );
        });
      },
      _getNotification = function(result) {
        _match = { to: user._id, status: true };
        return new Promise((resolve, reject) => {
          Notification.find(_match, function(err, noti) {
            if (err) reject(err);
            else resolve(noti);
          }).sort( { created_at: -1 } ).limit(50);
        });
      };
    _updateNotification()
      .then(result => {
        return _getNotification(result);
      })
      .then(result => {
        res.json(this.response({ data: result, message: "Success" }));
      })
      .catch(err => {
        res.json(this.response({ err: err, message: error.oops() }));
      });
  }
  /*notificationView(req,res){
		let user = req.user,
			_match = {to:user._id,seen:false},
			_toUpdate ={$set:{seen:true}};
		Notification.update(_match,_toUpdate,{multi:true},(err,update)=>{
			if(err){
				res.json(this.response({ err: err, message: error.oops() }));
			}else{
				res.json(this.response({ data: update, message: "All notifications are viewed" }));
			}
		});
    }*/
  /**this method is used to update see for all Notification
   * method : GET
   * endpoint: /api/get-users-to-alert
   */
  // getUsersToAlert(req, res) {
  //   console.log("inside")
  //   let 
  //   /* user={ _id: '5b67e73c7ee8ba15ea36b30f',
  //   name: 'User1 u1_L',
  //   email: 'user1@yopmail.com',
  //   username: 'user1',
  //   mobile: '987654321',
  //   profilePicture: 'http://69f995bd.ngrok.io/profilePicture/5b67e73c7ee8ba15ea36b30f/image.jpg',
  //   iat: 1539157228,
  //   exp: 1540366828 }, */
  //   user=req.user,
  //     obj = req.query,
  //     limit = parseInt(process.env.LIMIT) || 10,
  //     offset = obj.page ? parseInt((obj.page - 1) * limit) : 0,
  //     query = new Object(),
  //     /*this method used to get request*/
  //     _get_user_friend = function() {
  //       return new Promise((resolve, reject) => {
  //         let match = { _id: ObjectId(user._id) },
  //           project = { friends: 1, trackies: 1 };
          

  //         let query = [
  //           {
  //             $facet: {
  //               friendUser: [
  //                 {
  //                   $match: match
  //                 },
  //                 {
  //                   $project: project
  //                 },
  //                 { $unwind: "$friends" },
  //                 {
  //                   $project: {
  //                      friendId: "$friends.user_id" 
  //                 }
  //                 },
  //                 {
  //                   $group: {
  //                     _id: "$_id",
  //                     friendsArray: { $addToSet: "$friendId" }
  //                   }
  //                 }
  //               ],
  //               trackUser: [
  //                 {
  //                   $match: match
  //                 },
  //                 {
  //                   $project: project
  //                 },
  //                 { $unwind: "$trackies" },
  //                 {
  //                   $project: { trackId: "$trackies.user_id" }
  //                 },
  //                 {
  //                   $group: {
  //                     _id: "$_id",
  //                     trackArray: { $addToSet: "$trackId" }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         ];
  //         User.aggregate(query, async(err, userList) => {
  //           //console.log('userList-- ',JSON.stringify(userList));
  //           let friendIds =
  //               userList[0].friendUser.length > 0
  //                 ? userList[0].friendUser[0].friendsArray
  //                 : [],
  //             trackIds =
  //               userList[0].trackUser.length > 0
  //                 ? userList[0].trackUser[0].trackArray
  //                 : [];
  //           function removeDuplicates(arr) {
  //             let unique_array = [],
  //               real_array = [];
  //             for (let i = 0; i < arr.length; i++) {
  //               if (unique_array.indexOf(arr[i].toString()) === -1) {
  //                 unique_array.push(arr[i].toString());
  //                 real_array.push(arr[i]);
  //               }
  //             }
  //             return real_array;
  //           }

  //           function compareArray(arr1,arr2){
  //             _.forEach(arr1, function (val1,i) {
  //               _.forEach(arr2, function (val2,j) {
  //                 if (val1.equals(val2)) {
  //                   arr2.splice(j,1)
  //                 }
  //               })
  //             })
  //             return arr2;
  //           }

  //           let allFrndsUser = removeDuplicates(friendIds);
  //           let allTrackUser = removeDuplicates(trackIds);
  //           allTrackUser=compareArray(allFrndsUser,allTrackUser);
           
        
         
  //           console.log("allFrndsUser",allFrndsUser);
  //           console.log("allTrackUser",allTrackUser);
  //           if (err) reject(err);
  //           else if (allFrndsUser.length > 0 || allTrackUser.length > 0)
  //             resolve({ allFrndsUser, allTrackUser });
  //           else reject("User not found.");
  //         });
  //       });
  //     },
  //     _findAlerUsers=function(result){
  //       return new Promise((resolve,reject)=>{
  //         let match = { _id: ObjectId(user._id) },
  //           project = { alertSent: 1};
  //         User.findOne(match,project,(err,users)=>{
  //           if(err){ reject(err)}
  //           else{
  //             let array=result[0];
  //             _.forEach(array.userInfo,function(val1){
  //                  val1.alertSent=false;
  //               _.forEach(users.alertSent,function(val2){
  //                 if(val1._id.equals(val2.user_id)){
  //                   val1.alertSent=true;
  //                 }
  //               })
  //             })
  //            resolve (result);
  //           }
  //         })
  //       })
  //     },
  //     /* Find user data */
  //     _findUserData = function(result) {
  //       return new Promise((resolve, reject) => {
  //         let user_ids = result,
  //           //match = { $and: [{ _id: { $in: user_ids } }] };
  //          match= {$and:[
  //                   { _id: { $in: user_ids } }
  //               ]};

  //         if (obj.q)
  //           match.$and.push({$or:[
  //               {username:new RegExp(`${obj.q}`, 'i')},
  //               {name:new RegExp(`${obj.q}`, 'i')},
  //               {email:new RegExp(`${obj.q}`, 'i')},
  //               {mobile:new RegExp(`${obj.q}`, 'i')}
  //             ]
  //           });
  //           //match.$and.push({ name: { $regex: obj.q, $options: "i" } });
            
  //         let query = [
  //           {
  //             $facet: {
  //               count: [
  //                 { $match: match },
  //                 {
  //                   $project: { username: 1, name: 1, count: "count" }
  //                 },
  //                 {
  //                   $group: {
  //                     _id: "$count",
  //                     total: { $sum: 1 }
  //                   }
  //                 }
  //               ],
  //               userInfo: [
  //                 { $match: match },
  //                 {
  //                   $project: {
  //                     name: 1,
  //                     profilePicture: 1,
  //                     mobile: 1,
  //                     fullno: 1,
  //                     location: { $ifNull: ["$location", ""] },
  //                     created_at: 1,
  //                     /* {$cond: { if:
  //                        { $in: [ "$user_id", 
  //                        alertSent ] }, then: true, else: false }} */
  //                     /* alerts: {
  //                       $cond: {
  //                         if: {
  //                           $gt: [{ $size: "$alerts" }, 0]
  //                         },
  //                         then: true,
  //                         else: false
  //                       }
  //                     } */
  //                   }
  //                 },
  //                 { $skip: offset },
  //                 { $limit: limit },
  //                 { $sort: { created_at: -1 } }
  //               ]
  //             }
  //           }
  //         ];
  //         User.aggregate(query, async (err, users) => {
  //           if (err) {reject(err)}
  //           else if (users.length > 0) {
  //       let finalData= await _findAlerUsers(users); 
  //             resolve(users)
  //           }
  //           else {reject("Users not found")};
  //         });
  //       });
  //     },
  //     /*this method used to get user informations for listing*/
  //     _get_friends_info = function(result) {
  //       return new Promise(async (resolve, reject) => {
  //         try {
  //           let { allFrndsUser, allTrackUser } = result;
  //           let finalfrndsData = await _findUserData(allFrndsUser);
  //           let finaltracksData = await _findUserData(allTrackUser);
  //           let frndsData = finalfrndsData[0];
  //           let tracksData = finaltracksData[0];
  //           resolve({ frndsData, tracksData });
  //         } catch (error) {
  //           reject(error);
  //         }

  //         /* 	let user_ids = result,
		// 				match   = {$and:[{_id: { $in: user_ids }}]};
		// 			if(obj.q) match.$and.push({"name":{ $regex : obj.q, $options : "i" }});    
		// 			let	query = [
		// 					{
		// 						$facet:{
		// 							count:[
		// 								{$match:match},
		// 								{
		// 										$project:{username:1,name:1,count:"count"}
		// 								  },
		// 								  {
		// 								$group: {
		// 								  _id: '$count',
		// 								  total: { $sum: 1 }
		// 								}
		// 							  }
		// 							],
		// 							userInfo:[
		// 								{$match:match},
		// 								{
		// 										$project:{name:1,profilePicture:1,mobile:1,fullno:1,location:{$ifNull:["$location",""]},created_at:1}
		// 								  },
		// 								  { $skip: offset },
		// 								{ $limit: limit },
		// 								{ $sort : { created_at : -1 } }
		// 							]
		// 						}
		// 					}
		// 				];
		// 			User.aggregate(query,(err,users)=>{
		// 				if(err) reject(err);
		// 			  else if(users.length>0) resolve(users);
		// 			  else reject('Users not found');
		// 			}) */
  //       });
  //     };

  //   _get_user_friend()
  //     .then(result => {
  //       return _get_friends_info(result);
  //     })
  //     .then(result => {
  //       console.log("result", result);
  //       res.json(this.response({ data: result, message: "Users found." }));
  //     })
  //     .catch(err => {
  //       res.json(this.response({ err: err, message: error.oops() }));
  //     });
  // }
  getUsersToAlertV1(req, res) {
    let user = req.user,
      obj = req.query,
      limit = parseInt(process.env.LIMIT),
      offset = obj.page ? parseInt((obj.page - 1) * limit) : 0,
      query = new Object(),
      /*this method used to get request*/
      _get_user_friend = function() {
        return new Promise((resolve, reject) => {
          let match = { _id: ObjectId(user._id) },
            project = { friends: 1, trackies: 1 };

          let query = [
            {
              $facet: {
                friendUser: [
                  {
                    $match: match
                  },
                  {
                    $project: project
                  },
                  { $unwind: "$friends" },
                  {
                    $project: { friendId: "$friends.user_id" }
                  },
                  {
                    $group: {
                      _id: "$_id",
                      friendsArray: { $addToSet: "$friendId" }
                    }
                  }
                ],
                trackUser: [
                  {
                    $match: match
                  },
                  {
                    $project: project
                  },
                  { $unwind: "$trackies" },
                  {
                    $project: { trackId: "$trackies.user_id" }
                  },
                  {
                    $group: {
                      _id: "$_id",
                      trackArray: { $addToSet: "$trackId" }
                    }
                  }
                ]
              }
            }
          ];
          User.aggregate(query, (err, userList) => {
            let friendIds =
                userList[0].friendUser.length > 0
                  ? userList[0].friendUser[0].friendsArray
                  : [],
              trackIds =
                userList[0].trackUser.length > 0
                  ? userList[0].trackUser[0].trackArray
                  : [];

            var other = _.concat(friendIds, trackIds);

            /*this method is to remove duplicate element from array*/
            function removeDuplicates(arr) {
              let unique_array = [],
                real_array = [];
              for (let i = 0; i < arr.length; i++) {
                if (unique_array.indexOf(arr[i].toString()) === -1) {
                  unique_array.push(arr[i].toString());
                  real_array.push(arr[i]);
                }
              }
              return real_array;
            }
            //let allUser = _.shuffle(removeDuplicates(other));
            let allUser = removeDuplicates(other);

            if (err) reject(err);
            else if (allUser.length > 0) resolve(allUser);
            else reject("User not found.");
          });
        });
      },
      /*this method used to get user informations for listing*/
      _get_friends_info = function(result) {
        return new Promise((resolve, reject) => {
          let user_ids = result,
            match = { $and: [{ _id: { $in: user_ids } }] };
          if (obj.q)
            match.$and.push({ name: { $regex: obj.q, $options: "i" } });
          let query = [
            {
              $facet: {
                count: [
                  { $match: match },
                  {
                    $project: { username: 1, name: 1, count: "count" }
                  },
                  {
                    $group: {
                      _id: "$count",
                      total: { $sum: 1 }
                    }
                  }
                ],
                userInfo: [
                  { $match: match },
                  {
                    $project: {
                      name: 1,
                      profilePicture: 1,
                      mobile: 1,
                      fullno: 1,
                      location: { $ifNull: ["$location", ""] },
                      created_at: 1
                    }
                  },
                  { $skip: offset },
                  { $limit: limit },
                  { $sort: { created_at: -1 } }
                ]
              }
            }
          ];
          User.aggregate(query, (err, users) => {
            if (err) reject(err);
            else if (users.length > 0) resolve(users);
            else reject("Users not found");
          });
        });
      };
    _get_user_friend()
      .then(result => {
        return _get_friends_info(result);
      })
      .then(result => {
        res.json(this.response({ data: result[0], message: "Users found." }));
      })
      .catch(err => {
        res.json(this.response({ err: err, message: error.oops() }));
      });
  }

  // sendAlert(req,res){
  //    let user = req.user,
  //     that = this,
  //     obj = req.body;
  //     console.log("obj--- ", obj);
  //     console.log("obj type--- ", typeof obj);
  //     let send_alertArray=_.map(obj.userIds,function(userId){
  //       return {
  //         user_id:ObjectId(userId),
  //         status:true
  //       }
  //     });
  //   let users_obj = _.map(obj.userIds, function(userId) {
  //       return {
  //         title: "Alert Received",
  //         content: `${obj.message}`,
  //         to: ObjectId(userId),
  //         from: user._id,
  //         imageUrl: user.profilePicture,
  //         types: `Normal`,
  //         meta: { to: userId, from: user._id }
  //       };
  //     }),
  //     _update_Alerts=function(){
  //       return new Promise((resolve,reject)=>{
  //         User.findOneAndUpdate(
  //           { _id: ObjectId(user._id) },
  //           { $set:{alertSent:send_alertArray}},
  //           {projection:{alertSent:1},new:true},
  //           (err,result)=>{
  //             if (err) reject(err);
  //             else resolve(result);
  //           }
  //         )
  //       })
  //     },
  //     /*save alert as notification in collection*/
  //     _save_notification = function() {
  //       return new Promise((resolve, reject) => {
  //         Notification.insertMany(users_obj,async (err, noti) => {
  //           if (err){reject(err)}
  //           else{
  //             let dataAlerts=await _update_Alerts();
  //              resolve(noti)
  //             };
  //         });
  //       });
  //     },
      
  //     /*save alert as message in collection*/
  //     _send_message = function(result) {
  //       return new Promise((resolve, reject) => {
  //         //console.log('result-- ',result)

  //         _.forEach(result, function(value, key) {
  //           //console.log('value--- ',value.to);
  //           User.findOne(
  //             { _id: value.to },
  //             { name: 1, profilePicture: 1} ,
  //             (err, userObj) => {
  //               if (user) {
  //                 //console.log('user--- ',user);
  //                 const users = [
  //                   {
  //                     _id: ObjectId(userObj._id),
  //                     name: userObj.name,
  //                     image: userObj.profilePicture
  //                   },
  //                   {
  //                     _id: ObjectId(user._id),
  //                     name: user.name,
  //                     image: user.profilePicture
  //                   }
  //                 ];
  //                 //console.log('users--- ',users);
  //                 Conversation.find(
  //                   {
  //                     currentUsers: {
  //                       $all: that.getUserIds(users)
  //                     }
  //                   },
  //                   (err, userGroup) => {
  //                     if (userGroup && userGroup.length) {
  //                       console.log("room alredy exist");
  //                       that.saveMessage(
  //                         userGroup[0],
  //                         user,
  //                         userObj,
  //                         obj.message
  //                       );
  //                     } else {
  //                       console.log("room not exist");
  //                       let newConversation = {
  //                         chatUsers: users,
  //                         currentUsers: that.getUserIds(users),
  //                         status: "Connected",
  //                         chat_status: "Start"
  //                       };
  //                       console.log('newConversation--- ',newConversation);
  //                       /*create a connection between users*/
  //                       Conversation(newConversation)
  //                       .save()
  //                       .then(conversationId => {
  //                         console.log('conversationId--- ',conversationId);
  //                         that.saveMessage(
  //                           conversationId,
  //                           user,
  //                           userObj,
  //                           obj.message
  //                         );
  //                       })
  //                       .catch(error => {
  //                         console.log("error to save convertation");
  //                       });
  //                     }
  //                     /*send push Notification for send alert*/
  //                         User.findOne({_id:userObj._id},{mobileDevice:1} , (err, result) => {
              
  //                         let data = result.mobileDevice;
                         
  //                           if(data && data.length>0){
  //                              //console.log(response.body);  
  //                              data.map((tokenData) => {
  //                               const pushData = obj;
  //                               console.log('tokenData-- ',tokenData)
  //                               if(tokenData.deviceType=='ios'){
  //                                   console.log('ios push-----')
  //                                   /*send push notification to IOS device*/
  //                                   that.push.APN(
  //                                       tokenData.deviceToken, 
  //                                       "you have a Alert by "+user.name,
  //                                       tokenData.badge + 1, 
  //                                       pushData,
  //                                       '3'
  //                                   )
  //                                   .then(result => {
  //                                       /*send emit to user*/
  //                                   })
  //                                   .catch(error => false);
  //                               }else{
  //                                   console.log('Andriod push----- ')
  //                                   /*send push notification to Android device*/
  //                                   that.push.FCM(
  //                                       tokenData.deviceToken, 
  //                                       "you have a Alert by "+user.name,
  //                                       tokenData.badge + 1, 
  //                                       pushData,
  //                                       '3'
  //                                   )
  //                                   .then(result => {
  //                                       /*send emit to user*/
  //                                   })
  //                                   .catch(error => false);
  //                                 }
  //                              });
  //                           }                            
  //                     });
  //                   }
  //                 );
  //               }
  //             }
  //           );
  //         });
  //         resolve(result);
  //       });
  //     };


  //     _save_notification()
  //     .then(result => {
  //       return _send_message(result);
  //     })
  //     .then(result => {
  //       res.json(
  //         this.response({ data: result, message: "Alerts sent successfully." })
  //       );
  //     })
  //     .catch(err => {
  //       res.json(this.response({ err: err, message: error.oops() }));
  //     });
  //   }

  //     saveMessage(conversationId, from, to, message) {
  //       let data = {
  //         sender: from._id,
  //         receiver: to._id,
  //         body: message,
  //         read: [from._id],
  //         deliver: [from._id],
  //         conversationId: new ObjectId(conversationId._id),
  //         timestamp: DATE.timestamp(),
  //         members: [from._id, to._id.toString()]
  //       };
   
    
  //       var chat = new Chat(data);
  //       chat.save();
  // }

  /**this method is used to send alert to selected users
   * method : POST
   * endpoint: /api/send-alert
   */

  sendAlertV1(req, res) {
    let user = req.user,
      that = this,
      obj = req.body;
    console.log("obj--- ", obj);
    console.log("obj type--- ", typeof obj);
    let users_obj = _.map(obj.userIds, function(userId) {
        return {
          title: "Alert Request",
          content: `${obj.message}`,
          to: ObjectId(userId),
          from: user._id,
          types: `Normal`,
          meta: { to: userId, from: user._id }
        };
      }),
      /*save alert as notification in collection*/

      _save_notification = function() {
        return new Promise((resolve, reject) => {
          Notification.insertMany(users_obj, (err, noti) => {
            if (err) reject(err);
            else resolve(noti);
          });
        });
      },
      /*save alert as message in collection*/
      _send_message = function(result) {
        return new Promise((resolve, reject) => {
          //console.log('result-- ',result)

          _.forEach(result, function(value, key) {
            //console.log('value--- ',value.to);
            User.findOne(
              { _id: value.to },
              { name: 1, profilePicture: 1 },
              (err, userObj) => {
                if (user) {
                  //console.log('user--- ',user);
                  const users = [
                    {
                      _id: userObj._id,
                      name: userObj.name,
                      image: userObj.profilePicture
                    },
                    {
                      _id: user._id,
                      name: user.name,
                      image: user.profilePicture
                    }
                  ];
                  //console.log('users--- ',users);
                  Conversation.find(
                    {
                      currentUsers: {
                        $all: that.getUserIds(users)
                      }
                    },
                    (err, userGroup) => {
                      if (userGroup && userGroup.length) {
                        console.log("room alredy exist");
                        that.saveMessage(
                          userGroup[0],
                          user,
                          userObj,
                          obj.message
                        );
                      } else {
                        console.log("room not exist");
                        let newConversation = {
                          chatUsers: users,
                          currentUsers: that.getUserIds(users),
                          status: "Connected",
                          chat_status: "Start"
                        };

                        /*create a connection between users*/
                        Conversation(newConversation)
                          .save()
                          .then(conversationId => {
                            //console.log(conversationId);
                            that.saveMessage(
                              conversationId,
                              user,
                              userObj,
                              obj.message
                            );
                          })
                          .catch(error => {
                            console.log("error to save convertation");
                          });
                      }
                    }
                  );
                }
              }
            );
          });
          resolve(result);
        });
      };
    _save_notification()
      .then(result => {
        return _send_message(result);
      })
      .then(result => {
        res.json(
          this.response({ data: result, message: "Alert has sent to users." })
        );
      })
      .catch(err => {
        res.json(this.response({ err: err, message: error.oops() }));
      });
  }
  saveMessage(conversationId, from, to, message) {
    let data = {
      sender: from._id,
      receiver: to._id,
      body: message,
      read: [from._id],
      deliver: [from._id],
      conversationId: new ObjectId(conversationId._id),
      timestamp: DATE.timestamp(),
      members: [from._id, to._id.toString()]
    };

    var chat = new Chat(data);
    chat.save();
  }
  /*sendAlert(req,res){
		let user = req.user,
			obj = req.body;
		let users_obj = _.map(obj.userIds,function(userId){
			return {
		    	    title: 'Alert Request',
					content: `${obj.message}`, 
					to:  ObjectId(userId),
					from:  user._id,
					types: `Normal`,
					meta : { to: userId, from:user._id}
    	    	 };
		});
		Notification.insertMany(users_obj, (err, noti)=> {
			if(err) res.json(this.response({ err: err, message: error.oops() }));
			else res.json(this.response({ data: noti, message: "Alert has sent to users." })); 
		});	
	}*/
  /**this method is used to get unread notification count
   * method : POST
   * endpoint: /api/send-alert
   */
  unreadNotificationCount(req, res) {
    let user = req.user,
      match = { to: user._id, seen: false };
    Notification.count(match, (err, count) => {
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else res.json(this.response({ data: count, message: "Success." }));
    });
  }

  /* Update Notification types */
  updateNotificationType(req,res){
    let user=req.user,
        reqData=req.body,
    match={_id:ObjectId(reqData.user_id)};
    Notification.findOneAndUpdate(match,{$set:{types:reqData.type}},(err,result)=>{
      if (err) res.json(this.response({ err: err, message: error.oops() }));
      else res.json(this.response({ data: result, message: "Success." }));
    })
  }
}
module.exports = NotificationController;
