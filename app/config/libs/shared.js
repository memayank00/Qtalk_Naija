const _ = require("lodash");

let shared ={

    /** random - this function will generate random string*/
    random: (size = 6, isNumeric = false) => {
        let string = !isNumeric ? "QWERTYUIOPLKJHGFDSAZXCVBNM12346790qwertyuiopasdfghjklzxcvbnm" : "12346790";
        let rand = string.split('');
        let shuffle = _.shuffle(rand);
        let num = _.slice(shuffle, 0, size);
        return num.join("");
    }

}







module.exports = shared ;