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
        enum: ['admin', 'superadmin'] // Use the "enum" validation to restrict the role to specific values
      }
  });

  module.exports = mongoose.model("User", user)
