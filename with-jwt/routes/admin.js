const express = require('express');
const adminMiddleware = require('../middleware/admin');
const { Admin, Course } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
const {jwt_secret} = require('../config');

router.post('/signup', async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  await Admin.create({
    username: username,
    password: password
  })

  res.json({
    msg: 'Admin created successfully'
  })

});

router.post('/signin', async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.find({
    username: username,
    password: password
  });

  if(admin){
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

router.post('/courses', adminMiddleware, async (req,res)=>{
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price
  })

  res.json({
    msg: "Course created successfully",
    courseId: newCourse._id
  })
});

router.get('/courses', adminMiddleware, async (req,res)=>{
  const allCourses = await Course.find({});
  
  res.json({
    courses: allCourses
  });
});

module.exports = router