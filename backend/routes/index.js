const express = require('express');
const userRouter = require('./user.js');

const router = express.Router();

app.use("/api/v1/user", userRouter);



module.exports = router;


