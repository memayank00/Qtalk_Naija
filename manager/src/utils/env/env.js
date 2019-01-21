import lodash from 'lodash';

(function(){

	const PORT = window.location.port ? window.location.port:"5000";
	const SOCKETPORT = 5051;
	/*creating an env for application*/
	window._env = window._env || {};



	window._env = {
		app: "houseBuyer",
		prefix : "_DEV_",
		baseUrl : "http://158.85.76.204:"+PORT+"/",
		socketUrl: "http://158.85.76.204:" + SOCKETPORT
	};

	/* if(window.location.host === "stageadmin.housebuyersofamerica.com" || window.location.host.indexOf("stageadmin.housebuyersofamerica.com" >= 0) ){
		window._env.baseUrl = window.location.protocol+"//" + window.location.host +"/";
		window._env.socketUrl = "http://100.100.6.241:" + SOCKETPORT
	}  */

	console.log("host--- ",window.location.host);
	console.log("port--- ",PORT);
	 if (window.location.host.indexOf("158.85.76.204" >= 0) || window.location.host === "158.85.76.204") {
		window._env.baseUrl = "http://158.85.76.204:5000/";
		//window._env.baseUrl = window.location.protocol+"//" + window.location.host +"/";
		window._env.socketUrl = "http://158.85.76.204:" + SOCKETPORT
	} 
	
	if (window.location.host.indexOf("https://www.trackingapp.com" >= 0) || window.location.host === "https://www.trackingapp.com") {
		window._env.baseUrl = "https://www.trackingapp.com/";
		//window._env.baseUrl = window.location.protocol+"//" + window.location.host +"/";
		window._env.socketUrl = "https://www.trackingapp.com:" + SOCKETPORT
	}
	
	

	if (PORT === "3000") { 
		// window._env.baseUrl = "http://18.191.62.66/";
		window._env.baseUrl = "http://100.100.7.165:5000/";
		window._env.socketUrl = "100.100.7.165:" + SOCKETPORT 
	}

	if (PORT === "3001") { 
		window._env.baseUrl = "http://100.100.7.165:5000/";
		window._env.socketUrl = "http://100.100.7.165:" + SOCKETPORT

	}

	if (PORT === "3002") { 
		window._env.baseUrl = "http://localhost:5000/";
		window._env.socketUrl = "http://100.100.6.241:" + SOCKETPORT

	}
	if (PORT === "8000") {
		
		window._env.baseUrl = "http://localhost:5000/";
		window._env.socketUrl = "http://localhost:" + SOCKETPORT
	}

	window.limit = 10;
	window._env.appPath = window._env.baseUrl+"api/";
	window._env.adminPath = window._env.baseUrl+"admin_api/";
	/* Global variables */
	window._ = lodash;
	

}());
/**CATCHPA site key
 * EMAIL :- flexsin.nodejs@gmail.com
 * pswd:-flexsin@123
 */
export const sitekey = "6LeN_kwUAAAAAPFyDlfPZqZqf4tkb6L8eDPA7MvE";
