const mongoose = require('mongoose');
const { Schema, model } = mongoose; 

const user = new Schema ({
  password: {
    type: String,
    required: [true, 'Password is required'],
    },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
})

const User = model('user', user, 'users');
module.exports = User;