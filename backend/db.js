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

const User = mongoose.model('User', userSchema)

module.exports = {User};