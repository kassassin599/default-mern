const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();
const connectDB = require("./api/config/db");
connectDB();

mongoose.Promise = global.Promise;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join("uploads")));
app.use("/api", require("./api/routes/index"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

// app.use("/api", require("./api/routes/"));

app.use("/cancel", (req, res) => {
  console.log("cancel");
  console.log(req);
});
app.use("/success", (req, res) => {
  console.log("success");
  console.log(req);
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
