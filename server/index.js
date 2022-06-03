const express = require('express')      // express 모듈 가져옴
const app = express()                   // express 앱 만들기
const port = 3000                       // 서버 포트 번호
const bodyParser = require('body-parser')// 클라-서버 정보 교환을 위함
const {User} = require('./models/user') // 스키마 모델 불러오기
const mongoose = require('mongoose')    // MongoDB 연동
const config = require('./config/key')  // MongoDB 아이디/비밀번호 저장된 파일 불러오기
const cookieParser = require('cookie-parser')
app.use(cookieParser());                // 쿠키 저장을 위한 쿠키 파서 모듈 사용


// body-parser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 하는 것
// application/x-www-form-urlencoded 형식
app.use(bodyParser.urlencoded({extended: true})); 
//application/json 형식
app.use(bodyParser.json());

// DB 연동
mongoose.connect(config.mongoURI)
.then(() => console.log('== MongoDB Connected =='))
.catch(err => console.log(err))

// Register를 위한 라우트
app.post('/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들 client에서 가져오면 
    //해당 데이터를 데이터베이스에 넣어준다.
    const user = new User(req.body) // req.body안에는 정보 들어있음(id, pw) *bodyparser 가져왔기 때문에 가능
    user.save((err,userInfo) => { // mongoDB 메소드, save해주면 Usermodel에 저장됨
      if(err) return res.json({success:false, err})
      return res.status(200).json ({sucess: true }) //status200은 성공했음을 의미
		})
})

// 로그인을 위한 라우트
app.post('/login',(req,res) => {
	// 요청된 이메일을 데이터베이스에 있는지 찾기
	User.findOne({email: req.body.email}, (err, user) => {
		if(!user) {
			return res.json({
					loginSuccess: false,
					message: "제공된 이메일에 해당하는 유저가 없습니다."
			})
		}
		// 요청한 이메일이 데이터베이스에 있다면 비밀번호 맞는지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch)
				return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
			// 토큰 생성하기
			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				// 쿠키에 토큰을 저장
				// 이후 Access 및 Refresh 토큰으로 수정 필요
				res.cookie("x_auth", user.token)
				.status(200)
				.json({ loginSuccess: true, userId: user._id })
			})
		})
	})
})


// 기본 화면
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 접속시 콘솔에 표시.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})