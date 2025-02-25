const express = require("express");
const router = express.Router();
const multer = require("multer");
const Helper = require("../helper/index");
const AdminController = require("../controllers/admin");
const AdminAuth = require("../middleware/admin-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/admin/");
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

router.post("/register", upload.single("profilePic"), AdminController.register);
router.post("/login", AdminController.login);
router.get("/auth", AdminAuth, AdminController.auth);
router.get("/get-all-user", AdminAuth, AdminController.getAllUser);
router.put("/change-status/:id", AdminAuth, AdminController.change_status);
router.put(
  "/update/:id",
  upload.single("profilePic"),
  AdminAuth,
  AdminController.update
);
router.post(
  "/add",
  upload.single("profilePic"),
  AdminAuth,
  AdminController.adduser
);
module.exports = router;
