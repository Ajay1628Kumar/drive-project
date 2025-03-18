const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [13, "email must be at least 13 characters long"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [6, "password must be at least 6 characters long"],
  },
});

const userModel = mongoose.model("UserModel", userSchema);

module.exports = userModel;
