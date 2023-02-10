const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const schema = new mongoose.Schema({
    groupName:{
        type:String,
        
    }
    
});
const Groups = new mongoose.model("Groups", schema)
function validateGroup(group) {
    const schema = {
      groupName: Joi.string().required()
    };
    return Joi.validate(group, schema);
  };

  module.exports.Groups=Groups
  module.exports.validateGroup=validateGroup