const {User} = require("../db");
const jwt = require("jsonwebtoken");
const {jwt_secret} = require("../config");

async function userMiddleware(req,res,next){
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];

  try{
    const verified = jwt.verify(jwtToken, jwt_secret);
    if(verified.username){
      verifiedUsername = verified.username
      next();
    }else{
      res.status(403).json({
        msg: "User doesn't exist"
      })
    }
  }catch(e){
    res.status(403).json({
      msg: "Token is invalid"
    })
  }
}

module.exports = userMiddleware;