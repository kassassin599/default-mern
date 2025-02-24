const mongoose = require("mongoose");
const AdminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    flag: {
      type: Number,
      default: 1, // 1=active, 2=deactivate 3=deleted
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", AdminSchema);
