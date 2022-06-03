const mongoose = require('mongoose');   // mongoose 연결
const bcrypt = require('bcrypt');       // 암호화를 위한 bcrypt
const saltRounds = 10;                  // 여러번 암호화 반복으로 해킹 힘들게하기
const jwt = require('jsonwebtoken');    // JWT 토큰

const userSchema = mongoose.Schema( {   // 스키마 세팅
  name:  {
    type: String,  
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,               // 공백 제거
    unique: 1                 // email 중복 안됨
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {                      //가입자(디폴트, 0), 관리자
    type: Number, 
    default: 0
  },
  image: String,
  token: {                     // 토큰 설정 (나중에 유효성 관리 가능)
    type: String
  },
  tokenExp: {                  // 토큰 유효기간
    type: Number
  }
})

userSchema.pre('save', function(next) {
  //비밀번호 암호화
  var user = this;
  if(user.isModified('password')) {  // pw변경시에만 해쉬값 넣도록
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err) //에러나오면 index로
      bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.
        if(err) return next(err)
        user.password = hash
        next()  // hash값 저장했으면 index로
      });
    });
  } else {
    next()
  }
})

// 비밀번호 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err),
    cb(null, isMatch)
  })
}

// 토큰 생성
// 이후 Access 및 Refresh 토큰으로 수정 필요.
userSchema.methods.generateToken = function(cb) {
  var user = this; // ES5문법
  //jsonwebtoken이용해서 token생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken') 
  //user._id + 'secretToken' = token
  //_id는 데이터베이스에 저장된 id값
  // -> 'secretToken' -> user_.id 확인가능
  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}

const User = mongoose.model('testUser', userSchema)  // 저장될 모델 이름
module.exports = { User }                        // export