const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = require("../models/userModal");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    const { id } = decoded;
    const userData = await UserModel.findOne({ _id: id });
    if (userData === null) {
      return res.status(401).json({
        message: "Auth Fail",
      });
    } else if (userData.flag === 2) {
      return res.status(401).json({
        message: "User Deactivated",
      });
    } else if (userData.flag === 3) {
      return res.status(401).json({
        message: "User Deleted",
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
