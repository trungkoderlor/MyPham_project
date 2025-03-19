
const User = require("../../models/user.model");
module.exports.Guess = async (req, res, next) => { 
  if(req.cookies.tokenUser){
    const user= await User.findOne({tokenUser: req.cookies.tokenUser}).select('-password');
    if(user){
      res.locals.clientUser = user;
    }
  }
  next();
  }
  
