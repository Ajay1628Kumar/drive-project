const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "Path is required"],
  },
  originalname: {
    type: String,
    required: [true, "Originalname is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User is required"],
  },
});

const fileModel = mongoose.model("fileModel", fileSchema);

module.exports = fileModel;
