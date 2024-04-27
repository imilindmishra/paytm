const express = require('express');
const zod = require("zod");
const router = express.Router();
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config").JWT_SECRET;


const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

router.post("/Signup", async (req,res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.json({
          message: "Incorrect Inputs",
        });
    }
    const user = User.findOne({
        username: body.username
    })

    if (user._id) {
        return res.json({
            message: "User already exists"
        })
    }

    const newUser  = await User.create(body);
    const token = jwt.sign({
        userID: newUser._id
    }, JWT_SECRET)
    res.json({
        message: "User Created Successfully",
        token: token
    })
})

router.post("/signin", async(req,res) => {
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
          message: "Incorrect Inputs",
        });
    } 
    
    const user = await findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userID: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        });
        return;
    }
})
    

module.exports = router;