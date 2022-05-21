const express = require('express');
const models = require("../models");
const router = express.Router();

// users(.js)/sign_up 접속시 get.
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});

// users(.js)/sign_up 접속시 POST 출력값.
router.post("/sign_up", function(req,res,next){
  let body = req.body;

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password
  })
  .then( result => {
    console.log("성공");
    res.redirect("/users/login");
  })
  .catch( err => {
    console.log("실패");
    console.log(err)
  })
})

// users(.js)/login 접속시 get.
router.get('/login', function(req, res, next) {
  res.render("user/Login");
});

// users(.js)/login 접속시 POST 출력값.
router.post("/login", function(req,res,next){
  let body = req.body;

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password
  })
  .then( result => {
    console.log("성공");
    res.redirect("/users/sign_up");
  })
  .catch( err => {
    console.log("실패");
    console.log(err)
  })
})


module.exports = router;