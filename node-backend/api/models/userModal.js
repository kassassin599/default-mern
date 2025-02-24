const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = mongoose.Schema(
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

UserSchema.plugin(aggregatePaginate)
UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("user", UserSchema);