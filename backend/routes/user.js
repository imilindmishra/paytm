const express = require('express');
const zod = require("zod");
const router = express.Router();
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config").JWT_SECRET;
const {authMiddleware} = require("../middleware");


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

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})

router.put("/api/v1/user", authMiddleware, async(req,res) => {
    const body = req.body;
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        req.status(411).json({
            message: "Error while updating information"
        })
    }

        await User.updateOne({
            _id: req.userID
        }, body);

        res.json({
            message: "Updated Successfully"
        })
    
});

router.get("/bulk", async(req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
            }
        }, {
            lastName: {
                 "$regex": filter,
            }
    }]
})

res.json({
    user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id: user._id
    }))
    })
})
    

module.exports = router;