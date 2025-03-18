const Firebase = require("firebase-admin");

const serviceAccount = require("../drive-project-d896f-firebase-adminsdk-fbsvc-838644b6c4.json");

const firebase = Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  storageBucket: "drive-project-d896f.firebasestorage.app",
});

module.exports = Firebase;
