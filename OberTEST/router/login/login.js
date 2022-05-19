const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
var router = express.Router()
var session = require('express-session')
const { connect } = require('http2')
var MySQLStore = require('express-mysql-session')(session)

var option ={
    host: 'localhost',
    user: 'root' ,
    password: 'rudnf629843!@',
    database: 'obertest'
}
var sessionStore = new MySQLStore(option)

app.use(session({
    secret: 'my key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}))

router.post('/', function(req,res){
    const name = req.body.name
    const pw = req.body.pw
    var sql_insert = {name: name, pw: pw}
    connection.query('select * from user_info where name=?', [name], function(err, rows){
        if(rows.length){
            if(rows[0].name === name){
                connection.query('select * from user_info where pw=?', [pw], function(err, rows){
                    if(err){
                        throw err
                    }
                    if(rows.length){
                        req.session.uname = rows[0].name
                        req.session.upw = rows[0].pw
                        req.session.isLogined = true;
                        req.session.save(function(){
                            res.json({'result': 'ok'})
                        })
                    }
                    else{
                        res.json({'result': 'pwfalse'})
                    }
                })
            }
        }
        else{
            res.json({'result': 'idfalse'})
        }
    })
})
module.exports = router