const multer = require("multer");
const firebasestorage = require("multer-firebase-storage");

const Firebase = require("./firbase.config");
const serviceAccount = require("../drive-project-d896f-firebase-adminsdk-fbsvc-838644b6c4.json");

const storage = firebasestorage({
  credentials: Firebase.credential.cert(serviceAccount),
  bucketName: "drive-project-d896f.firebasestorage.app",
  unique: true,
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
