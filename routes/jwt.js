require("dotenv").config();
const jwt = require('jsonwebtoken');

const token = () =>{
    return{
        access(id){
            return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: "30m",
            });
        },
        refresh(id){
            return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: "180 days"
            });
        }
    }
}

exports.authenticate = (req, res, next) =>{
    if(req.query.id === 'hello'){
        req.authData = {
            status : 200,
            message : 'Correct User Data',
            jwt:{
                accessToken : token().access(req.query.id),
                refreshToken : token().refresh(req.query.id),
            }
        };
    }
    else{
        req.authData = {
            status : 400,
            message : 'Not Correct User Data'
        };
    }

    next();
}