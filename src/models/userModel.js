const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  otp: {
    type: String,
  }
})

const Users = mongoose.model("Users", userSchema)

module.exports = Users