const mongoose = require("mongoose");

const DBurl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@keshav.jgrwa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
    const result = await mongoose.connect(DBurl);
    console.log("🚀 Database Connected ...");
  } catch (err) {
    console.error(err.message);
    console.log("Something went wrong");
    process.exit(1);
  }
};

module.exports = connectDB;
