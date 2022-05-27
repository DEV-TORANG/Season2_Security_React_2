require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const models = require("../models");
const crypto = require('crypto');
const { appendFile } = require('fs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

router.use(cookieParser());

// access token을 secret key 기반으로 생성
const generateAccessToken = (id) => {
  return jwt.sign({
      id                // generateAccessToken(id)
    },
    process.env.ACCESS_TOKEN_SECRET,   // env 내의 access 값
    {
      expiresIn: '30m' // 30분만 저장
  })
}

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
  return jwt.sign({
      id                // generateRefreshToken(id)
    },
    process.env.REFRESH_TOKEN_SECRET,   // env 내의 refresh 값
    {
      expiresIn: '180 days' // 3달 저장
  })
}

// Access Token 유효성 검사
const f_authenticateAccessToken = (req, res) =>{
  let Access = req.cookies.OberUser_Access;

  if(!Access){
    console.log("Access 토큰이 없습니다.");
    res.redirect("/users/login");
  }

  let decode = jwt.verify(Access, process.env.ACCESS_TOKEN_SECRET);

  if(decode){
    console.log("Access 토큰이 존재합니다.");
    res.redirect("/users");
  }
};

// Access Token 유효성 검사
const authenticateAccessToken = (req, res) =>{
  let Access = req.cookies.OberUser_Access;

  if(!Access){
    console.log("Access 토큰이 없습니다.");
  }

  let decode = jwt.verify(Access, process.env.ACCESS_TOKEN_SECRET);

  if(!decode){
    console.log("Access 토큰이 없습니다.");
    return 0;
  }
  else{
    console.log("Access 토큰이 존재합니다.");
    return 1;
  }
};

//###############################################################################
// users(.js)/sign_up 접속시 get.
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});

// users(.js)/sign_up 접속시 POST 출력값.
router.post("/sign_up", async function(req,res,next){
  let body = req.body;

  // inputPassword(DB에 저장할 값) 을 패스워드와 salt를 합치고
  // hashPassword에 sha512를 사용하여 제작.
  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("base64");

  let result = models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: hashPassword,
    salt: salt
    })
    .then( result => {
      console.log("성공");
      res.redirect("/users/login");
    })
    .catch( err => {
      console.log("실패");
      console.log("/users/sign_up");
  })
})

//###############################################################################
// 임시 로그인 후 메인 페이지
router.get('/', function(req, res, next) {
  if(req.cookies){
    console.log(req.cookies);
  }
  res.send('환영합니다~');
});

//###############################################################################
// 로그인 JWT 테스트 페이지 GET
router.get('/f_login', function(req, res, next) {
  res.render("user/f_login");
})

// 로그인 JWT 테스트 페이지 POST
router.post('/f_login', function(req, res, next) {
  f_authenticateAccessToken(req, res);
});


//###############################################################################
// 로그인 GET
router.get('/login', function(req, res, next) {
  res.render("user/login");
  let body = req.body;
});

// 로그인 POST
router.post("/login", async function(req,res,next){
  let body = req.body;

    let result = await models.user.findOne({
        where: {
            email : body.userEmail
        }
    });

    let id = req.body.userEmail;
    let dbPassword = result.dataValues.password;
    let inputPassword = body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("base64");


    // 쿠키 인증이 안됬고, 패스워드로 인증하기.
    if(dbPassword === hashPassword){
      console.log("비밀번호 일치");
      console.log("비밀번호로 토큰 발급합니다...");

      // 패스워드 인증 성공시에 Access 및 Refresh 토큰 발급
      let AccessToken = generateAccessToken(id);
      let RefreshToken = generateRefreshToken(id);

      // AccessToken 쿠키 저장
      res.cookie("OberUser_Access", AccessToken , {
        expires: new Date(Date.now() + 900000),
        httpOnly: true      // XSS 공격 대처방안.
      });
      // RefreshToken 쿠키 저장
      res.cookie("OberUser_Refresh", RefreshToken , {
        expires: new Date(Date.now() + 900000),
        httpOnly: true      // XSS 공격 대처방안.
      });

      res.redirect("/users");
    }
    else{
      console.log("비밀번호 불일치");
      res.redirect("/users/login");
    }
});

module.exports = router;