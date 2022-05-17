const express = require('express');
const router = express.Router();
const models = require("../models");

// 뷰 페이지 응답 GET
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});

// 회원가입 버튼을 클릭 했을 때 처리하는 POST
router.post("/sign_up", function(req,res,next){
  let body = req.body;

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password
  })
  .then( result => {
    res.redirect("/users/sign_up");
  })
  .catch( err => {
    console.log(err)
  })
})

module.exports = router;