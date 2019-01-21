const path = require('path'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  async = require("async"),
  useragent = require('useragent'),
  os = require('os'),
  Json2csvParser = require('json2csv').Parser,
  fs = require("fs"),
  /**Collections */
  Log = require(path.resolve('./app/models/logs')),
  Admin = require(path.resolve('./app/models/admin')),
  App = require(path.resolve('./app/controllers/backend/AppController')),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  Error = require(path.resolve(`./app/config/libs/error`)),
  ObjectId = mongoose.Types.ObjectId;;




class LogsController extends App {

  constructor() {
    super();

    this.getAll = this.getAll.bind(this);
    this.trackActivity = this.trackActivity.bind(this);
  }

  /**
   * This will return all recorded logs data
   * @param  {[type]} req queried data
   * @param  {[object]} res.json to retunr response
   * @return {[object]}     list of all logs
   */
  getAll(req, res) {
    let user = req.user,
      match = {type:"login"},
      obj = req.query,
      page = obj.page ? obj.page : 1,
      limit = obj.limit ? parseInt(obj.limit) : env.listing.limit,
      offset = parseInt((page - 1)) * limit;

    if (obj.searchQuery) {
      /*if user is searching */
      /*result will return based on multiple conditions*/
      /*username, os, browser, ip*/
      match.$or = [
        { username: { $regex: obj.searchQuery, $options: "i" } },
        { os: { $regex: obj.searchQuery, $options: "i" } },
        { "browser.family": { $regex: obj.searchQuery, $options: "i" } },
        { ip: { $regex: obj.searchQuery, $options: "i" } }
      ];
    }

    if(obj.type){
      /*get logs based on log types*/
      match.type = obj.type;
    }
    /**date Filter */
    if (obj.startDate && obj.endDate) {
      match.created_at = {
        "$gte": _moment.addDuration(obj.startDate, 'prev'),
        "$lt": _moment.addDuration(obj.endDate, 'next')
      }
    }

    async.parallel({
      logs: (callback) => {
        /*query to get all logs data - limited at a time*/
        Log.find(match).sort({ created_at: -1 })
          .skip(offset)
          .limit(limit).exec(callback);
      },
      count: (callback) => {
        /*Count all data in database*/
        Log.count(match).exec(callback);
      }
    }, (err, result) => {
      if (err) res.status(412).json({ type: "error", message: Error.oops(), errors: Error.pull(err) });
      if (result) res.json({ type: true, message: (result.logs && result.logs.length) ? "Logs have been sent." : "No Notification Found", data: result });
    });
  }

  /**
   * This will return all recorded audit logs data
   * @param  {[type]} req queried data
   * @param  {[object]} res.json to retunr response
   * @return {[object]}     list of all audit logs
   */
  getAuditLogs(req, res) {
    let user = req.user,
      match = {type:"audit"},
      obj = req.query,
      page = obj.page ? obj.page : 1,
      limit = obj.limit ? parseInt(obj.limit) : env.listing.limit,
      offset = parseInt((page - 1)) * limit;

    if (obj.searchQuery) {
      /*if user is searching */
      /*result will return based on multiple conditions*/
      /*username, os, browser, ip*/
      match.$or = [
        { comment: { $regex: obj.searchQuery, $options: "i" } },
        { os: { $regex: obj.searchQuery, $options: "i" } },
        { "browser.family": { $regex: obj.searchQuery, $options: "i" } },
        { ip: { $regex: obj.searchQuery, $options: "i" } }
      ];
    }
    /**date Filter */
    if (obj.startDate && obj.endDate) {
      match.created_at = {
        "$gte": _moment.addDuration(obj.startDate, 'prev'),
        "$lt": _moment.addDuration(obj.endDate, 'next')
      }
    }
    async.parallel({
      logs: (callback) => {
        /*query to get all logs data - limited at a time*/
        Log.aggregate([
          { $lookup : { from: "admins", localField: "userId", foreignField: "_id", as : "_Admin" } },
          { $unwind : "$_Admin" },
          { $match: match },
          { $project: {ip:1, browser:1, os:1, "_Admin.firstname":1, "_Admin.email":1, comment:1, created_at:1} },
          { $sort : { created_at : -1 } },
          { $skip : offset },
          { $limit: limit }
        ]).exec(callback);
      },
      count: (callback) => {
        /*Count all data in database*/
        Log.count(match).exec(callback);
      }
    }, (err, result) => {
      if (err) res.status(412).json({ type: "error", message: Error.oops(), errors: Error.pull(err) });
      if (result) res.json({ type: true, message: (result.logs && result.logs.length) ? "Logs have been sent." : "No Notification Found", data: result });
    });
  }

  /**export Login logs */
  exportLoginLogsCsv(req, res) {
    let user = req.user,
      match = { type: "login" },
      obj = req.query,
      page = obj.page ? obj.page : 1,
      limit = obj.limit ? parseInt(obj.limit) : env.listing.limit,
      offset = parseInt((page - 1)) * limit,
      csvType = "LoginLogs",
      fields = ["Username", "Password", "OS", "IP", 'Browser', "Created_At", "Is_Logged_In"];

    if (obj.searchQuery) {
      /*if user is searching */
      /*result will return based on multiple conditions*/
      /*username, os, browser, ip*/
      match.$or = [
        { comment: { $regex: obj.searchQuery, $options: "i" } },
        { os: { $regex: obj.searchQuery, $options: "i" } },
        { "browser.family": { $regex: obj.searchQuery, $options: "i" } },
        { ip: { $regex: obj.searchQuery, $options: "i" } }
      ];
    }
    /**date Filter */
    if (obj.startDate && obj.endDate) {
      match.created_at = {
        "$gte": _moment.addDuration(obj.startDate, 'prev'),
        "$lt": _moment.addDuration(obj.endDate, 'next')
      }
    }
    

    /*query to get all logs data - limited at a time*/
    Log.aggregate([
      { $match: match },
      {
        $project: {
          _id:0,
          Username: "$username", Password: "$password", OS: "$os",
          IP: "$ip", Browser: "$browser.family",
          "Created_At": { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          "Is_Logged_In": {
            $cond: { if: { $eq: ["$status", true] }, then: "True", else: "False" }
          }
        }
      },
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: limit }
    ]).then((data) => {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(data);
        /* create csv folder dynamically if not exist*/
        if (!fs.existsSync(path.resolve('./uploads/csv'))) {
          fs.mkdirSync(path.resolve('./uploads/csv'));
        }

        fs.writeFile(path.resolve(`./uploads/csv/exported${csvType}.csv`), csv, (err, CSVFile) => {
          if (err) throw (err);
          let filePath = env.base_url + `csv/exported${csvType}.csv`
          return res.json({ type: "success", message: `${csvType} csv`, data: filePath });
        });

      })
      .catch((err) => res.status(412).json({ type: "error", message: Error.oops(), error: err }))

  }
/**export audit logs */
  exportAuditLogsCsv(req, res) {
    let user = req.user,
      match = { type: "audit" },
      obj = req.query,
      page = obj.page ? obj.page : 1,
      limit = obj.limit ? parseInt(obj.limit) : env.listing.limit,
      offset = parseInt((page - 1)) * limit,
      csvType = "AuditLogs",
      fields = ["Username", "Email", "OS", "IP", 'Browser', "Created_At", "Message"];

    if (obj.searchQuery) {
      /*if user is searching */
      /*result will return based on multiple conditions*/
      /*username, os, browser, ip*/
      match.$or = [
        { comment: { $regex: obj.searchQuery, $options: "i" } },
        { os: { $regex: obj.searchQuery, $options: "i" } },
        { "browser.family": { $regex: obj.searchQuery, $options: "i" } },
        { ip: { $regex: obj.searchQuery, $options: "i" } }
      ];
    }
    /**date Filter */
    if (obj.startDate && obj.endDate) {
      match.created_at = {
        "$gte": _moment.addDuration(obj.startDate, 'prev'),
        "$lt": _moment.addDuration(obj.endDate, 'next')
      }
    }
    /*query to get all logs data - limited at a time*/
    Log.aggregate([
      { $match: match },
      { $lookup: { from: "admins", localField: "userId", foreignField: "_id", as: "_Admin" } },
      { $unwind: "$_Admin" },
      {
        $project: {
          _id: 0, IP: "$ip", Browser: "$browser.family", OS: "$os",
          Username: { $concat: ["$_Admin.firstname", "  ", "$_Admin.lastname"] },
          Email: "$_Admin.email", Message: "$comment",
          "Created_At": { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        }
      },
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: limit }
    ])
      .then((data) => {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(data);
        /* create csv folder dynamically if not exist*/
        if (!fs.existsSync(path.resolve('./uploads/csv'))) {
          fs.mkdirSync(path.resolve('./uploads/csv'));
        }

        fs.writeFile(path.resolve(`./uploads/csv/exported${csvType}.csv`), csv, (err, CSVFile) => {
          if (err) throw (err);
          let filePath = env.base_url + `csv/exported${csvType}.csv`
          return res.json({ type: "success", message: `${csvType} csv`, data: filePath });
        });

      })
      .catch((err) => res.status(412).json({ type: "error", message: Error.oops(), error: err }))

  }
  /**get list  */
  getAAccessLogs(req, res) {
    /**match  */
    let obj = req.query,
      projection = { created_at: 1},
      sortBy = { "created_at": -1 };

    var queryObj = JSON.parse(obj.queryObj);

    /**check if userid is valid or not */
    if (!ObjectId.isValid(queryObj.userId)) return res.status(412).json({ type: "error", message: Error.oops(), errors: ["Invalid UserId"] })
     
    queryObj.userId = ObjectId(queryObj.userId);    
    /**make clone of queryObj.browser and assign in browser variable and then delete it  */
    let browser = JSON.parse(JSON.stringify(queryObj.browser));
    delete queryObj.browser;
    let match = { $and: [queryObj, {"browser.family": browser}]};
    /**Serach */
    if (obj.searchQuery) {
      match.title = new RegExp(obj.searchQuery, 'i');
    }

    /** filter dropdown */
    if (obj.filter == 1) {
      match.status = true
    }
    else if (obj.filter == 0) {
      match.status = false
    }

    async.parallel({
      log: (_callback) => {
        Log.findOne(match, { url: 1, "browser.family": 1, os: 1, timezone: 1, ip: 1 }, (err, response) => {
          if (err) return _callback(err)
          if (response) return _callback(null, response)
        })
      },
      user: (_callback) => {
        Admin.findOne({ _id: queryObj.userId},{firstname:1,username:1,lastname:1,email:1},(err,response)=> {
          if (err) return _callback(err)
          if (response) return _callback(null, response)
        })
      },
      count: (_callback) => {
        Log.count(match).then(response => _callback(null, response))
          .catch(err => _callback(err));
      },
      list: (_callback) => {
        /**pagination */
        var limit = obj.limit ? parseInt(obj.limit) : env.listing.limit;//results per page
        var page = (obj.page) ? parseInt(obj.page) : 1;//offset
        var offset = (page - 1) * limit;

        Log.aggregate([
          {
            $match: match
          },
          {
            $project: projection
          },
          {
            $sort: sortBy
          },
          {
            $skip: offset
          },
          {
            $limit: limit
          }

        ]).then(response => {
          return response.length ? _callback(null, response) : _callback("No Data Found")
        }) 
          .catch(err => _callback(err));
      }
    }, (err, results) => {

      if (err) return res.status(412).json({ type: "error", message: "Oops something went wrong!", error:Error.pull(err) });
      return res.json({ type: "success", message: "Log list ", data: results });
    });
  }

  
  /**get list of access log  */
  getAccessLogs(req, res) {
    /**match  */
    let obj = req.query,
      sortBy = { "created_at": -1 },
      match={};
    /**Serach */
    if (obj.searchQuery) {
      match = {
        $or: [
          { "_id.url": new RegExp(obj.searchQuery, 'i') },
          { "_id.timezone": new RegExp(obj.searchQuery, 'i') },
          { "_id.os": new RegExp(obj.searchQuery, 'i') },
          { "_id.ip": new RegExp(obj.searchQuery, 'i') },
          { "_id.browser": new RegExp(obj.searchQuery, 'i') },
          { "user.firstname": new RegExp(obj.searchQuery, 'i') },
          { "user.email": new RegExp(obj.searchQuery, 'i') }
        ]
      }
    }
    // console.log("match", match)
    async.parallel({
      count: (_callback) => {

        Log.aggregate([
          { $match: { type: "access" } },
          {
            $group: {
              _id: {
                timezone: '$timezone',
                ip: '$ip',
                url: '$url',
                browser: '$browser.family',
                userId: "$userId",
                status: "$status",
                os: "$os"
              },
            }
          },
          {
            $count:"count"
          }
           
        ]).then(response => _callback(null, response[0].count))
          .catch(err => _callback(err));
      },
      list: (_callback) => {
        /**pagination */
        var limit = obj.limit ? parseInt(obj.limit) : env.listing.limit;//results per page
        var page = (obj.page) ? parseInt(obj.page) : 1;//offset
        var offset = (page - 1) * limit;

        Log.aggregate([
          { $match: { type: "access" } },
          {
            $group: {
              _id: {
                timezone: '$timezone',
                ip: '$ip',
                url: '$url',
                browser: '$browser.family',
                userId: "$userId",
                status: "$status",
                os: "$os",
                ip:"$ip"
              },
              count: { $sum: 1 }
            }
          },
          {
            $lookup:
              {
                from: "admins",
                localField: "_id.userId",
                foreignField: "_id",
                as: "user"
              }
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          { $project: { "user.email": 1, "user.firstname": 1, "user.lastname": 1, "user._id": 1, _id: 1, count: 1 } },
          {$match:match},
          {
            $sort: sortBy
          },
          {
            $skip: offset
          },
          {
            $limit: limit
          }

        ]).then(response => _callback(null, response))
          .catch(err => _callback(err));
      }
    }, (err, results) => {
      if (err) res.status(412).json({ type: "error", message: "Oops something went wrong!", error: Error.pull(err) });
      return res.json({ type: "success", message: "Log list ", data: results });
    });
  }

  /**to get csv file of access logs */
  exportAccessLogsCsv(req, res) {
    let obj = req.query,
      sortBy = { "created_at": -1 },
      match = {},
      page = obj.page ? parseInt(obj.page) : 1,
      limit = obj.limit ? parseInt(obj.limit) : env.listing.limit,
      offset = parseInt((page - 1)) * limit,
      csvType = "AccessLogs",
      fields = ["Username", "Email", "URL", "Count", 'Browser', "OS", "Timezone", "IP"];

    /**Serach */
    if (obj.searchQuery) {
      match = {
        $or: [
          { "URL": new RegExp(obj.searchQuery, 'i') },
          { "Timezone": new RegExp(obj.searchQuery, 'i') },
          { "OS": new RegExp(obj.searchQuery, 'i') },
          { "IP": new RegExp(obj.searchQuery, 'i') },
          { "Browser": new RegExp(obj.searchQuery, 'i') },
          { "Username": new RegExp(obj.searchQuery, 'i') },
          { "Email": new RegExp(obj.searchQuery, 'i') }
        ]
      }
    }
  
    /*query to get all logs data - limited at a time*/
    Log.aggregate([
      { $match: { type: "access" } },
      {
        $group: {
          _id: {
            timezone: '$timezone',
            ip: '$ip',
            url: '$url',
            browser: '$browser.family',
            userId: "$userId",
            status: "$status",
            os: "$os",
            ip: "$ip"
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup:
          {
            from: "admins",
            localField: "_id.userId",
            foreignField: "_id",
            as: "user"
          }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          Username: { $concat: ["$user.firstname", "  ", "$user.lastname"] },
          Count: "$count", Email: "$user.email", URL: "$_id.url",
          Browser: "$_id.browser", OS: "$_id.os", Timezone: "$_id.timezone", IP: "$_id.ip"
        }
      }, 
      { $match: match },
      { $skip: offset },
      { $limit: limit }
    ])
      .then((data) => {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(data);
        /* create csv folder dynamically if not exist*/
        if (!fs.existsSync(path.resolve('./uploads/csv'))) {
          fs.mkdirSync(path.resolve('./uploads/csv'));
        }

        fs.writeFile(path.resolve(`./uploads/csv/exported${csvType}.csv`), csv, (err, CSVFile) => {
          if (err) throw (err);
          let filePath = env.base_url + `csv/exported${csvType}.csv`
          return res.json({ type: "success", message: `${csvType} csv`, data: filePath });
        });

      })
      .catch((err) => res.status(412).json({ type: "error", message: Error.oops(), error: err }))

  }

  /**
   * Save Logs of Guest/User who is
   * trying to login as Admin
   *
   * @static - saveOne
   * 
   * @return {[type]}     Returns the Object to acknowledge that notification is saved
   */
  static saveOne(obj) {
    new Log(obj).save()
      .then(result => true)
      .catch(err => false);
  }

  /**
   * Save Audit Logs of User who is
   * changing data
   *
   * @static - trackActivity
   * 
   * @return {[type]}     Returns the Object to acknowledge that log is saved
   */
  
  trackActivity(req, res) {
    let obj = req.body, user=req.user;
    /**save Log details */
    LogsController.saveOne({ userId: user._id, type: obj.type, comment: obj.comment, ip: this.cleanIP(req.connection.remoteAddress), browser: useragent.parse(req.headers['user-agent']), os: os.type(), status: true });
    res.send(true);
  }          
}

module.exports = LogsController;