const express = require('express');
const models = require("../models");
const crypto = require('crypto');
const router = express.Router();

// users(.js)/sign_up 접속시 get.
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});

// users(.js)/sign_up 접속시 POST 출력값.
router.post("/sign_up", function(req,res,next){
  console.log("DB 되냐");
  let body = req.body;

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  console.log("DB 되냐");

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password,
    salt: salt
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
// 메인 페이지
router.get('/', function(req, res, next) {
  res.send('환영합니다~');
});

// 로그인 GET
router.get('/login', function(req, res, next) {
  res.render("users/login");
});

// 로그인 POST
router.post("/login", async function(req,res,next){
  let body = req.body;

  let result = await models.user.findOne({
      where: {
          email : body.userEmail
      }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
      console.log("비밀번호 일치");
      res.redirect("/user");
  }
  else{
      console.log("비밀번호 불일치");
      res.redirect("/user/login");
  }
});

module.exports = router;