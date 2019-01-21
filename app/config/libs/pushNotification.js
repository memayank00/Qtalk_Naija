'use strict';

const APNlib  = require('apn'),
      FCMlib  = require('fcm-node'),
      PATH    = require('path'),
      Badge   = require(PATH.resolve(`./app/config/libs/badgeCount`)),
      env     = require(PATH.resolve(`./app/config/env/${process.env.NODE_ENV}`));

class PUSH {

  /*setting GLOBAL paramters for this PUSH Notification class*/
    constructor(){
      /*setting up APPLE Push Notification(APN) Options*/
      let _apn_opt = {
          token : {
            key: env.APPLE.key,
            keyId: env.APPLE.keyId,
            teamId: env.APPLE.teamId,
          },
          production : env.APPLE.production
      };
      /*let _apn_opt = {
            token : {
              key: env.APPLE.key,
              keyId: env.APPLE.keyId,
              teamId: env.APPLE.teamId,
            },
            passphrase:"app123",
            cert:env.APPLE.cert,
            production : env.APPLE.production
        };*/
      this._apn_opt = _apn_opt;

      /*setting up Google Firebase Cloud Messaging(FCM) Options*/
      let _fcm_server_key = env.GOOGLE.key;

      this._fcm_server_key = _fcm_server_key;
    }

    // async APN(deviceToken, message, badge=0, type, pushType,to_userId){ 
    //    badge = await Badge.badge(to_userId)
    //   //console.log('--->>>1',message)
    //   console.log('deviceToken--->>>######',deviceToken)
    //   console.log('ios badge--->>>#######',badge);
    //   //console.log('deviceToken--->>>',type) 
    //   //console.log('pushType--->>>',pushType)
    //   type.pushType = pushType;
    //   return new Promise((resolve,reject) =>{
    //     let apnProvider = new APNlib.Provider(this._apn_opt),
    //         _push       = new APNlib.Notification();

    //     _push.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now. 
    //     _push.sound = env.APPLE.sound;
    //     _push.topic = env.APPLE.topic;
    //     //_push.pushType = pushType;
    //     //_push.type = type;
    //     let _send_push = function(deviceToken, message, badge){
    //       //console.log("_send_push----------")
    //       _push.alert = message;
    //       _push.payload = {"type" : type,"pushType":pushType,"message":message};
    //       _push.badge = badge;

    //       console.log("badge---->> ",badge);
    //       if(deviceToken) apnProvider.send(_push, deviceToken).then(result=>console.log('result--#######> ',JSON.stringify(result)))
           
    //     }

    //     _send_push(deviceToken, message, badge);
    //   });   

    // }

    // async FCM(deviceToken, message, badge=0, type=0,pushType=0,to_userId){
    //   //console.log('--->>>1',message)
    //   badge = await Badge.badge(to_userId)
    //   console.log('deviceToken--->>>#####',deviceToken)
    //   console.log('andriod badge--->>>########',badge);
    //   //console.log('this._fcm_server_key---- ',this._fcm_server_key)
    // let fcm = new FCMlib(this._fcm_server_key);
    //   /*Send notification to Android Device*/
    //   return new Promise((resolve,reject) =>{
    //     fcm.send({
    //         to: deviceToken,
    //         data : {
    //           title: message, //'Title of your push notification', 
    //           body: message,
    //           type: type,
    //           pushType:pushType,  // 0 => messages, 1=>Friend Request, 2=> Track request, 3=> Send Alert
    //           badge:badge
    //         }
    //     }, (err, response) => {
    //       console.log('err--->>> ',err)
    //       console.log('response--->>> ',response)
    //         if(err) reject(err)//console.log("Something has gone wrong while sending FCM Push!");
    //         if(response) resolve(response)//console.log("Successfully sent with response: ", response);
            
    //     });
    //   }); 
    // }
}

module.exports = PUSH;