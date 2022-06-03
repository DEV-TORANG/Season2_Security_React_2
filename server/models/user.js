const mongoose = require('mongoose');    // mongoose 연결
const userSchema = mongoose.Schema( {    // 스키마 세팅
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
const User = mongoose.model('testUser', userSchema)  // 모델로 감싸주고
module.exports = { User }                        // export