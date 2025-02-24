const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AdminModel = require("../models/adminModal");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    const { id } = decoded;
    const userData = await AdminModel.findOne({ _id: id });
    // console.log("🚀 ~ module.exports= ~ userData:", userData);
    if (userData === null) {
      return res.status(401).json({
        message: "Auth Fail",
      });
    }
    req.userData = userData;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
