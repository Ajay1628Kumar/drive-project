const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input details. Please check the form." });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Registration successful, please log in." });
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid input details. Please check the form." });
    }

    const { username, password } = req.body;
    const userExist = await userModel.findOne({ username });

    if (!userExist) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    // const isMatch = await bcrypt.compare(password, userExist.password);

    // if (!isMatch) {
    //   return res.status(400).json({ message: "Password is incorrect" });
    // }

    const token = jwt.sign(
      {
        userId: userExist._id,
        email: userExist.email,
        username: userExist.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token);
    res.status(200).json({ message: "Login successful", token });
  }
);

module.exports = router;
