const path = require("path"),
	env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`));

class App {

	constructor(){
		this.welcome = "Welcome to Application";
	}

	cleanIP(ip){
		return (ip).replace("::ffff:","");
	}

	getColor() {
		return env.colors[Math.floor(Math.random() * env.colors.length)];
	}

	getNotificaionIcon(){
		return env.notificaionIcons[Math.floor(Math.random() * env.colors.length)];
	}
}

module.exports = App;