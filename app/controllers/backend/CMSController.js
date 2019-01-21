"use strict";

const crypto = require("crypto"),
    path = require("path"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    async = require("async"),
    uuidv1 = require("uuid/v4"),
    csv       = require("csvtojson"),
    json2csv  = require('json2csv'),
    shortid = require("shortid"),
    JWT = require(path.resolve("./app/config/libs/jwt")),
    _moment = require(path.resolve("./app/config/libs/date")),
    Error = require(path.resolve("./app/config/libs/error")),
    Pagination = require(path.resolve("./app/config/libs/paginate")),
    Post = require(path.resolve("./app/models/post")),
    env = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    ObjectId = mongoose.Types.ObjectId,
    CLOUDINARY = require(path.resolve("./app/config/libs/cloudinary")),
    formidable = require("formidable"),
    slugify = require("slugify"),
    _       =require('lodash'),
    Helper = require(path.resolve("./app/config/libs/helper")),
    imagePath = "./" + env.image_destination + "/";

/**
 * this function will list all posts based on types
 * @param  {[type]} req [body|query|params]
 * @param  {[type]} res [use to send response]
 * @return {[type]}     list of posts
 */

class CMSController {
    list(req, res) {
        let query,
            resObj = {},
            params = req.query,
            page = params.page ? params.page : 1,
            limit = params.limit ? parseInt(params.limit) : env.listing.limit,
            offset = parseInt(page - 1) * limit;
        /*check for valid admin user token*/
        JWT.verify(req, res, user => {
            /*if token is valid*/
            let match = {
                type: params.type,
                trash: false,
                $or: [{ revision: { $exists: false } }]
            };
            let project={
                title: 1,
                image: 1,
                adtype: 1,
                created_at: 1,
                name:1,
                "_Admin.firstname": 1,
                "_Admin.lastname": 1,
                meta_title: 1,
                status: 1,
                order: 1,
                photo_feature:1,
                extra_classes: 1,
                custom_link: 1,
                // content: 1,
                blog_post_date: 1,
                faq_category:1,
             

            }

            /* if(user && user.type>2){
                match.author = new ObjectId(user._id);
            } */

            if (params.searchQuery) {
                match.title = {
                    //$regex: params.searchQuery,
                    $regex : `^${params.searchQuery}`,
                    $options: "i"
                };
                
            }

            if (params.type && params.type==='reviews'){ 
                params.order = "created_at",
                project.content=1
            };

            if (params.type && params.type==='FAQ'){ 
                project.category=1
            };

             /**date Filter */
            if (params.start_date && params.end_date) {
                match.created_at = {
                    "$gte": _moment.addDuration(params.start_date, 'prev'),
                    "$lte": _moment.addDuration(params.end_date, 'next')
                }
             }

             /* to show only active status list FAQ_Category*/
            if(params.status && params.type=='FAQ_Category'){
                match.status=true;
            }
            /**
             * for searching
             */
            //if (params.searchQuery) match.title = new RegExp(params.searchQuery, 'i') 
            console.log("match",match)
            async.waterfall(
                [
                    function(callback) {
                        /*Stage 1 - Count Total Results*/
                        Post.count(match, (err, dataCount) => {
                            resObj.total = dataCount ? dataCount : 0;
                            /*Bind data with callback*/
                            callback(null, resObj);
                        });
                    },
                    function(resObj, callback) {
                        /*Stage 2 - Get all posts based on type*/
                        Post.aggregate(
                            [
                                {
                                    $lookup: {
                                        from: "admins",
                                        localField: "author",
                                        foreignField: "_id",
                                        as: "_Admin"
                                    }
                                },
                                {
                                    $unwind:
                                      {
                                        path: "$_Admin",
                                        
                                        preserveNullAndEmptyArrays: true
                                      }
                                  },
                                // {
                                //     $unwind: "$_Admin" ,preserveNullAndEmptyArrays: true
                                // },
                                {
                                    $match: match
                                },
                                {
                                    $project:project
                                },
                                {
                                    $sort: {
                                        [params.order]: -1
                                    }
                                },
                                {
                                    $skip: offset
                                },
                                {
                                    $limit: limit
                                }
                            ],
                            (err, posts) => {
                                if (posts) {
                                    resObj.records = posts;
                                    resObj.paging = Pagination._paging(
                                        resObj.total,
                                        resObj.records,
                                        parseInt(page)
                                    );
                                    /*Bind data with callback*/
                                    callback(null, resObj);
                                }
                            }
                        );
                    }
                ],
                (err, result) => {
                    if (err)
                        res.status(412).json({
                            type: "error",
                            message: Error.oops(),
                            errors: Error.pull(err)
                        });
                    if (result)
                        res.json({
                            type: true,
                            message:
                                result.records && result.records.length
                                    ? "Data has been sent."
                                    : "No Data Found",
                            data: result
                        });
                }
            );
        });
    }

    one(req, res) {
        
        let obj = req.query;
        /*check for valid admin user token*/

        JWT.verify(req, res, user => {
            /*get data and revisions*/
            async.parallel(
                {
                    data: callback => {
                        Post.findOne({
                            _id: mongoose.Types.ObjectId(obj._id)
                        }).exec(callback);
                    },
                    revisions: callback => {
                        Post.aggregate([
                            {
                                $match: {
                                    revision: mongoose.Types.ObjectId(obj._id)
                                }
                            },
                            {
                                $lookup: {
                                    from: "admins",
                                    localField: "author",
                                    foreignField: "_id",
                                    as: "_Admin"
                                }
                            },
                            { $unwind: "$_Admin" },
                            {
                                $project: {
                                    title: 1,
                                    image: 1,
                                    adtype: 1,
                                    revision: 1,
                                    created_at: 1,
                                    "_Admin.firstname": 1,
                                    "_Admin.lastname": 1,
                                    meta_title: 1,
                                    meta_description:1,
                                    status: 1,
                                    order: 1,
                                    extra_classes: 1,
                                    custom_link: 1,
                                    content: 1
                                }
                            },
                            { $sort: { created_at: -1 } }
                        ]).exec(callback);
                    }
                },
                (err, result) => {
                    if (err)
                        res.status(412).json({
                            type: "error",
                            message: Error.oops(),
                            errors: Error.pull(err)
                        });
                    if (result)
                        res.json({
                            type: true,
                            message: result
                                ? "Data has been sent."
                                : "No Data Found",
                            data: result
                        });
                }
            );
        });
    }

    upsertCMS(req, res) {
        let obj = req.body,
            form = new formidable.IncomingForm(),
            user = req.user;
            
    /*parse incoming form for files and fields......*/

        /*add or edit cms - post/blog etc*/
        //JWT.verify(req, res, (user) => {
        /*assign post to login user*/
        form.parse(req, (err, fields, files) => {
            console.log("files",files)
            if (err) {
                return res.status(412).json({
                    type: "error",
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
            }
            let file = files.file;
            fields = JSON.parse(fields.data);
           
            fields.author = mongoose.Types.ObjectId(user._id);
            
            if (file) {
                /*insert data with file*/
                CLOUDINARY.uploadFile(file.path, file.name).then(image => {
                    fields.image = image;
                    if (fields.editID) {
                        /*update data*/
                        Post.findOneAndUpdate(
                            {
                                _id: mongoose.Types.ObjectId(fields.editID)
                            },
                            fields,
                            { new: false },
                            (err, result) => {
                                if (result) {
                                    /*Create Revision...*/
                                    //Post.createRevision(user, result);

                                    /*Delete image from CDN*/
                                    /* if (result.image)
                                        CLOUDINARY.deleteFile(
                                            result.image.public_id
                                        ); */

                                    res.json({
                                        type: "success",
                                        message: "Post has been updated.",
                                        data: result
                                    });
                                }

                                if (err)
                                    res.status(412).json({
                                        type: "error",
                                        message: Error.oops(),
                                        errors: Error.pull(err)
                                    });
                            }
                        );
                    } else {
                        /*save data*/
                        new Post(fields)
                            .save()
                            .then(result =>
                                res.json({
                                    type: "success",
                                    message: "Post has been added.",
                                    data: result
                                })
                            )
                            .catch(error =>
                                res.status(412).json({
                                    type: "error",
                                    message: Error.oops(),
                                    errors: Error.pull(err)
                                })
                            );
                    }
                });
            } else {
              
                /*insert data only*/
                if (fields.editID) {
                    /*update data*/
                    Post.findOneAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(fields.editID)
                        },
                        fields,
                        {
                            new: false
                        },
                        (err, result) => {
                            if (result) {
                                /*Create Revision...*/

                                //Post.createRevision(user, result);

                                /*Delete image from CDN*/
                              /*   if (result.image)
                                    CLOUDINARY.deleteFile(
                                        result.image.public_id
                                    ); */

                                let message;
                                /**to create  hbs/email template file on edit*/
                                if (fields.type === "email") {
                                    message = "Email Template has been updated";
                                    fs.writeFile(
                                        path.resolve(
                                            `./app/views/emails/${
                                                result.slug
                                            }.hbs`
                                        ),
                                        fields.content
                                    );
                                }
                                res.json({
                                    type: "success",
                                    message: message
                                        ? message
                                        : "Post has been updated.",
                                    data: result
                                });
                            }
                            if (err)
                                res.status(412).json({
                                    type: "error",
                                    message: Error.oops(),
                                    errors: Error.pull(err)
                                });
                        }
                    );
                } else {
                    /*save data*/
                    console.log('fields--- ',fields)
                    //console.log('fields---2 ',new Post(fields));
                    new Post(fields)
                        .save()
                        .then(result => {
                            let message;
                            /**to create  hbs/email template file on adding  */
                            if (fields.type === "email") {
                                message = "Email Template has been added";
                                fs.writeFile(
                                    path.resolve(
                                        `./app/views/emails/${result.slug}.hbs`
                                    ),
                                    fields.content
                                );
                            }
                            res.json({
                                type: "success",
                                message: message
                                    ? message
                                    : "Post has been added.",
                                data: result
                            });
                        })
                        .catch(error => {
                            res.status(412).json({
                                type: "error",
                                message: Error.oops(),
                                errors: Error.pull(error)
                            });
                        });
                }
            }
        });

    }

    upsertCmsSocial(req,res){
        
        let obj = req.body,
        form = new formidable.IncomingForm(),
        user = req.user;
        
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(412).json({
                    type: "error",
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
            }
           
            fields = JSON.parse(fields.data);
           
            fields.author = mongoose.Types.ObjectId(user._id);
            
            if (files) {
               var KeyCheck=_.keys(files);
               var imageObj={};
                /*insert data with file*/
                async.eachOf(files,(file,index,done)=>{
                
                    CLOUDINARY.uploadFile(file.path, file.name).then(image => {
                        fields[index] = image; 
                        if(image){
                            done(null,fields);   
                        }
                     })
                     .catch( error =>{
                        done(error);  
                    })
                },(err,result)=>{
                    if(err){
                        console.log("err",err)
                        if (err)
                        res.status(412).json({
                            type: "error",
                            message: Error.oops(),
                            errors: Error.pull(err)
                        });
                    }else{
                        if (fields.editID) {
                            /*update data*/
                            Post.findOneAndUpdate(
                                {
                                    _id: mongoose.Types.ObjectId(fields.editID)
                                },
                                fields,
                                { new: false },
                                (err, result) => {
                                    if (result) {
                                        /*Create Revision...*/
                                        //Post.createRevision(user, result);
    
                                        /*Delete image from CDN*/
                                        /* if (result.image)
                                            CLOUDINARY.deleteFile(
                                                result.image.public_id
                                            ); */
    
                                        res.json({
                                            type: "success",
                                            message: "Post has been updated.",
                                            data: result
                                        });
                                    }
    
                                    if (err)
                                        res.status(412).json({
                                            type: "error",
                                            message: Error.oops(),
                                            errors: Error.pull(err)
                                        });
                                }
                            );
                        } else {
                            /*save data*/
                            new Post(fields)
                                .save()
                                .then(result =>
                                    res.json({
                                        type: "success",
                                        message: "Post has been added.",
                                        data: result
                                    })
                                )
                                .catch(error =>
                                    res.status(412).json({
                                        type: "error",
                                        message: Error.oops(),
                                        errors: Error.pull(err)
                                    })
                                );
                        }
                    }
                   
                });
            } else {
              
                /*insert data only*/
                if (fields.editID) {
                    /*update data*/
                    Post.findOneAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(fields.editID)
                        },
                        fields,
                        {
                            new: false
                        },
                        (err, result) => {
                            if (result) {
                                /*Create Revision...*/

                                //Post.createRevision(user, result);

                                /*Delete image from CDN*/
                              /*   if (result.image)
                                    CLOUDINARY.deleteFile(
                                        result.image.public_id
                                    ); */

                                let message;
                                /**to create  hbs/email template file on edit*/
                                if (fields.type === "email") {
                                    message = "Email Template has been updated";
                                    fs.writeFile(
                                        path.resolve(
                                            `./app/views/emails/${
                                                result.slug
                                            }.hbs`
                                        ),
                                        fields.content
                                    );
                                }
                                res.json({
                                    type: "success",
                                    message: message
                                        ? message
                                        : "Post has been updated.",
                                    data: result
                                });
                            }
                            if (err)
                                res.status(412).json({
                                    type: "error",
                                    message: Error.oops(),
                                    errors: Error.pull(err)
                                });
                        }
                    );
                } else {
                    /*save data*/
                    new Post(fields)
                        .save()
                        .then(result => {
                            let message;
                            /**to create  hbs/email template file on adding  */
                            if (fields.type === "email") {
                                message = "Email Template has been added";
                                fs.writeFile(
                                    path.resolve(
                                        `./app/views/emails/${result.slug}.hbs`
                                    ),
                                    fields.content
                                );
                            }
                            res.json({
                                type: "success",
                                message: message
                                    ? message
                                    : "Post has been added.",
                                data: result
                            });
                        })
                        .catch(error => {
                            res.status(412).json({
                                type: "error",
                                message: Error.oops(),
                                errors: Error.pull(error)
                            });
                        });
                }
            }
        });
    }

    deleteCMS(req, res) {
        let obj = req.body;
        /*delete CMS Post*/
        /*verify User*/
        JWT.verify(req, res, user => {
            /*user is verified*/
            Post.findOneAndUpdate(
                {
                    _id: mongoose.Types.ObjectId(obj._id)
                },
                {
                    trash: true
                },
                {
                    new: false
                },
                (err, result) => {
                    if (err)
                        res.status(412).json({
                            type: "error",
                            message: Error.oops(),
                            errors: Error.pull(err)
                        });
                    if (result) {
                        /*Delete image from CDN*/
                        if (result.image)
                            CLOUDINARY.deleteFile(result.image.public_id);
                        res.json({
                            type: "success",
                            message: "Post has been removed."
                        });
                    }
                }
            );
        });
    }

    /**
     * this func will restore the current data to previous revision.
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    restoreRevision(req, res) {
        let obj = req.body,
            user = req.user;
        /*change main parent document to child of new parent doc*/
        async.waterfall(
            [
                _callback => {
                    /*Stage 1 - Changing Parent document */
                    /*updating parent id and slug*/
                    Post.findOneAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(obj.revisionOf)
                        },
                        {
                            $set: {
                                revision: mongoose.Types.ObjectId(
                                    obj.revisionId
                                ),
                                slug: shortid.generate()
                            }
                        },
                        {
                            new: false,
                            projection: {
                                slug: 1
                            }
                        },
                        (err, updated) => {
                            if (err) return _callback(err);
                            if (updated) _callback(null, updated);
                        }
                    );
                },

                (oldPost, _callback) => {
                    /*Stage 2 - Changing Parent document */
                    /*updating parent id and slug*/
                    Post.update(
                        {
                            revision: mongoose.Types.ObjectId(obj.revisionOf)
                        },
                        {
                            $set: {
                                revision: mongoose.Types.ObjectId(
                                    obj.revisionId
                                )
                            }
                        },
                        {
                            multi: true
                        },
                        (err, updated) => {
                            if (err) return _callback(err);
                            if (updated) _callback(null, oldPost);
                        }
                    );
                },

                (oldPost, _callback) => {
                    /*Stage 3 - Changing revision document */
                    /*updating slug and resetting parent*/
                    Post.findOneAndUpdate(
                        {
                            _id: mongoose.Types.ObjectId(obj.revisionId)
                        },
                        {
                            $unset: {
                                revision: 1
                            },
                            $set: {
                                slug: oldPost.slug
                            }
                        },
                        {
                            new: true
                        },
                        (err, updated) => {
                            if (err) return _callback(err);
                            if (updated) _callback(null, updated);
                        }
                    );
                }
            ],
            (err, result) => {
                if (err)
                    return res.status(412).json({
                        type: "error",
                        message: Error.oops(),
                        errors: Error.pull(err)
                    });
                if (result)
                    return res.json({
                        type: "success",
                        message: "Data has been restored to previous stage."
                    });
            }
        );
    }

    removeBlogImage(req, res, next) {
        let obj = req.body;
        if (!obj.cmsID) {
            res.status(412).json({
                type: "error",
                message: "Invalid cmsID",
                errors: ["invalid id"]
            });
        }
        if (obj.image) {
            CLOUDINARY.deleteFile(obj.image.public_id);
        }
        if (obj.cmsID) {
            Post.update(
                { _id: obj.cmsID },
                { $set: { image: {} } },
                (err, response) => {
                    if (err) {
                        return res.status(412).json({
                            type: "error",
                            message: Error.oops(),
                            errors: Error.pull(err)
                        });
                    } else {
                        return res.json({
                            type: "success",
                            message: "Image removed successfully"
                        });
                    }
                }
            );
        }
    }

    /* CSV upload cms */
    csvUploadCMS(req,res,next){
        let {_id} = req.user;
        let form = new formidable.IncomingForm(), jsonArr = [],
        checkField = false;
        form.parse(req,(err,fields,files)=>{
            var csvFilePath = files.file.path;
            csv().preFileLine((fileLineString, lineIdx)=>{
                if (lineIdx === 1){
                     
                        return fileLineString.replace('Title','title')
                                             .replace('Slug','slug')
                                             .replace('Meta Title','meta_title')
                                             .replace('Meta Description','meta_description')
                }
                return fileLineString
            })
            .fromFile(csvFilePath)
			.on('json', (jsonObj) => {
				if (
                    jsonObj.hasOwnProperty("title") === true &&
                    jsonObj.hasOwnProperty("slug") === true &&
					jsonObj.hasOwnProperty("meta_title") === true) {
                        
                        jsonObj.title= jsonObj.title.toString();
                        jsonObj.slug= jsonObj.slug.toString();

                        jsonObj.type="page" ;
                        jsonObj.status=true ;
                        jsonObj['slug']= jsonObj['slug'].toString();
                        jsonObj.author=_id;
                      
                    console.log(typeof jsonObj.title)

					jsonArr.push(jsonObj);
				}
				else {
					checkField = true;
				}
            })
            .on('done', (error) => {
				if (checkField == true) {
					return res.status(412).json({ type: "error", message: "Please import csv with valid format", error: Error.pull(err) });
				}
				else {
                    console.log(jsonArr)
                    // async.eachSeries(jsonArr, (user, callback) => {
                    //     let newPost = new Post(user);
                    //     newPost.save(function (err, _page) {
                    //         if (err) {
                    //            console.log(err)
                    //         } else {
                    //            console.log(_page)
                    //         }
                    //     });
                    // })
                 
					Post.insertMany(jsonArr,(err, importres)=>{
						if(err) return res.status(412).json({ type: "error", message: "Oops something went wrong!", error: Error.pull(err) });
						return res.json({ type: "success", message: "CMS list imported successfully", data: importres });
					})
				}

			})
        })

    }

    /**
     * json to csv 
     * meta tag details
     * @param {any} req 
     * @param {any} res 
     * @param {any} next 
     * @memberof CMSController
     */
    jsonToCsvCMS(req,res,next){
        let fields = [{
            label: 'Title',
            value: 'title'
        },
        {
            label: 'Slug',
            value: 'slug'
        },
        {
            label: 'Meta Title',
            value: 'meta_title'
        },
        {
            label: 'Meta Description',
            value: 'meta_description'
        }];

        Post.aggregate([
            {
                $match: {
                        trash: false,
                        type: "page",
                        revision: { $exists: false }
                    }
            },
            {
              $project:{
                "_id": 1,
				"title": 1,
				"meta_title": 1,
				"meta_description": 1,
				"slug": 1,
				"status": 1,
				"created_at":1
              }  
            }
        ],(err,_result)=>{
            if (err) {
                return res.status(412).json({
                    type: "error",
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
            }
            
            let csv = json2csv.parse(_result, { fields: fields }),
            folderPath = path.resolve('./uploads/'),
            filename = "metaList" +".csv",
            filePath = `${folderPath}/${filename}`,
            baseUrl = `${req.protocol}://${req.headers.host}`;
            fs.writeFile('./uploads/' + filename, csv, function (err) {
				if (err) throw err;
            });
            return res.json({
                type: "success",
                data:csv,
                message: "successfully exported"
            });
            
        })
    }
    /**
     *To upload file on clodinary from froala editor
    * @param {*} req
    * @param {*} res
    * @memberof CMSController
    */
    upload_floala_image(req,res){
        let obj = req.body,
            form = new formidable.IncomingForm(),
            user = req.user;
        /*add or edit cms - post/blog etc*/
        //JWT.verify(req, res, (user) => {
        /*assign post to login user*/

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(412).json({
                    type: "error",
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
            }
                       
            let file = files.file;
            if (file) {
                /*insert data with file*/
                CLOUDINARY.uploadFile(file.path, file.name)
			                .then(cdnImage => {
			                    let imageLink = {
			                        secure_url: cdnImage.secure_url,
			                        public_id: cdnImage.public_id,
			                        url: cdnImage.url
                                }
                                return res.json({
                                    link:imageLink.secure_url
                                });
					
							})
							.catch( err =>{
                                return res.json({
                                    type: "error",
                                    message: Error.oops(),
                                    errors: Error.pull(err)
                                });
					})
            }else{
                return res.json({
                    type: "error",
                });
            }
        })
    }
    /**
     *Delete file from clodinary from editor
     * @param {*} req
     * @param {*} res
     * @returns
     * @memberof CMSController
     */
    delete_froala_image(req,res){
        let reqData=req.body;
        let publicID=Helper.cloudiaryID(reqData.url);
        if(publicID){
            CLOUDINARY.deleteFile(publicID)
            .then((result)=>{
                return res.json({
                    type: "success",
                    message:"image deleted ",
                });
            })
            .catch((error)=>{
                  return res.json({
                    type: "error",
                    error:error,
                    message:"cloudinary internal error"
                 });
            })
        }else{
            return res.json({
                type: "error",
            });
        }
   
    }
    /**
     *get category count
    * @param {*} req
    * @param {*} res
    * @memberof CMSController
    */
    faq_category_question(req,res){
            let params= req.query,
                match={
                    _id:params._id,
                    type:"FAQ_Category",
                },
                project={faq_category:1,_id:1},
                filter={
                    type: "FAQ",
                    trash: false,
                    $or: [{ revision: { $exists: false } }]
                };

            async.waterfall([
                (callback)=>{
                    Post.aggregate([
                        {$match: {
                            type: "FAQ_Category",
                            trash: false,
                            status:true,
                            $or: [{ revision: { $exists: false } }]
                        }}
                    ],(err,result)=>{
                        callback(err,result);
                    })
                },
                (_res,callback)=>{
                Post.findOne(match,project,(err,result)=>{
                    callback(err,result,_res);
                })
                },
                (category,_res,callback)=>{
                    if(!_.isEmpty(category)){
                        filter.category=category.faq_category;
                        Post.count(filter,(err,count)=>{
                            callback(err,count,_res);
                        })
                    }else{
                        callback(err,"NO QUESTIONS",_res);  
                    }
                }
            ],(err,_result,_res)=>{
                console.log(err,_result);
                if (err)
                res.status(412).json({
                    type: "error",
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
                if(_result=="NO QUESTIONS"){
                    res.json({
                        type: true,
                        message:"Success",
                        data: 0
                    });
                }else{
                    res.json({
                        type: true,
                        message:"Success",
                        data: _result,
                        records:_res
                    });
                }
            })
            
    }
    /**
     *
     * @param {*} req
     * @param {*} res
     * @memberof CMSController
     */
    Faq_updateAll_category(req,res){
        let params=req.query,reqData=req.body;
        let match={
            _id:reqData.ID,
            type:"FAQ_Category",
        };
        let filter={
            type: "FAQ",
            trash: false,
            $or: [{ revision: { $exists: false } }],
            
        }

        console.log(reqData)
        async.waterfall([
            (callback)=>{
                Post.findOneAndUpdate(match,{trash:true},(err,result)=>{
                    callback(err,result)
                })
            },
            (data,callback)=>{
                filter.category=data.faq_category;
                console.log(data);
               Post.update(filter,{$set : {category : reqData.category}},{multi : true}).exec(callback);
            }
            
        ],(err,result)=>{
            if (err)
                res.status(412).json({
                    type: "error",
                    status:false,
                    message: Error.oops(),
                    errors: Error.pull(err)
                });
                if(result){
                    res.json({
                        type: true,
                        status:true,
                        message:"Success",
                        data: result
                    });
                }
        })
    }



}

module.exports = CMSController;
