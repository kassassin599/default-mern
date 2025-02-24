// const Helper = require("../helper/index");
const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const UserDB = require("../models/userModal");
const UserInfoDB = require("../models/userInfoModal");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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

    const userData = await UserDB.findOne({ email: req.body.email });
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

    const user = new UserDB({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      profilePic: req.file.path,
    });

    const result = await user.save();
    return res.status(201).json({
      message: "User has been successfully created",
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

    const userData = await UserDB.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    if (userData.flag === 2) {
      return res.status(401).json({
        message: "USer has been successfully disabled",
      });
    } else if (userData.flag === 3) {
      return res.status(401).json({
        message: "USer has been successfully deleted",
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
      user: userData,
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
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Auth Fail",
      error: err.message,
    });
  }
};

exports.info = async (req, res, next) => {
  const user = req.userData;

  try {
    const userData = await UserInfoDB.findOne({
      user_id: new mongoose.Types.ObjectId(user._id),
    });
    if (userData) {
      return res.status(409).json({
        message: "User Details already exists",
      });
    }
    const Info = new UserInfoDB({
      user_id: user._id,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
    });

    const result = await Info.save();
    console.log("user", result);
    return res.status(201).json({
      message: "User Details has been successfully created",
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

exports.getInfo = async (req, res, next) => {
  try {
    const getUser = req.userData;
    // const userData = await UserInfoDB.findOne(id);
    const userData = await UserInfoDB.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "catData",
        },
      },
      { $unwind: { path: "$catData", preserveNullAndEmptyArrays: true } },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          name: "$catData.name",
          email: "$catData.email",
          profilePic: "$catData.profilePic",
          flag: "$catData.flag",
          country: 1,
          state: 1,
          city: 1,
          pincode: 1,
          address: 1,
          // catData: 1,
        },
      },
    ]);
    console.log(userData);
    return res.status(200).json({
      message: "Profile returned successfully",
      user: userData[0],
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
    if (flag == 1) message = "Product has been successfully enabled";
    if (flag == 2) message = "Product has been successfully disabled";
    if (flag == 3) message = "Product has been successfully deleted";

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
