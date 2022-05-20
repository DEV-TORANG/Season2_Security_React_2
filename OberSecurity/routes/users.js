const express = require('express');
const models = require("../models");
const router = express.Router();

// users(.js)/sign_up 으로 연결됨
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");    // user/signup(.ejs) 렌더링
});

router.post('/sign_up', function(req, res, next) {
  let body = req.body;

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password
  })
    .then( result => {
      console.log("데이터 추가 완료");
      res.redirect("/users/sign_up");
    })
    .catch( err => {
      console.log("데이터 추가 실패");
      console.log(err)
    })
});

module.exports = router;
