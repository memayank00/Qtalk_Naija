'use strict';

const path          = require('path'),
    fs              = require('fs'),
    JWT             = require(path.resolve("./app/config/libs/jwt")),
    expressJWT      = require('express-jwt'),
    env             = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    api_path        = env.API.site,
    admin_api_path  = env.API.admin;

class AppRouter {
    constructor(app, router){
        this.call = {
            frontend : {},
            backend: {}
        };
        this.frontend = {};
        this.backend = {};

        /**/
        this.api_path = api_path;
        this.admin_api_path = admin_api_path;

        /**/
        this.app = app;
        this.router = router;
    }


    loadAppClasses(){
        fs.readdirSync(path.resolve('./app/controllers/frontend')).forEach(file => {
            let name = file.substr(0, file.indexOf('.'));
            /*Store Classes in frontend object*/
            this.frontend[name] = require(path.resolve(`./app/controllers/frontend/${name}`));
            /*Init All Classes & add Object to Array*/
            this.call['frontend'][name] = new this.frontend[name]();
        });
    }

     /** to load all the classes of backend directory */
    loadAdminClasses() {
        fs.readdirSync(path.resolve("./app/controllers/backend")).forEach(file => {
            let name = file.substr(0, file.indexOf("."));
            /*Store Classes in backend object*/
            this.backend[name] = require(path.resolve(`./app/controllers/backend/${name}`));
            
            /*Init All Classes & add Object to Array*/
            this.call['backend'][name] = new this.backend[name]();
        });
    }

    unlessRoutes(){
        this.router.use(expressJWT({
            secret: env.secret //new Buffer(env.secret).toString('base64'),
        }).unless({
            path: [
                this.api_path+'user-login',
                this.api_path+'user-signup',
                this.api_path+'verify-otp',
                this.api_path+'resend-otp',
                this.api_path+'user-forgot-password',
                this.api_path+'get-friends',
                this.api_path+'user-reset-password',
                this.api_path+'get-user-device-token',
                this.api_path + "contact-us",
                this.api_path + "get-keyword-cms",
                this.admin_api_path + "login-admin",
                this.admin_api_path + "forgot-password",
                this.admin_api_path + "reset-password",
                this.admin_api_path + "validate-session",
                this.admin_api_path + "request-access",
                this.admin_api_path + "verify-access-token",
                this.admin_api_path + "export-cms-csv",
                this.admin_api_path + "floala_image_upload",
                this.admin_api_path + "floala_image_delete",
                this.admin_api_path + "get-active-user",

             /* this.api_path+'get-users-to-alert'   */

            ]
        }));
    }

    loadAppRoutes(){
        /* forgot password */
        this.router.post('/user-forgot-password',this.call['frontend']['UserController'].forgotUserPassword);
        /* Reset password */
        this.router.post('/user-reset-password',this.call['frontend']['UserController'].resetUserPassword);
        /*User routes*/
        this.router.post('/user-login', this.call['frontend']['UserController'].userLogin);
        this.router.post('/user-logout', this.call['frontend']['UserController'].userLogout);
        this.router.post('/user-signup', this.call['frontend']['UserController'].userSignup);
        this.router.post('/verify-otp', this.call['frontend']['UserController'].verifyOTP);
        this.router.post('/resend-otp', this.call['frontend']['UserController'].resendOTP);
        //this.router.post('/add-user-notes', this.call['frontend']['UserController'].addUserNotes);
        this.router.get('/other-user-details', this.call['frontend']['UserController'].otherUserDetails);
        this.router.get('/user-details', this.call['frontend']['UserController'].userDetails);
        //this.router.put('/update-user-details', this.call['frontend']['UserController'].updateUserDetails);
        this.router.post('/update-profile-picture', this.call['frontend']['UserController'].updateProfilePicture);
        this.router.post('/change-password', this.call['frontend']['UserController'].changePassword);
        //this.router.post('/update-user-location', this.call['frontend']['UserController'].updateUserLocation);
        //this.router.post('/toogle-user-availability', this.call['frontend']['UserController'].toogleUserAvailability);
        //this.router.get('/get-user-device-token', this.call['frontend']['UserController'].getUserDeviceToken);
        //this.router.get('/delete-user-profile', this.call['frontend']['UserController'].deleteUserProfile);
        //this.router.post('/contact-us', this.call['frontend']['UserController'].contactUs);
        //this.router.get('/get-keyword-cms', this.call['frontend']['UserController'].getCms);
        
        /*Friend routes*/
        this.router.get('/get-all-user', this.call['frontend']['FriendController'].getAllUser);
        this.router.post('/send-friend-request', this.call['frontend']['FriendController'].sendFriendRequest);
        this.router.get('/recieved-sent-friend-request', this.call['frontend']['FriendController'].recievedSentFriendRequest);
        this.router.post('/accept-decline-friend-request', this.call['frontend']['FriendController'].acceptDeclineFriendRequest);
        this.router.post('/cancle-friend-request', this.call['frontend']['FriendController'].cancleFriendRequest);
        this.router.get('/friend-list', this.call['frontend']['FriendController'].friendList);
        this.router.get('/get-friends', this.call['frontend']['FriendController'].getFriends);
        this.router.post('/unfriend', this.call['frontend']['FriendController'].unfriend);
        /*Track List routes*/
        //this.router.get('/get-all-track-user', this.call['frontend']['MapController'].getAllTrackUser);
        this.router.post('/send-track-request', this.call['frontend']['MapController'].sendTrackRequest);
        this.router.get('/recieved-sent-track-request', this.call['frontend']['MapController'].recievedSentTrackRequest);
        this.router.post('/accept-decline-track-request', this.call['frontend']['MapController'].acceptDeclineTrackRequest);
        this.router.post('/cancle-track-request', this.call['frontend']['MapController'].cancleTrackRequest);
        this.router.get('/track-list', this.call['frontend']['MapController'].trackList);
        this.router.get('/who-track-me', this.call['frontend']['MapController'].whoTrackMe);
        this.router.post('/stop-being-track', this.call['frontend']['MapController'].stopBeingTrack);
        this.router.post('/pause-self-tracking', this.call['frontend']['MapController'].pauseSelfTracking);
        this.router.post('/get-pause-status', this.call['frontend']['MapController'].getPauseStatus);
        /*Messages routes*/
        this.router.get('/get-all-chat-list', this.call['frontend']['MessageController'].getAllChatList);
        this.router.get('/get-conversation-id', this.call['frontend']['MessageController'].getConversationId);
        this.router.post('/send-message', this.call['frontend']['MessageController'].sendMessage);
        this.router.post('/send-text-message', this.call['frontend']['MessageController'].postTextMessage);
        this.router.post('/message-trails', this.call['frontend']['MessageController'].messageTrails);
        this.router.post('/read-messages', this.call['frontend']['MessageController'].readMessages);
        this.router.post('/clear-all-chat', this.call['frontend']['MessageController'].clearAllChat);
        /*Notification routes*/
        this.router.get('/notification-view', this.call['frontend']['NotificationController'].notificationView);
        //this.router.get('/get-users-to-alert', this.call['frontend']['NotificationController'].getUsersToAlert);
        //this.router.post('/send-alert', this.call['frontend']['NotificationController'].sendAlert);
        this.router.get('/unread-notification-count', this.call['frontend']['NotificationController'].unreadNotificationCount);
        this.router.post('/update-notification-status', this.call['frontend']['NotificationController'].updateNotificationType);
        
        /*Testing Purpose*/
        //this.router.post('/async-await', this.call['frontend']['FriendController'].asyncAwait); 
        //this.router.post('/get-badge-count', this.call['frontend']['UserController'].getbadgeCount); 
    }

    loadAdminRoutes(){
        this.router.post(
            "/login-admin",
            this.call["backend"]["AdminController"].login
        );
        this.router.post(
            "/logout-admin",
            this.call["backend"]["AdminController"].logout
        );
        this.router.post(
            "/forgot-password",
            JWT.logs,
            this.call["backend"]["AdminController"].forgotPassword
        );
        this.router.post(
            "/reset-password",
            JWT.logs,
            this.call["backend"]["AdminController"].resetPassword
        );
        this.router.post(
            "/admin-change-password",
            JWT.logs,
            this.call["backend"]["AdminController"].changePassword
        );
        this.router.get(
            "/validate-session",
            JWT.logs,
            this.call["backend"]["AdminController"].validateSession
        );
        this.router.get(
            "/request-access",
            JWT.logs,
            this.call["backend"]["AdminController"].requestAccess
        );
        this.router.get(
            "/verify-access-token",
            JWT.logs,
            this.call["backend"]["AdminController"].verifyAccesToken
        );

        // /*Notifications*/
        this.router.get(
            "/get-notifications",
            this.call["backend"]["NotificationController"].getAll
        );

        /*Admin users*/
        this.router.post(
            "/add-edit-admin",
            JWT.logs,
            this.call["backend"]["AdminController"].addEditAdmin
        );
        this.router.get(
            "/get-admins",
            JWT.logs,
            this.call["backend"]["AdminController"].getAdmins
        );
        this.router.get(
            "/get-a-admin",
            JWT.logs,
            this.call["backend"]["AdminController"].getAAdmin
        );
        this.router.post(
            "/change-admin-avtar",
            JWT.logs,
            this.call["backend"]["AdminController"].ChangeAdminAvtar
        );

        // /**ROLE */
        this.router.post(
            "/add-edit-role",
            JWT.logs,
            this.call["backend"]["RoleController"].addEditRole
        );
        this.router.get(
            "/get-roles",
            JWT.logs,
            this.call["backend"]["RoleController"].getRoles
        );
        this.router.get(
            "/get-a-role",
            JWT.logs,
            this.call["backend"]["RoleController"].getARole
        );
        this.router.get(
            "/get-roles-options",
            JWT.logs,
            this.call["backend"]["RoleController"].getRolesOPtions
        );
        // /**Logs*/
        this.router.get(
            "/get-login-logs",
            JWT.verify,
            JWT.logs,
            this.call["backend"]["LogsController"].getAll
        );
        this.router.get(
            "/get-access-logs",
            JWT.verify,
            JWT.logs,
            this.call["backend"]["LogsController"].getAccessLogs
        );
        this.router.get(
            "/get-a-access-logs",
            JWT.verify,
            this.call["backend"]["LogsController"].getAAccessLogs
        );
        this.router.post(
            "/track-activity",
            JWT.verify,
            this.call["backend"]["LogsController"].trackActivity
        );
        this.router.get(
            "/get-audit-logs",
            JWT.verify,
            this.call["backend"]["LogsController"].getAuditLogs
        );
        this.router.get(
            "/export-audit-logs",
            JWT.verify,
            this.call["backend"]["LogsController"].exportAuditLogsCsv
        );
        this.router.get(
            "/export-access-logs",
            JWT.verify,
            this.call["backend"]["LogsController"].exportAccessLogsCsv
        );
        this.router.get(
            "/export-login-logs",
            this.call["backend"]["LogsController"].exportLoginLogsCsv
        );

        /* CMS */
        // /*CMS*/
        this.router.get("/get-cms", this.call["backend"]["CMSController"].list);
        this.router.get(
            "/get-a-cms",
            this.call["backend"]["CMSController"].one
        );
        this.router.post(
            "/upsert-cms",
            this.call["backend"]["CMSController"].upsertCMS
        );
        this.router.put(
            "/delete-a-cms",
            this.call["backend"]["CMSController"].deleteCMS
        );
        this.router.put(
            "/restore-revision",
            JWT.verify,
            this.call["backend"]["CMSController"].restoreRevision
        );
        this.router.post(
            "/remove-blog-image",
            JWT.verify,
            this.call["backend"]["CMSController"].removeBlogImage
        );
        this.router.post(
            "/upload-cms-csv",
            JWT.verify,
            this.call["backend"]["CMSController"].csvUploadCMS
        );

        this.router.get(
            "/export-cms-csv",
            this.call["backend"]["CMSController"].jsonToCsvCMS
        );
        /*user routes*/
        this.router.get(
            "/get-users",
            JWT.verify,
            this.call["backend"]["UserController"].getUsers
        );
        this.router.post(
            "/delete-user",
            JWT.verify,
            this.call["backend"]["UserController"].deleteUser
        );
        this.router.post(
            "/get-active-user",
            //JWT.verify,
            this.call["backend"]["UserController"].getActiveUser
        );
        /*New Routes*/
        this.router.get(
            "/get-admin-all-room",
            //JWT.verify,
            this.call["backend"]["AdminRoomController"].getAdminAllRoom
        );
        this.router.post(
            "/update-admin-room",
            //JWT.verify,
            this.call["backend"]["AdminRoomController"].updateAdminRoom
        );
        this.router.post(
            "/add-admin-room",
            //JWT.verify,
            this.call["backend"]["AdminRoomController"].addAdminRoom
        );

    }

    init(){
        this.loadAdminClasses();
        this.loadAppClasses();
        this.unlessRoutes();
        this.loadAdminRoutes();
        this.loadAppRoutes();

        return this.router;
    }
}

module.exports = AppRouter;