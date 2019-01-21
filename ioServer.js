'use strict';

require('dotenv').config({silent: true});
const express 		= require('express'),
	helmet 			= require('helmet'),
	fs 				= require("fs"),
	path 			= require('path'),
	bodyParser 		= require('body-parser'),
	cors 			= require('cors'),
	http 			= require('http'),
	https           = require('https'),
	socketio 		= require('socket.io'),
	socketController=require('./app/sockets/controller'),
	database 		= require(path.resolve('./app/config/libs/mongoose')),
	env				= require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`));
	
class ioServer {
	constructor(){
		/*defining PORT for application*/
		this.port   = env.server.socketPORT || 5051;
		/*init express app*/
		this.app    = express();
		/*init a sever*/
		this.server = http.createServer(this.app);
		var sslOptions = {};
	      if( process.env.NODE_ENV === 'production' ){
	          /*sslOptions={
	              cert : fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com.crt'),
	              key: fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com.key'),
	              ca: fs.readFileSync('/home/trackingapp/tracking-app-ssl/trackingapp.com_bundle.crt')
	          };*/
	      }
        this.httpsServer = https.createServer(sslOptions,this.app);
		/*init helmets for securing http headers*/
		this.helmet = helmet();
		/*init cors for multiple origin requests*/
		this.cors   = cors();
		/*init socket instance*/
		/*if( process.env.NODE_ENV === 'production' ){
			this.io = socketio(this.httpsServer, {
				pingInterval : 2000,
				pingTimeout : 5000
			});
		}else{*/
			this.io = socketio(this.server, {
				pingInterval : 2000,
				pingTimeout : 5000
			});
		/*}*/

		this.socketCont = new socketController(this.io);
		
	}

	secureHeaders(){
		/*protect http headers of server through Helmet*/
		this.app.use(this.helmet);
	}

	appConfig(){
		/*allow application to read and send data in body*/
		this.app.use(bodyParser.json({limit: '50mb'}));
		this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	}

	enablingCors(){
		/*enable application CORS*/
		this.app.use(this.cors);
	}
	connectoToDB(){
		new database().dbConnect();
	}

	init(){
		this.appConfig();
		//let socketCont = new socketController(this.io);
		this.socketCont.init();
		this.app.get("/", (req, res) => res.end("Socket Point"));

		this.app.get("/send-alert", (req, res) => {
			this.socketCont.sendAlert(req.query);
			return;
		});

		/*Listen on Server Port*/
		this.secureHeaders();
		this.enablingCors();
		this.connectoToDB();
		
		if( process.env.NODE_ENV === 'production' ){
			this.httpsServer.listen(this.port, () => {
			    console.log(`Socket Server is listening on port:${this.port} with https`);
			});
		}else{
			this.server.listen(this.port, () => console.log('listening on', this.server.address().port));
		}
	}
}

new ioServer().init();