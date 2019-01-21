"use strict";
const mongoose = require("mongoose"),
    path = require("path"),
    _ = require("lodash"),
    config = require(path.resolve(`./app/config/env/${process.env.NODE_ENV}`)),
    slug = require("mongoose-slug-generator"),
    uniqueValidator = require("mongoose-unique-validator"),
    schema = mongoose.Schema;

/*Use Plugin*/
mongoose.plugin(slug);

var postSchema = new schema(
    {
        title: {
            type: String,
            // unique: "Title you've entered already exists",
            trim: true,
            uniqueCaseInsensitive: true,
        },
        name: String, // Refer to review module's field reviewer name,
        address: Object, // Refer to review module's field reviewer address
        rating: String, // Refer to review module's field reviewer rating
        summary: String,
        content: String,
        image: Object,
        featured_image:Object,//social customer stories
        add:String,
        address_summary:String,//social
        review_text:String,
        pageMetaInfo: String,
        pageKeyword: String,
        cmsContent: String,
        showImage:{
            type:String,
            enum:{
                values:['DefaultImage','UploadImage','NoImage']
            },
            default:'DefaultImage'
        },
        slug: {
            type: String,
            slug: "title",
            unique: "This slug is already in used.",
            lowercase: true,
            slug_padding_size: 1,
            index: true,
           
        },
        type: {
            type: String,
            default: "post"
        },
        order: {
            type: Number,
            default: 0
        },
        meta_title: String,
        meta_keyword: String,
        meta_description: String,
        custom_link: {
            type: String
        },
        extra_classes: {
            type: String
        },
        position: Object,
        adtype: Object,
        category: {
            type: String,
        },
        city:String,
        faq_category:{ //refer to faq category
            type: String,
       /*      unique: "Category you've entered already exists", */
            trim: true,  
            uniqueCaseInsensitive: true,
            sparse:true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId
        },
        status: {
            type: Boolean,
            default: false
        },
        syncSite:{
            type:Boolean,
            default:false
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        trash: {
            type: Boolean,
            default: false
        },
        revision: mongoose.Schema.Types.ObjectId,
        blog_post_date: {
            type: Date,
            default: new Date()
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

/**
 * This fn will create a revision for the document
 * which is being updated by admin
 * @param  {[type]} admin - Admin User who is performing the action
 * @param  {[type]} prevData - OLD data which is being replaced
 * @return {[type]}          acknowledement
 */
postSchema.statics.createRevision = function(admin, prevData) {
    let self = this;

    /*change slug for uniqueness*/
    let {
        type,
        order,
        status,
        isFeatured,
        trash,
        author,
        title,
        summary,
        meta_title,
        meta_description,
        pageMetaInfo,
        pagekeyword,
        content,
        slug,
        position,
        _id
    } = prevData;
    let oldPost = {
        type,
        order,
        status,
        isFeatured,
        trash,
        author: mongoose.Types.ObjectId(author),
        title,
        summary,
        meta_title,
        meta_description,
        pageMetaInfo,
        pagekeyword,
        content,
        slug,
        position,
        revision: mongoose.Types.ObjectId(_id)
    };

    /*save the revision...*/
    let revision = new self(oldPost);
    revision
        .save()
        .then(result => true)
        .catch(err => false);
};
postSchema.plugin(uniqueValidator);
module.exports = mongoose.model("post", postSchema);


