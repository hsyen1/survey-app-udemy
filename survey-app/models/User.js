const mongoose = require("mongoose");
const { Schema } = mongoose;
// equivalent to const Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 },
  stripeCustomer: {
    id: String,
    email: String,
  },
});

const userModel = mongoose.model("users", userSchema);
