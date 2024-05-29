const express = require('express');
const userMiddleware = require('../middleware/user');
const { User, Course } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {jwt_secret} = require('../config');

router.post('/signup', async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  await User.create({
    username: username,
    password: password
  })

  res.json({
    msg: 'User created successfully'
  })

});

router.post('/signin', async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({
    username: username,
    password: password
  });

  if(user){
    const token = jwt.sign({
      username
    },jwt_secret)
  
    res.json({
      token
    });
  }else{
    res.status(411).json({
      msg: "Incorrect username or password"
    });
  }
});

router.get('/courses', async (req,res)=>{
  const allCourses = await Course.find({});
  
  res.json({
    coures: allCourses
  });
});

router.post('/courses/:courseId', userMiddleware, async (req,res)=>{
  const courseId = req.params.courseId;
  const username = verifiedUsername;

  await User.updateOne({
    username: username
  },{
    "$push": {
      purchasedCourses: courseId
    }
  })

  res.json({
    msg: "Purchase Complete!"
  });
});

router.get('/courses/purchasedCourses', userMiddleware, async (req,res)=>{
  const user = await User.findOne({
    username: verifiedUsername
  });

  const courses = await Course.find({
    _id: {
      "$in": user.purchasedCourses
    }
  });

  res.json({
    purchasedCourses: courses
  });

})


module.exports = router