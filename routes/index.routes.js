const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authe");
const fileModel = require("../models/file.models");
const upload = require("../config/multer.config");
const firebase = require("../config/firbase.config");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userFile = await fileModel.find({
      user: req.user.userId,
    });
    console.log(userFile); // For debugging; consider removing this in production
    res.render("home", {
      files: userFile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const newFile = await fileModel.create({
        path: req.file.path,
        originalname: req.file.originalname,
        user: req.user.userId,
      });
      res.json(newFile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading file" });
    }
  }
);

router.get("/download/:path", authMiddleware, async (req, res) => {
  const loggedInUserId = req.user.userId;
  const filePath = req.params.path;

  try {
    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: filePath,
    });

    if (!file) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const signedUrl = await firebase
      .storage()
      .bucket()
      .file(filePath) // Correct filePath here
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // Optional expiration (1 hour)
      });

    res.redirect(signedUrl[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching the file" });
  }
});

module.exports = router;
