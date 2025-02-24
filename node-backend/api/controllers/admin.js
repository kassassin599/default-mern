// const Helper = require("../helper/index");
const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const AdminDB = require("../models/adminModal");
const UserDB = require("../models/userModal");
const UserInfoDB = require("../models/userInfoModal");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
// let mongoosePaginate = require("mongoose-paginate-v2");

exports.register = async (req, res, next) => {
  const objValidation = new niv.Validator(req.body, {
    name: "required",
    email: "required|email",
    password: "required|minLength:6",
  });

  try {
    const matched = await objValidation.check();
    if (!matched) {
      return res
        .status(422)
        .send({ message: "Validation error", errors: objValidation.errors });
    }

    const userData = await AdminDB.findOne({ email: req.body.email });
    if (userData) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    if (!req.file) {
      return res.status(409).json({
        message: "Profile pic is required",
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new AdminDB({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      profilePic: req.file.path,
    });

    const result = await user.save();
    return res.status(201).json({
      message: "Admin has been successfully created",
      result: result,
    });
  } catch (err) {
    // Helper.writeErrorLog(req, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const objValidation = new niv.Validator(req.body, {
    email: "required|email",
    password: "required|minLength:6",
  });

  try {
    const matched = await objValidation.check();
    if (!matched) {
      return res
        .status(422)
        .send({ message: "Validation Error", errors: objValidation.errors });
    }

    const userData = await AdminDB.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }
    const passwordResult = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!passwordResult) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    console.log("hi", userData);
    const token = jwt.sign(
      { email: userData.email, id: userData._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token: token,
      result: userData,
    });
  } catch (err) {
    // Helper.writeErrorLog(req, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.auth = async (req, res, next) => {
  try {
    const user = req.userData;
    return res.status(200).json({
      message: "Profile returned successfully",
      result: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Auth Fail",
      error: err.message,
    });
  }
};

exports.getAllUser = async (req, res, next) => {
  let { page, limit, search } = req.query;

  if ([1, "", 0, undefined, null].includes(page)) {
    page = 1;
  }
  if (["", undefined, null].includes(search)) {
    search = "";
  }
  if ([1, "", 0, undefined, null].includes(limit)) {
    limit = 10;
  }
  let options = {
    page: page,
    limit: limit,
    // search: search,
  };

  let matchObj = {};
  if (search) {
    matchObj.name = {
      $regex: search,
      $options: "i",
    };
  }

  matchObj.flag = {
    $in: [1, 2],
  };

  try {
    const userAggregate = UserDB.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: matchObj,
      },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          profilePic: 1,
          flag: 1,
        },
      },
    ]);

    const result = await UserDB.aggregatePaginate(userAggregate, options);
    return res.status(200).json({
      message: "Get Users returned successfully",
      result: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Auth Fail",
      error: err.message,
    });
  }
};

exports.change_status = async (req, res) => {
  const id = req.params.id;

  const Validator = new niv.Validator(req.body, {
    flag: "required|in:1,2,3",
  });

  const matched = await Validator.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: Validator.errors,
    });
  }
  const flag = req.body.flag;
  let updateObj = {};
  updateObj.flag = flag;
  try {
    let message;
    if (flag == 1) message = "USer has been successfully enabled";
    if (flag == 2) message = "USer has been successfully disabled";
    if (flag == 3) message = "USer has been successfully deleted";

    const result = await UserDB.findByIdAndUpdate(
      id,
      {
        $set: updateObj,
      },
      {
        new: true,
      }
    );

    return res.status(202).json({
      message: message,
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  const objValidation = new niv.Validator(req.body, {
    name: "required",
    email: "required",
  });

  try {
    const matched = await objValidation.check();
    if (!matched) {
      return res
        .status(422)
        .send({ message: "Validation error", errors: objValidation.errors });
    }

    const userData = await UserDB.findById(id);
    console.log("userData", userData);
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    userData.name = req.body.name;
    userData.email = req.body.email;
    if (req.file) {
      userData.profilePic = req.file.path;
    }

    const result = await userData.save();
    return res.status(200).json({
      message: "User has been successfully updated",
      result: result,
    });
  } catch (err) {
    // Helper.writeErrorLog(req, err);
    return res.status(500).json({
      message: "Error occurred, Please try again later",
      error: err.message,
    });
  }
};
