const express = require('express');
const models = require("../models");
const crypto = require('crypto');
const { appendFile } = require('fs');
const router = express.Router();

// access token을 secret key 기반으로 생성
const generateAccessToken = (id) => {
  return jwt.sign({
      id                // generateAccessToken(id)
    },
    secretObj.access,   // config/jwt(.js) 내의 access 값
    {
      expiresIn: "30m", // 30분만 저장
  });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
  return jwt.sign({
      id                // generateRefreshToken(id)
    },
    secretObj.refresh,   // config/jwt(.js) 내의 refresh 값
    {
      expiresIn: "180 days", // 3달 저장.
  });
};

// Access Token 유효성 검사
const authenticateAccessToken = (req, res) =>{
  let token = req.cookies.user;

  if(!token){
    console.log("토큰이 없거나, 토큰 전송이 되지 않았습니다.");
    res.redirect("/users/login");
  }

  jwt.verify(token, secretObj.access, (error, user) => {
    if (error) {
        console.log("JWT 검증 Error");
        res.redirect("/error");
    }

    req.user = user;
    return 1;
  });
};

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
// 메인 페이지
router.get('/', function(req, res, next) {
  if(req.cookies){
    console.log(req.cookies);
  }
  res.send('환영합니다~');
});

// 로그인 GET
router.get('/login', function(req, res, next) {
  res.render("user/login");
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

  let checkCookies = authenticateAccessToken(req, res);

  // 쿠키 인증이 되었다면,
  if( checkCookies == 1 ){
    res.redirect("/users");
  }

  // 쿠키 인증이 안됬고, 패스워드로 인증하기.
  else if(dbPassword === hashPassword){
    console.log("비밀번호 일치");

    // AccessToken 성공시에 Access 및 Refresh 토큰 발급
    let AccessToken = generateAccessToken(id);
    let RefreshToken = generateRefreshToken(id);

    res.json({ AccessToken, RefreshToken });

    // AccessToken 쿠키 저장
    res.cookie("user", AccessToken , {
      expires: new Date(Date.now() + 900000),
      httpOnly: true      // XSS 공격 대처방안.
    });
    // RefreshToken 쿠키 저장
    res.cookie("user", RefreshToken , {
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