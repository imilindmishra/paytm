import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()

mongoose.connect(process.env.MONGO_URI);

const userSchema =  new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
})

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.types.ObjectID, // Reference to user model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  }
});

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account,
};