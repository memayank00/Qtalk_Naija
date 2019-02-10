'use strict';
const DS       = "/",
      PORT     = 5000,
      __DB     = "Qtalk_Naija",
      base_url = "http://localhost:"+PORT+DS;

module.exports = {
  admin : {
    path : "/manager"
  },
  admin_base_url: base_url+"manager/",
  API : {
    site  : '/api/',
    admin : '/admin_api/' 
  },
  base_url: base_url,
  appname:'Qtalk Naija',
  constants : {

  },
	db: {
    name : __DB,
		URL: "mongodb://localhost/"+__DB,
		options: {
			user: '',
			pass: ''
		}
  },
  LIMIT:10,
  user_url:"http://localhost:3000", //forgot pass url
  debug_mongo: true,
  DS: "/",
  image_destination: 'uploads',
  image_dstn_w_slash : "./uploads/",
  image_extensions : {
    'image/jpeg' : '.jpg',
    'image/jpg' : '.jpg',
    'image/png' : '.png',
    'image/gif' : '.gif'
  },
  listing : {
    limit : 10
  },
   /**
   * these are the details of admin which will create
   * firsttime when the server is start
   */
  ADMIN: {
    username: "superadmin",
    email: "superadmin@yopmail.com",
    password: "123456",
    role: "superAdmin",
    lastname: "lastname",
    firstname: "superAdmin",
    status: true
  },
  permissions: {
    /**specify all the Pemission HOT_KEYWORD in array
     * which you want to assign a superadmin
     *  and admin respectively
     */

    superAdmin: [
      "MANAGE_ROLE",
      "PROFILE",
      "CHANGE_PASSWORD",
      "MANAGE_USER",
      "PAGES",
      "BLOGS",
      "CONTACT_US",
      "GET_AN_OFFER",
      "MARKET_MANAGEMENT",
      "PROPERTY_MANAGEMENT"
    ],
    admin: ["PROFILE", "CHANGE_PASSWORD"]
  },
  secret : new Buffer("@#$Ggf34#$Yfwv12&*_34sdVV5443g$#G$#TVS@#f3g2&^%JH#2fc2@@@@@^%f2f23f#@@#fg").toString('base64'),
  /*for sending emails*/
  server: {
    PORT: PORT,
    socketPORT : 5051,
    host: 'http://localhost'
  },
  /**for sending emails
   * we have used sendgrid
   * LINK:-https://sendgrid.com/
  */
  /*sendgrid: {
      key: "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",
      username: "qtalk_naija",
      password: "qtalknaija2019"
  },*/
  sendgrid: {
      key: "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",
      username: "memayank01",
      password: "Mayank12345."
  },
  mail: {
      from: "Qtalk Naija",
      email: "no-reply@yopmail.com",
      //adminEmail: "admin@trackingapp.com",
      adminEmail: "admin@yopmail.com",
      masterKey:"Qtalk_Naija2019#@"
  },
  cloudinary : {
    cloud_name : "dby3cbokv",
    api_key : "623986951163464",
    api_secret : "FtKtLX0TJ-Gv2dhB697FsAZ3JDY"
  },
  /*Distribution*/
  APPLE: {
    production: false,
    key: "./key/ios/AuthKey_6HTY7DKCWN.p8",
    keyId: "6HTY7DKCWN",
    teamId: "2V9L6U5ACK",
    sound: "ap10.wav", 
    topic: "com.genrik.iDispatchMobile",
    cert :"./key/ios/TrackingApp-Dev-cert.pem"
  },
  GOOGLE : {
    key : "AAAAO4EbA8o:APA91bFdHuUe3La-aG6_aboR9Bo68zCAJyjNcgNgnThjL-8iIgEzhQodY38PWR4YMFlgr5551aRjD8d9AaHYMuaj3XXB1h-pc5wRGZKpkW-qw_9Uu2Uvcss6L_-1cPCGM1oylMgCDtd9yUc39KSumRyNzOisnu86Pg"
  }
};