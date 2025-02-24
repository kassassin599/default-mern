const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const UserController = require("../controllers/user");
const UserAuth = require("../middleware/user-check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/user/");
  },
  filename: function (req, file, cb) {
    cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Reject file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/heic"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.post("/register", upload.single("profilePic"), UserController.register);
router.post("/login", UserController.login);
router.get("/auth", UserAuth, UserController.auth);
router.post("/info", UserAuth, UserController.info);
router.get("/get-info", UserAuth, UserController.getInfo);
module.exports = router;
