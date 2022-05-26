const mongoose = require("mongoose");
const { Schema } = mongoose;
// equivalent to const Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String,
});

const userModel = mongoose.model("users", userSchema);
