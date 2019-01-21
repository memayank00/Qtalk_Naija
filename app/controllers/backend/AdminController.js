const crypto = require("crypto"),
  path = require("path"),
  mongoose = require("mongoose"),
  os = require("os"),
  { detect } = require("detect-browser"),
  HostPath = require(path.resolve(`./app/config/libs/hostPath`)),
  useragent = require("useragent"),
  jwt = require("jsonwebtoken"),
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
  secret = env.secret,
  async = require("async"),
  /**Collections */
  Admin = require(path.resolve("./app/models/admin")),
  Role = require(path.resolve("./app/models/role")),
  Settings = require(path.resolve("./app/models/settings")),
  Requests = require(path.resolve("./app/models/requestsAdmin")),
  JWT = require(path.resolve("./app/config/libs/jwt")),
  App = require(path.resolve("./app/controllers/backend/AppController")),
  Notification = require(path.resolve(
    "./app/controllers/backend/NotificationController"
  )),
  Logs = require(path.resolve("./app/controllers/backend/LogsController")),
  needle = require("needle"),
  WrapData = require(path.resolve("./app/config/libs/wrapData")),
  shared = require("../../config/libs/shared"),
  _moment = require(path.resolve(`./app/config/libs/date`)),
  Mailer = require(path.resolve("./app/config/libs/mailer")),
  ERROR = require(path.resolve(`./app/config/libs/error`)),
  formidable = require("formidable"),
  Cloudinary = require(path.resolve("./app/config/libs/cloudinary")),
  ObjectId = mongoose.Types.ObjectId;

class AdminController extends App {
  constructor() {
    super();

    /*init logs*/
    /* this.Logs = new Logs(); */
    this.browser = detect();

    this.login = this.login.bind(this);
    this.requestAccess = this.requestAccess.bind(this);
    this.verifyAccesToken = this.verifyAccesToken.bind(this);
    this.validateSession = this.validateSession.bind(this);
    this.logout = this.logout.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }
  /**Add/Edit Adminuser */
  addEditAdmin(req, res) {
    /**to randomly generate a password */
    let randomString = function randomString(length, chars) {
      var result = "";
      for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    };
    let randomPassword =
      randomString(
        5,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      ) +
      randomString(1, "0123456789") +
      randomString(1, "!@#$%^&*") +
      randomString(1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");

    let obj = Object.assign({}, req.body);
    /**to cahnge role Id id into ObjectId */
    if (obj.role) obj.role._id = ObjectId(obj.role._id);

    let message,
      match = { email: obj.email },
      toSet = Object.assign({}, obj);
    /**to encrypte password for new admin */
    if (!obj._id) {
      // to set random  password for new user
      toSet.password = crypto
        .createHmac("sha512", env.secret)
        .update(randomPassword)
        .digest("base64");
      message =
        "User has been added. Login credentials have been sent to the entered email id";
    }

    /**Edit a User/Admin */
    if (obj._id) {
      match = { _id: obj._id };
      message = "User Updated Succesfully";
    }

    /**to delete profile image */
    if (obj._id && obj.public_id) {
      Cloudinary.deleteFile(obj.public_id);
      match = { _id: obj._id };
      message = "Profile Image has been deleted Successfully";
      toSet = { $set: { image: {} } };
    }

    Admin.count({ email: obj.email })
      .then(preResult => {
        /**in case of edit set preResulit to null */
        if (obj._id) preResult = null;
        /**in case of new admin registrtion return if email already exists */
        if (preResult)
          return res
            .status(412)
            .json({
              type: "error",
              message: "Email Id already exists",
              error: []
            });
        else {
          Admin.findOneAndUpdate(
            match,
            toSet,
            {
              projection: { password: 0 },
              upsert: true,
              new: true,
              runValidators: true,
              context: "query",
              setDefaultsOnInsert: true
            },
            (err, result) => {
              if (err)
                return res
                  .status(412)
                  .json({
                    type: "error",
                    message: "We couldn't proceed with this request.",
                    error: ERROR.pull(err)
                  });
              /**send email to new admin */
              if (result && !obj._id) {
                let loginLink = env.base_url + "admin";
                Mailer.Email(obj.email, "newAdmin", "app/views/", {
                  body: {
                    name: result.firstname,
                    loginLink: loginLink,
                    userName: result.username,
                    password: randomPassword
                  },
                  subject: "Welcome to - " + env.constants.app
                });
              }

              return res.json({
                type: "success",
                message: message,
                data: result
              });
            }
          );
        }
      })
      .catch(err =>
        res
          .status(412)
          .json({ type: "error", message: ERROR.oops(), error: [] })
      );
  }

  ChangeAdminAvtar(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      /**to parse data from fromdata */
      let obj = JSON.parse(fields.data);

      /**to upload file on cloudinary */
      if (Object.keys(files).length) {
        Cloudinary.uploadFile(files.file.path, files.file.name).then(
          cdnImage => {
            /**to get particular fields from uploaded output */
            let imageLink = {
                secure_url: cdnImage.secure_url,
                public_id: cdnImage.public_id,
                url: cdnImage.url
              },
              match = { _id: ObjectId(obj.userID) },
              toSetData = { $set: { image: imageLink } },
              project = {
                _id: 1,
                mobile: 1,
                username: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                image: 1,
                status: 1,
                role: 1
              },
              message = "Image Uploaded Succesfully";

            Admin.findOneAndUpdate(
              match,
              toSetData,
              { projection: project, new: true },
              (err, result) => {
                if (err)
                  res
                    .status(412)
                    .json({ type: "error", message: ERROR.cant() });
                return res.json({
                  type: "success",
                  message: message,
                  data: result
                });
              }
            );
          }
        );
      } else return res.status(412).json({ type: "error", message: ERROR.cant() });
    });
  }

  /**delete an admin */
  deleteAAdmin(req, res) {
    Admin.findOne({ _id: req.body._id }).remove((err, result) => {
      if (err)
        res
          .status(412)
          .json({
            type: "error",
            message: "We couldn't proceed with this request."
          });
      return res.json({
        type: "success",
        message: "Deleted Suceesfully",
        data: result
      });
    });
  }

  /**
   * method : POST
   * endpoint: /admin_api/login
   * @param {username} req
   * @param {password} req
   */
  login(req, res) {
    let obj = req.body;

    async.waterfall(
      [
        //   to check reCAPTCHA
        callback => {
          /* UNCOMMENT ME FOR ENABLING CAPTCHA
              let data= {
                  secret: env.Captcha.key,
                  response: req.body.captcha
              }
            needle.post('https://www.google.com/recaptcha/api/siteverify', data, {}, function (err, resp) {        
                if (err) callback({ message: ERROR.oops(), error: err }, null);
                if (!resp.body.success) callback({ message: ERROR.oops(), error: err }, null);

               
                 callback(null,req.body);
            });
            */

          /* COMMENT ME FOR ENABLING CAPTCHA */
          callback(null, req.body);
        },
        (loginObj, callback) => {
          let match = { $or: [{ username: obj.email }, { email: obj.email }] };

          let projection = {
            _id: 1,
            mobile: 1,
            username: 1,
            firstname: 1,
            lastname: 1,
            password: 1,
            email: 1,
            image: 1,
            status: 1,
            role: 1
          };

          Admin.findOne(match, projection, (err, user) => {
            if (err) callback({ message: ERROR.oops(), error: err }, null);
            if (!user || !user.matchPassword(obj.password))
              callback({ message: "Invalid Email/Username or Password" }, null);
            else if (!user.status)
              callback({ message: "Your account is not active yet." }, null);
            else callback(null, user);
          });
        },
        (user, callback) => {
          /**to generate jwt token */

          /**JWT Payload */
          let payload = {
            _id: user._id,
            email: user.email,
            username: user.username,
            lastname: user.lastname,
            firstname: user.firstname
          };

          let token = jwt.sign(payload, secret, { expiresIn: "14 days" });

          /**to get permissions assigned to a role */
          Role.findOne(
            { _id: user.role._id },
            { _id: 0, permissions: 1, status: 1 },
            (err, data) => {
              /** if status of role is false(inactive) */
              if (data && !data.status)
                callback(
                  { message: "Your Permissions has been changed" },
                  null
                );
              /** if status of role is true(active) */ else if (
                data &&
                data.status
              )
                callback(null, user, data.permissions, token);
              /** no data(ROLE ) found or some error occured  */ else
                callback({ message: "something went wrong" }, null);
            }
          );
        }
      ],
      (err, user, permissions, token) => {
        let status = !err ? true : false;
        /*Log Login Request...*/
        Logs.saveOne({
          username: obj.email,
          password: obj.password,
          ip: this.cleanIP(req.connection.remoteAddress),
          browser: useragent.parse(req.headers["user-agent"]),
          os: os.type(),
          status: status,
          metadata: { color: "info" }
        });

        if (err)
          return res
            .status(412)
            .json({ type: "error", message: err.message, errors: [] });

        /*Save Admin User Login Time...*/
        Admin.promptLoginTime(user._id);

        /**to clone and set object for final data */
        let userResult = JSON.parse(JSON.stringify(user));
        if (userResult.password) delete userResult.password;
        res.json({
          success: true,
          message: "You've been authenticated successfully.",
          data: userResult,
          token: token,
          permissions: permissions
        });
      }
    );
  }

  /**
   * Logout a User and Store Audit Logs
   * @param {*} req
   * @param {*} res
   */
  logout(req, res) {
    let user = req.user;
    /**save Log details */
    Logs.saveOne({
      userId: user._id,
      type: "audit",
      comment: "Successfully logged out",
      ip: this.cleanIP(req.connection.remoteAddress),
      browser: useragent.parse(req.headers["user-agent"]),
      os: os.type(),
      status: true
    });
    res.send(true);
  }

  forgotPassword(req, res) {
    let reqData = req.body,
      hash = shared.random(4, true), //randomly generated otp
      crietiera = { email: reqData.email },
      resestQuery = shared.random(10); //randomly generated querylink
    Admin.findOne(crietiera, (err, admin) => {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      } else {
        if (admin && admin.email) {
          Admin.findOneAndUpdate(
            { email: admin.email },
            {
              $set: {
                otp: hash,
                resetKey: resestQuery,
                otpValidity: _moment.futureDate(new Date(), "x", 120, "m")
              }
            },
            (err, result) => {
              if (result) {
                // let baseUrl = `${req.protocol}://${req.headers.host}`;
                let resetLink =`${HostPath.host(req)}manager/reset-password/${resestQuery}`;
                 /*  env.admin_url + "/reset-password/" + resestQuery; */
                Mailer.Email(admin.email, "forgot-password", "app/views/", {
                  body: {
                    otp: hash,
                    resetLink: resetLink,
                    name: result.firstname
                  },
                  subject: "Forgot Your Password - Admin "
                });
                return res.json({
                  type: "success",
                  message: `OTP has been sent to your email address.`
                });
              } else {
                return res.json({
                  type: "error",
                  message: "We couldn't send you OTP. Please try again later."
                });
              }
            }
          );
        } else {
          return res
            .status(412)
            .json({
              type: "error",
              message: "We couldn't find your account.",
              errors: []
            });
        }
      }
    });
  }

  resetPassword(req, res) {
    let obj = req.body,
      match = { $and: [{ otp: obj.otp }, { resetKey: obj.resetQuery }] },
      projection = { otp: 1, otpValidity: 1 };
    Admin.findOne(match, projection, (err, admin) => {
      if (err)
        return res.status(500).json({ type: "error", message: err.message });
      let hashpassword = Admin.hashPassword(obj.newPassword);
      if (admin) {
        /*if OTP used within 2 hrs expired*/
        if (admin.otpValidity >= _moment.timestamp()) {
          /*if we found the user within 2 hrs of otp sent (to update password)*/
          Admin.findOneAndUpdate(
            {
              _id: mongoose.Types.ObjectId(admin._id)
            },
            {
              password: hashpassword,
              $unset: {
                otp: 1,
                resetKey: 1
              }
            },
            (err, result) => {
              if (result) {
                return res.json({
                  type: "success",
                  message: "Your password has been changed."
                });
              } else {
                return res
                  .status(412)
                  .json({
                    type: "success",
                    message:
                      "We couldn't perform this action. Please try again later."
                  });
              }
            }
          );
        } else {
          return res
            .status(412)
            .json({
              type: "error",
              message: "Your OTP and reset link has been expired"
            });
        }
      } else {
        /*account not found - invalid OTP*/
        return res
          .status(412)
          .json({ type: "error", message: "Your OTP is Invalid." });
      }
    });
  }

  changePassword(req, res) {
    let obj = req.body,
      _id = req.user._id,
      match = { _id: ObjectId(_id) };

    /*check if password supplied*/
    if (obj.password && obj.currentPassword) {
      Admin.findOne(match, (err, user) => {
        /*If current password matches with saved one*/
        if (user && user.matchPassword(obj.currentPassword)) {
          Admin.update(
            match,
            {
              $set: {
                password: user.encryptPassword(obj.password)
              }
            },
            (err, update) => {
              if (update) {
                /*send notificaiton of change password*/
                obj.icon = "lock";
                Notification.saveOne({
                  title: Notification.getNotification("CHANGE_PASSWORD").title,
                  read: false,
                  type: 11,
                  userId: _id,
                  metadata: {
                    color: this.getColor(),
                    icon: obj.icon ? obj.icon : this.getNotificaionIcon()
                  }
                });
                return res.json({
                  success: true,
                  message: "Your password has been changed successfully."
                });
              } else {
                return res
                  .status(412)
                  .json({ success: false, message: "Some errors occurred" });
              }
            }
          );
        } else
          return res.json({
            success: false,
            message: "Your old password does not match."
          });
      });
    } else
      return res
        .status(412)
        .json({ success: false, msg: "Please provide password" });
  }

  /**get admins list */
  getAdmins(req, res) {
    /**match  */
    let obj = req.query;
    let match = {},
      sortBy = { created_at: -1 },
      projection = {
        firstname: 1,
        lastname: 1,
        email: 1,
        created_at: 1,
        status: 1,
        mobile: 1,
        username: 1,
        type: 1,
        "roleTitle.title": 1
      };

    /**Search */
    if (obj.searchQuery) {
      match = {
        $or: [
          { email: new RegExp(obj.searchQuery, "i") },
          { firstname: new RegExp(obj.searchQuery, "i") },
          { mobile: new RegExp(obj.searchQuery, "i") },
          { lastname: new RegExp(obj.searchQuery, "i") }
        ]
      };
    }
    /** filter dropdown */
    if (obj.filter == 1) {
      match.status = true;
    } else if (obj.filter == 0) {
      match.status = false;
    }

    /**to get results on basis of role */
    if (ObjectId.isValid(obj.roleId)) {
      match["role._id"] = ObjectId(obj.roleId);
    }
    /**date Filter */
    if (obj.startDate && obj.endDate) {
      match.created_at = {
        $gte: _moment.addDuration(obj.startDate, "prev"),
        $lt: _moment.addDuration(obj.endDate, "next")
      };
    }
    /**sortBY  */
    if (obj.sortBy === "firstname") {
      sortBy = { firstname: -1 };
    }
    async.parallel(
      {
        adminCount: _callback => {
          Admin.count(match)
            .then(response => _callback(null, response))
            .catch(err => _callback(err));
        },
        admins: _callback => {
          //pagination
          var limit = obj.limit ? parseInt(obj.limit) : env.listing.limit; //results per page
          var page = obj.page ? parseInt(obj.page) : 1; //offset
          var offset = (page - 1) * limit;

          Admin.aggregate([
            {
              $match: match
            },
            {
              $skip: offset
            },
            {
              $limit: limit
            },
            {
              $sort: sortBy
            },
            {
              $lookup: {
                from: "roles",
                localField: "role._id",
                foreignField: "_id",
                as: "roleTitle"
              }
            },
            { $unwind: { path: "$roleTitle" } },
            {
              $project: projection
            }
          ])
            .then(response => _callback(null, response))
            .catch(err => _callback(err));
        }
      },
      (err, results) => {
        if (err)
          res
            .status(412)
            .json({
              type: "error",
              message: "Oops something went wrong!",
              error: err
            });
        return res.json({
          type: "success",
          message: "Admins list ",
          data: results
        });
      }
    );
  }

  /**get details of a single admin */
  getAAdmin(req, res) {
    let adminID = req.query.id || null;
    if (!ObjectId.isValid(adminID))
      return res
        .status(412)
        .json({
          type: "error",
          message: "Invalid Admin Id",
          errors: ["invalid Admin id"]
        });

    let match = { _id: ObjectId(adminID) },
      message = "we got admin",
      projection = {
        firstname: 1,
        lastname: 1,
        email: 1,
        status: 1,
        role: 1,
        mobile: 1,
        username: 1
      };

    Admin.findOne(match, projection, (err, admin) => {
      if (err) res.json({ type: "error", message: err.message });
      if (admin) {
        res.json({ type: "success", message: message, data: admin });
      } else {
        res.json({ type: "error", message: "No such admin found", data: [] });
      }
    });
  }

  /**
   * validateSession - validate user request to access admin panel agianst IP address
   */

  validateSession(req, res) {
    /**/

    let IP = this.cleanIP(req.connection.remoteAddress);
    Settings.count(
      {
        meta_key: "IPManage",
        "meta_value.whiteList.value": IP
      },
      (err, result) => {
        /**return if ip is listed in the whitelist */
        if (result) return res.json({ __ack: result ? "W" : false });
        /**else check for th BlackList IP */ else {
          Settings.count(
            {
              meta_key: "IPManage",
              "meta_value.blackList.value": IP
            },
            (err, result) => {
              return res.json({ __ack: result ? "B" : false });
            }
          );
        }
      }
    );
  }

  /**
   * requestAccess - requesting for access to use admin panel
   */

  requestAccess(req, res) {
    let obj = {
      ip: this.cleanIP(req.connection.remoteAddress),
      otp: shared.random(32),
      os: os.type(),
      email: req.query.email,
      browser: this.browser.name
    };

    async.waterfall(
      [
        _callback => {
          /*Stage 1 - verify if admin exists*/
          Admin.findOne(
            { email: obj.email },
            { firstname: 1, lastname: 1, email: 1, _id: 0 },
            (err, admin) => {
              if (admin) {
                /*Access request is from genuine admin*/
                _callback(null, admin);
              } else {
                _callback("You're not allowed to access this request.");
              }
            }
          );
        },
        (admin, _callback) => {
          /*Stage 2 - generate access token and send to admin*/
          /*register a new access request*/
          Requests.findOneAndUpdate(
            {
              ip: this.cleanIP(obj.ip),
              email: obj.email
            },
            {
              otp: obj.otp,
              os: obj.os,
              browser: obj.browser
            },
            {
              upsert: true,
              new: true
            },
            (err, newreq) => {
              if (newreq) {
                Mailer.Email(
                  admin.email,
                  "request-admin-access",
                  "app/views/",
                  {
                    body: { OTP: obj.otp, email: admin.email },
                    subject: "Admin Access Request"
                  }
                );
                _callback(null, true);
              } else {
                _callback(
                  "Unable to generate access token. Please try again later."
                );
              }
            }
          );
        }
      ],
      (err, result) => {
        if (result)
          res.json({
            type: "success",
            message: "We've sent an OTP on your registered email address."
          });
        if (err)
          res
            .status(412)
            .json({
              type: "error",
              message: ERROR.oops(),
              errors: ERROR.pull(err)
            });
      }
    );
  }

  /**
   * verifyAccesToken - verify user access token to accessing the admin panel
   */

  verifyAccesToken(req, res) {
    let obj = req.query;
    Requests.findOne(
      {
        email: obj.email,
        ip: this.cleanIP(req.connection.remoteAddress)
      },
      (err, request) => {
        if (request) {
          /*if request found*/
          if (request.otp === obj.otp) {
            /*if token is valid*/
            Settings.registerIP(this.cleanIP(req.connection.remoteAddress));
            Requests.nullotp(obj.email);
            res.json({
              type: "success",
              message:
                "OTP has been verified. You can now login into admin panel."
            });
          } else {
            res
              .status(412)
              .json({
                type: "error",
                message: ERROR.oops(),
                errors: ["You've entered incorrect token."]
              });
          }
        } else {
          res
            .status(412)
            .json({
              type: "error",
              message: ERROR.oops(),
              errors: ERROR.pull(err)
            });
        }
      }
    );
    /**/
  }
}

module.exports = AdminController;
