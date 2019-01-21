'use strict';
const path                     = require('path'),
      mongoose                 = require('mongoose'),
      async                    = require("async") ,

    /**collections */
      Role                    = require(path.resolve('./app/models/role')),
      ERROR                   = require(path.resolve(`./app/config/libs/error`)),
      Admin                   = require(path.resolve('./app/models/admin')),
      env                     = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
      ObjectId                = mongoose.Types.ObjectId;

     

class RoleController {

    /**Add/Edit Role */
    addEditRole(req, res) {
        let obj = req.body,
            message = "Role has been added.",
            match = { preBuilt: false, title: obj.title };

        if (obj._id) {
            match = { _id: ObjectId(obj._id), preBuilt:false };
            message = "Role updated succesfully";

            Role.findOneAndUpdate(match, obj,
                { new: true, setDefaultsOnInsert: true, runValidators: true, context: "query", },
                (err, result) => {
                    if (err) return res.status(412).json({ type: "error", message: "OOPS Something went wrong", errors: ERROR.pull(err) });
                    if (!result) return res.status(412).json({ type: "error", message: "You are trying to perform invalid operations", errors: [] });
                    res.json({ type: "success", message: message, data: result });

                }
            );
        }
        else{
            new Role(obj).save()
            .then(result => res.json({ type: "success", message: message, data: result }))
            .catch(err => res.status(412).json({ type: "error", message: "OOPS Something went wrong", errors: ERROR.pull(err) }) );
        }

       
    }

   
    /**get list of qualities */
    getRoles(req, res) {
        /**match  */
        let obj         = req.query,
            projection = { title: 1, created_at: 1, permissions:1,_id:1,preBuilt:1,slug:1,status:1},
            sortBy      = { "created_at": -1 };
        var match = {type:obj.type};

        /**Serach */
        if (obj.searchQuery) {
            match.title = new RegExp(obj.searchQuery, 'i');
        }

        /** filter dropdown */
        if (obj.filter == 1) {
            match.status = true
        }
        else if (obj.filter == 0) {
            match.status = false
        }

        // console.log("match", match)
        async.parallel({
            roleCount: (_callback) => {
                Role.count(match).then(response => _callback(null, response))
                    .catch(err => _callback(err));
            },
            role: (_callback) => {
                /**pagination */
                var limit = obj.limit ? parseInt(obj.limit) : env.listing.limit;//results per page
                var page = (obj.page) ? parseInt(obj.page) : 1;//offset
                var offset = (page - 1) * limit;

                Role.aggregate([
                    {
                        $match: match
                    },
                    {
                        $project: projection
                    },
                    {
                        $sort: sortBy
                    },
                    {
                        $skip: offset
                    },
                    {
                        $limit: limit
                    }

                ]).then(response => _callback(null, response))
                    .catch(err => _callback(err));
            }
        }, (err, results) => {
            if (err) res.status(412).json({ type: "error", message: "Oops something went wrong!", error: ERROR.pull(err) });
            return res.json({ type: "success", message: "Role list ", data: results });
        });
    }

    getRolesOPtions(req, res) {
        let projection = { title: 1, _id: 1 ,status:1},
            obj=req.query,
            match = {type:obj.type};
        async.waterfall([
            (_callback)=>{
                Admin.findOne({_id:ObjectId(obj.loginId)},{role:1},(err,roles)=>{
                    _callback(err,roles)
                })
            },
            (roles,_callback)=>{
                Role.find(match, projection)
                .then(result => {
                    _callback(null,result,roles);
                })
                .catch(err => _callback(err,null));
            }
        ],(err,result,roles)=>{
            if(err){
                res.status(412).json({ type: "error", message: ERROR.oops(), error: err })
            }
            if(result){
                res.json({ type: "success", message: "Role list ", data: result,roles:roles })
            }
        }) 
      /*   
        Role.find(match, projection)
        .then(result => res.json({ type: "success", message: "Role list ", data: result }))
        .catch(err => res.status(412).json({ type: "error", message: ERROR.oops(), error: err })); */
    }
   

    /**get details of a single Role */
    getARole(req, res) {
        let obj = req.body,
            message = "Role found.",
            projection = { title: 1, created_at: 1, permissions: 1, _id: 1 ,status:1},
            match = mongoose.Types.ObjectId(req.query.id)

        Role.findOne(match, projection, (err, result) => {
            if (err) res.json({ type: "error", message: err.message });
            res.json({ type: "success", message: message, data: result });

        });
    }


}
module.exports = RoleController;