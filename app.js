const express = require("express");
const app = express();
// dot env
const dotenv = require("dotenv");
dotenv.config();
// connection with database
const connectDB = require("./config/db");
connectDB();
// cookie parser
const cookieParser = require("cookie-parser");

// user router
const userRouter = require("./routes/user.routes");
const { cookie } = require("express-validator");

// home route
const homeRouter = require("./routes/index.routes");

// setting the view engine
app.set("view engine", "ejs");
// using cookie parser
app.use(cookieParser());

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user router
app.use("/user", userRouter);

// home router
app.use("/", homeRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
