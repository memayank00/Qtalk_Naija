/** setting up right en */
console.log(process.env.NODE_ENV)

module.exports = require("./env."+process.env.NODE_ENV);