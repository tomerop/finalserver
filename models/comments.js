const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    body:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1000,
    }
});

function validateComment(comment) {
    const schema = {
      comment: Joi.string().min(2).max(1000).required()
    };
    return Joi.validate(comment, schema);
  };

const Comment = new mongoose.model('comments', schema);

module.exports.Comment = Comment;
module.exports.validateComment = validateComment;