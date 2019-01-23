"use strict";

require("dotenv").config({ silent: true });
const express = require("express"),
  helmet = require("helmet"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  http = require("http"),
  https =require('https'),
  router = express.Router(),
  routes = require("./app/config/routes"),
  database = require(path.resolve("./app/config/libs/mongoose")),
  admin = require(path.resolve("./app/controllers/backend/index")),
  env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`));

class Server {
  constructor() {
    /*defining PORT for application*/
    this.port = env.server.PORT || 3000;

    /*init express app*/
    this.app = express();

    /*Create SSL option*/
    var sslOptions = {};
      if( process.env.NODE_ENV === 'production' ){
          /*sslOptions={
              cert : fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com.crt'),
              key: fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com.key'),
              ca: fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com_bundle.crt')
          };*/
      }

    /*init a sever*/
    this.server = http.createServer(this.app);
    //this.httpsServer = https.createServer(sslOptions,this.app);

    /*init helmets for securing http headers*/
    this.helmet = helmet();

    /*init cors for multiple origin requests*/
    this.cors = cors();

    /*init admin class to create a user on Very first time use*/
    this.admin = new admin();

    this.router = router;

    this.routes;
    /* redirect */
        // if( process.env.NODE_ENV === 'production' ){
        //     function requireHTTPS(req, res, next) {
        //         var host = req.header("host");
        //         console.log('Host-- ',host)
        //         if (!req.secure) {
        //             // https://stackoverflow.com/questions/15813677/https-redirection-for-all-routes-node-js-express-security-concerns
        //             if (host.match(/^www\..*/i)) {
        //                 res.redirect(301, "https://www." + host);
        //             } else {
        //                 res.redirect(301, "https://www." + host);
        //             }
        //        } else {
        //                if (host.match(/^www\..*/i)) {
        //                    next();
        //                } else {
        //                    res.redirect(301, `${req.protocol}://www.${req.hostname}${req.originalUrl}`);
        //                }
        //            }
        //     }
        
        //     this.app.use(requireHTTPS); 
        // }
  }

  secureHeaders() {
    /*protect http headers of server through Helmet*/
    this.app.use(this.helmet);
  }

  appConfig() {
    /*allow application to read and send data in body*/
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  }

  enablingCors() {
    /*enable application CORS*/
    this.app.use(this.cors);
  }

  connectoToDB() {
    new database().dbConnect();
  }

  initRoutes() {
    this.routes = new routes(this.app, this.router).init();
  }

  setStaticPaths() {
    this.app.use(express.static(__dirname + "/uploads"));
  //this.app.use('/assets', express.static(path.resolve('./IDispatch-web/build/assets')));
      /**static of admin site */
     //this.app.use('/www', express.static(path.resolve('./manager/build/www')));   
    /*to join all upload files*/
      //this.app.use('/static', express.static(path.resolve('./IDispatch-web/build/static')));

    this.app.use(express.static(path.join(__dirname, "public")));
  }

  setAPIRoutes() {
    /*routing /&admin apis*/
    this.app.use("/api", this.routes);
    this.app.use("/admin_api", this.routes);
  }

  allowToServe() {
    this.app.get('/', (req, res) => {           
         res.sendFile(path.resolve('./index.html'));
    });
    /*rendering file on routes*/
        /*this.app.get(/^((?!\/(api|admin_api|manager)).)*$/, (req, res) => {           
             res.sendFile(path.resolve('./IDispatch-web/build/index.html'));
        });*/

        /**serve admin appliction if got manager in route */
        /*this.app.get("/manager/*", (req, res) => {     
          res.sendFile(path.resolve('./manager/build/index.html'));
        });*/
  }
  // handleError() {
  //   /*rendering file on routes*/
  //     this.app.use((err,req,res,next)=>{
  //       console.log(err)
  //       if(err.name==='UnauthorizedError'){
  //         res.json({message:err.message})
  //       }
  //     });  
  // }
  /*{ Error: ENOENT: no such file or directory, stat '/home/ubuntu/Qtalk_Naija/IDispatch-web/build/index.html'
  errno: -2,
  code: 'ENOENT',
  syscall: 'stat',
  path: '/home/ubuntu/Qtalk_Naija/IDispatch-web/build/index.html',
  expose: false,
  statusCode: 404,
  status: 404 }*/
  listen() {
    this.server.listen(this.port, () => {
      /**to create roles */
      this.admin.addDefaultRoles("Super Admin", env.permissions.superAdmin);
      // this.admin.addDefaultRoles("Admin", env.permissions.admin);

      /**to create an admin if not exist*/
      setTimeout(() => {
        this.admin.checkAdminAccount();
      }, 2000);
      console.log("listening on", this.server.address().port);
    });
    /*if( process.env.NODE_ENV === 'production' ){
        this.httpsServer.listen(env.server.PROD_PORT, () => {
            console.log(`Listening on server port: ${env.server.PROD_PORT}`);
        });
    }*/
  }
  
  init() {
    /*Listen on Server Port*/
    this.secureHeaders();
    this.appConfig();
    this.enablingCors();
    this.connectoToDB();
    this.initRoutes();
    this.setStaticPaths();
    this.setAPIRoutes();
    this.allowToServe();
    //this.handleError();
    this.listen();
  }
}

let application = new Server();

application.init();
//console.log("this=--> ",application.server);
module.exports = application.server;
