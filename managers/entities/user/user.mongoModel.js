const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["school admin", "superadmin"] 
      }
  });

  module.exports = mongoose.model("User", user)
