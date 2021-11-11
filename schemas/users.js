const { Schema, model } = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcryptjs')

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: emailRegex
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  token: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
},
{ versionKey: false, timestamps: true },)

userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const joiSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  email: Joi.string().email(emailRegex).min(1).max(12).required(),
  name: Joi.string().required(),
  token: Joi.string(),
  refreshToken: Joi.string()
})

const User = model('user', userSchema)

module.exports = {
  User,
  joiSchema
}
