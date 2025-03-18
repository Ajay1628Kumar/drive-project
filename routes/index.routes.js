const express = require("express");
const router = express.Router();

const upload = require("../config/multer.config");

router.get("/", (req, res) => {
  res.render("home");
});

// post method for uploading files
router.post("/upload-file", (req, res) => {
  res.send("file submitted");
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.send(req.file);
});

module.exports = router;
