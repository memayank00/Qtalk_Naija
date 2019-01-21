(function () {
    /*creating an env for application*/
    /** this will be avialbale globally for app */
    window._env = window._env || {};
    /** Register basic details of an app */
    window._env.app = {
        name: "Athlete",
        prefix: "_dev_"
    }

    /** Setting up ports on which API will called and socket will run */
    window._env.ports = {
        API: window.location.port ? ("5000" || window.location.port) : "5000",
        SOCKET: "5051"
    };
    if (window.location.host.indexOf("158.85.76.204:5000" >= 0) || window.location.host === "158.85.76.204:5000") {
        console.log("inside if host")
		window._env.baseUrl = "http://158.85.76.204:5000/";
		//window._env.baseUrl = window.location.protocol+"//" + window.location.host +"/";
		window._env.socketUrl = "http://158.85.76.204:5051" 
    } 
    
    if (PORT === "5000") {
        // window._env.baseUrl = "http://18.191.62.66/";
       /* window._env.baseUrl = "http://localhost:8000/";
        window._env.socketUrl = "http://100.100.6.241:" + SOCKETPORT;*/
        window._env.baseUrl = "http://100.100.6.242:5000/";
        window._env.socketUrl = "http://100.100.7.52:"
      }

    /** setting up socket and api urls */
    window._env.uri = {
        base: "http://158.85.76.204:" + window._env.ports.API + "/",
        socket: "http://158.85.76.204:" + window._env.ports.SOCKET
    };

    /** setting up default params for API Points  */
    window._env.api = {
        path: window._env.uri.base + "api/",
        limit: 10
    };
}());

/**CATCHPA site key
 * EMAIL :- flexsin.nodejs@gmail.com
 * pswd:-flexsin@123
 */
export const sitekey = "6LeN_kwUAAAAAPFyDlfPZqZqf4tkb6L8eDPA7MvE";
