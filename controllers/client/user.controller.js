const User = require('../../models/user.model');
const Cart = require('../../models/cart.model');
const md5 = require('md5');
const generateHelper = require('../../helpers/generate');
const ForgotPassword = require('../../models/forgot-password.model');
const sendMailHelper = require('../../helpers/sendMail');
//[GET]/user/register
module.exports.register =async (req, res) => {
    res.render("client/pages/user/register",{
        pageTittle: "Đăng ký tài khoản",
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }
    });
}

//[POST]/user/register
module.exports.registerPost =async (req, res) => {
  const existEmail = await User.findOne({email: req.body.email});
  if(existEmail){
      req.flash('error', 'Email đã tồn tại');
      res.redirect('back');
      return;
      }
  req.body.password =md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser",user.tokenUser);
  res.redirect('/');
}
//[GET]/user/login
module.exports.login =async (req, res) => {

    res.render("client/pages/user/login",{
        pageTittle: "Đăng nhập",
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }
    });
}
//[POST]/user/login
module.exports.loginPost =async (req, res) => {
  const {email,password} = req.body;
  const user = await User.findOne({
    email: email,
    deleted :false
  })
  if(!user){
    req.flash('error', 'Tài khoản không tồn tại');
    res.redirect('back');
    return;
  }
  if(user.password !== md5(password)){
    req.flash('error', 'Mật khẩu không chính xác');
    res.redirect('back');
    return;
  }
  if(user.status === 'inactive'){
    req.flash('error', 'Tài khoản chưa được kích hoạt');
    res.redirect('back');
    return;
  }
  const cart = await Cart.findOne({user_id: user.id});
  if (cart){
    res.cookie("cartId",cart.id );
  }
  else{
    await Cart.updateOne({_id : req.cookies.cartId}, {user_id: user.id});
  }
  res.cookie("tokenUser",user.tokenUser);

  res.redirect('/');

}
//[GET]/user/logout
module.exports.logout =async (req, res) => {
  res.clearCookie('tokenUser');
  res.clearCookie('cartId');
  res.redirect('/user/login');

}
//[GET]/user/password/forgot
module.exports.forgotPassword =async (req, res) => {
    res.render("client/pages/user/forgot-password",{
        pageTittle: "Quên mật khẩu",
        expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }
    });
}
//[POST]/user/password/forgot
module.exports.forgotPasswordPost =async (req, res) => {
  const user = await User.findOne({email: req.body.email,deleted :false});
  if(!user){
    req.flash('error', 'Email không tồn tại');
    res.redirect('back');
    return;
  }
  if (user.status === 'inactive'){
    req.flash('error', 'Tài khoản chưa được kích hoạt');
    res.redirect('back');
    return;
  }
  //luu vao bang forgot-password
  const objectForgotPassword = {
    email: user.email,
    expireAt: Date.now(),
    otp: generateHelper.generateRandomNumber(8)
  }
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //nếu tồn tại email thì gửi OTP qua email
  const subject = "Mã OTP đổi mật khẩu";
  const html = `Mã OTP của bạn là:<b> ${forgotPassword.otp}</b>.Thời gian hiệu lực 3 phút`;
  sendMailHelper.sendMail(user.email,subject,html)
  res.redirect(`/user/password/otp?email=${user.email}`);

}
//[GET]/user/password/otp
module.exports.otpPassword = async (req,res)=>{
  const email = req.query.email;
  // const forgotPassword = await ForgotPassword
  res.render("client/pages/user/otp-password",{
    pageTittle: "Nhập mã OTP",
    expressFlash:
    {
        success: req.flash('success'),
        error: req.flash('error')
      },
      email: email
  })
}
//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req,res)=>{
  const {email,otp} = req.body;
  const forgotPassword = await ForgotPassword.findOne({email: email,otp: otp});
  if(!forgotPassword){
    req.flash('error', 'Mã OTP không chính xác');
    res.redirect('back');
    return;
  }
  const user = await User.findOne({email : email});
  res.cookie("tokenUser",user.tokenUser);
  res.redirect(`/user/password/reset`);
}
//[GET]/user/password/reset
module.exports.resetPassword = async (req,res)=>{
  res.render("client/pages/user/reset-password",{
    pageTittle: "Đổi mật khẩu",
    expressFlash:
    {
        success: req.flash('success'),
        error: req.flash('error')
      }
    
  })
}
//[POST]/user/password/reset
module.exports.resetPasswordPost = async (req,res)=>{
  const {password1,password2} = req.body; 
  const password = md5(password1);
  await User.updateOne({tokenUser: req.cookies.tokenUser},{password: password});
  res.redirect('/');
}
//[GET]/user/info
module.exports.info = async (req,res)=>{
  

  res.render("client/pages/user/info",{
    pageTittle: "Thông tin cá nhân",
    expressFlash:
    {
        success: req.flash('success'),
        error: req.flash('error')
      }
  })
}