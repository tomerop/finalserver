const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,

    },
    lastName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true,

    },
    email:{
        type: String,
        required: true,
        unique: true,

        
    },
    dateOfBirth:{
        type: Date,
        validate: {
            validator: function(value) {
              return value < Date.now();
            },
            message: 'Date of birth must be valid'
          }
    },
    isTeacher:{
        type:Boolean
    },
    groups:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Groups' // needs a refrence to groups 

    }
});

// defining the schema
const Users = new mongoose.model("Users", schema);


// generating JWT toket
schema.methods.generateJWT = function () {
    const token = jwt.sign({_id: this._id }, "impactStudio");
    return token;
  };

  // validate user using joi
function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phoneNumber: Joi.string().required().regex(/^\d{10}$/),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().min(new Date('1900-01-01')).max(Date.now()),
    isTeacher: Joi.boolean().required(),
    groups: Joi.string(),
  };
  return Joi.validate(user, schema);
}

function validateLogIn(userlog) {
  const schema1 = {
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required().regex(/^\d{10}$/),
  };

  return Joi.validate(userlog, schema1);
}

module.exports.Users = Users;
module.exports.validateUser = validateUser;
module.exports.validateLogIn = validateLogIn;