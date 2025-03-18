const express = require("express");
const router = express.Router();
// user model
const userModel = require("../models/user.model");
// express validator
const { body, validationResult } = require("express-validator");
// bcrypt
const bcrypt = require("bcrypt");
// json web token
const jwt = require("jsonwebtoken");

// routes
router.get("/register", (req, res) => {
  res.render("register");
});

// post method route for user registeration
router.post(
  "/register",
  //   middleware for validation register data
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid Details" });
    }
    const { username, email, password } = req.body;
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.send(newUser);
  }
);

// get method route for login
router.get("/login", (req, res) => {
  res.render("login");
});

//
router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid Details" });
    }

    const { username, password } = req.body;
    // find user by username
    const userExist = await userModel.findOne({
      username: username,
    });

    if (!userExist) {
      return res
        .status(400)
        .json({ message: "username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(400).json({ message: " password is incorrect" });
    }

    // if user exist and password is correct
    // generate token
    const token = jwt.sign(
      {
        userId: userExist._id,
        email: userExist.email,
        username: userExist.username,
      },
      process.env.JWT_SECRET
    );

    // send token to cookie
    res.cookie("token", token);
    res.send("Logged In");
  }
);

module.exports = router;
