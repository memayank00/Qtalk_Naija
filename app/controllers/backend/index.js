'use strict';



const mongoose           = require('mongoose'),
      path               = require('path'),
      env                = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
      Admin              = require(path.resolve('./app/models/admin')),
      Role               = require(path.resolve('./app/models/role'));
              

class Index {
    checkAdminAccount() {

        Role.findOne({ title: "Super Admin" }, { title: 1, _id: 1 })
        .then(result => {
            let userData = JSON.parse(JSON.stringify(env.ADMIN));
            userData.role = result;

            Admin.findOne(result, (err, result) => {
                if (!result) {
                    var user = new Admin(userData);
                    user.save((err, result) => {
                        /*User Create*/
                    });
                }
            })
        })
       

    }

    /**to make default roles */
    addDefaultRoles(roleName,array) {

        let match = { title: roleName},
            toSet = { 
                "title" :roleName,
                "permissions":array,
                "preBuilt":true,
                "type":"admin"
            };

        Role.findOne(match, (err, result) => {
            if (!result) {
                var newRole = new Role(toSet);
                newRole.save((err, result) => {
                    /*Role Created*/
                });
            }
        });
    }

  
}

module.exports = Index;