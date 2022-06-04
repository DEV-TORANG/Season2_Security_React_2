const express = require("express")
const mongoose = require('mongoose')
const config = require('./config/dev')
const app = express()
const port = 5000

mongoose.connect(config.mongoURI)
.then(()=>console.log(' == MongoDB Connected == '))
.catch(err=>console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))