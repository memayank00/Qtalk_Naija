
const path                  = require('path'),
mongoose              = require('mongoose'),
_                     = require('lodash'),
env                   = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),     
async                 = require("async"),
/**Collections */
Notification          = require(path.resolve('./app/models/notificationsAdmin')),
App                   = require(path.resolve('./app/controllers/backend/AppController')),
_moment               = require(path.resolve(`./app/config/libs/date`)),
ERROR                 = require(path.resolve(`./app/config/libs/error`));




class NotificationController extends App  {

constructor(){
super();

this.getAll = this.getAll.bind(this);
}

/**getAll - will return all notifications of a user */
getAll(req, res) {    
  let user = req.user,
  obj = req.query,
  page = obj.page ? obj.page : 1,
  limit  = obj.limit ? parseInt(obj.limit) : env.listing.limit,
  offset = parseInt((page - 1)) * limit;


  let stages = {
    notifications: (callback) => {
      Notification.find({userId: user._id}).sort({createdAt: -1})
      .skip(offset)
      .limit(limit).exec(callback);
    },
    count: (callback) => {
      Notification.count({userId: user._id}).exec(callback);
    },
    unreadcount: (callback) => {
      Notification.count({userId: user._id, read : false}).exec(callback);
    }
  };

  if(obj.read){
    /*update messages to read status if we got read param*/
    stages.read = (callback) => {
      Notification.update({userId: user._id},{$set : {read : true}},{multi : true}).exec(callback);
    };
  }

  async.parallel(stages, (err, result) => {
    if(err) res.status(412).json({type:"error", message:Error.oops(), errors:Error.pull(err)});
    if(result) res.json({type : true, message : (result.notifications && result.notifications.length)?"Notifications have been sent.":"No Notification Found", data  : result });
  });
}

/**
* Save Notification for Logged in 
* Admin User.
*
* @static - saveOne
* 
* @return {[type]}     Returns the Object to acknowledge that notification is saved
*/
static saveOne(obj) {
/*
  saving userId as ObjectId
 */
obj.userId = mongoose.Types.ObjectId(obj.userId);

new Notification(obj).save()
.then(result=>true)
.catch(err=>false);
}

/**
* This function will store notifications title at one place.
* By passing the key of notification will return the title.
* By passing * will return all titles.
* 
* @param  {String} key - This will return 2 types of value
* * - will return all notificaitons titles
* @param  {Object} meta - This will have extra meta data regarding notification
* key - will return specific title
* 
* @return {[type]}     Return the Object or Array
*/
static getNotification(key='*', meta={}){
const notifications = [{
  type : 10,
  key : "CHANGE_PASSWORD",
  title : "Your password has been changed."
},{
  type : 11,
  key : "LAST_LOGIN",
  title : "You were last logged in at "+meta.time+"."
}];

return (key!=='*') ? _.find(notifications, {key:key}) : notifications;
}
}

module.exports = NotificationController;