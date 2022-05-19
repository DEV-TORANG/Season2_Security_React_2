const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
var router = express.Router()

router.get('/', function(req, res){
    delete req.session.uname;
    delete req.session.pw;
    delete req.session.isLogined;
    req.session.save(function(){
        res.redirect('/0')
    })
})

module.exports = router