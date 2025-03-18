const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "Path is require"],
  },
  originalname: {
    type: String,
    required: [true, "Originalname is require"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User is require"],
  }, 
});
