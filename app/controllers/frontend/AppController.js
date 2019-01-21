const path = require("path"),
      ObjectId= require("mongoose").Types.ObjectId;

class App {

	constructor(){
		//console.log("from App cont. constructor");
		this.welcome = "Welcome to NodeJS ES6";
	}

	callme(){
		console.log("init app controler");
	}
	/**
     * 
     */
    response(object){
        return {
            type: !object.err ? "success" : "error",
            message: object.message ? object.message : "Data Sent",
            data: object.data ? object.data : [],
            errors: object.err ? object.err : [],
            status: !object.err ? 1 : 0,
            otherInfo : object.userInfo ? object.userInfo : undefined,
            mobileUrl : object.mobileUrl ? object.mobileUrl : undefined
        };
    }

    getUserIds(_ids){
        let userIds=[];
        /*extract user id from array*/
        if(_ids && _ids.length){
            _ids.map((user) => userIds.push(ObjectId(user._id)));
        }

        return userIds;
    }
    
    _members(_memberCSString){
        return (_memberCSString) ? _memberCSString.split(",") : [];
    }
}

module.exports = App;








/*to check unique convertation between two users*/

/*
db.getCollection('conversations').find({ currentUsers:
    { '$size': 2, '$all': [ ObjectId('5b5ffa93d9c5561722964b31'), 
    ObjectId('5b5066851540791ebcc10235') ] } })
*/