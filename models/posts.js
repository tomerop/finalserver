const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Groups'
    },
    imageUrl:{
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 2,
    },
    body:{
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 2
    },
    comments:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'}
});
const Posts = new mongoose.model("Posts", schema);


function validatePost(posts) {
    const schema = {
      groupName: Joi.string().required()
    };
    return Joi.validate(posts, schema);
  };

  module.exports.validatePost=validatePost
  module.exports.Posts=Posts