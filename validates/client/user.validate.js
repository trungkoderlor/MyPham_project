module.exports.resetPasswordPost = async (req, res, next ) => {
  const {password1, password2} = req.body;
  if (!password1 ) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect('back');
    return;
  }
  if (!password2) {
    req.flash('error', 'Vui lòng nhập mật khẩu xác nhận');
    res.redirect('back');
  }
  if (password1.length < 6 || password2.length < 6) {
    req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
    res.redirect('back');
    return;
  }
  if(password1 !== password2){
    req.flash('error', 'Mật khẩu không trùng khớp');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.loginPost = async (req, res, next ) => {
  const {email, password} = req.body;
  if (!email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect('back');
    return;
  }
  if (!password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect('back');
    return;
  }
  if (password.length < 6) {
    req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.registerPost = async (req, res, next ) => {
  const {fullname,email, phone,password, password2} = req.body;
  if (!fullname) {
    req.flash('error', 'Vui lòng nhập họ tên');
    res.redirect('back');
    return;
  }
  if (!email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect('back');
    return;
  }
  if (!phone) {
    req.flash('error', 'Vui lòng nhập số điện thoại');
    res.redirect('back');
    return;
  }
  if (!password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect('back');
    return;
  }
  if (!password2) {
    req.flash('error', 'Vui lòng nhập mật khẩu xác nhận');
    res.redirect('back');
    return;
  }
  if (password.length < 6 || password2.length < 6) {
    req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
    res.redirect('back');
    return;
  }
  if(password !== password2){
    req.flash('error', 'Mật khẩu không trùng khớp');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.forgotPasswordPost = async (req, res, next ) => {
  const {email} = req.body;
  if (!email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.otpPasswordPost = async (req, res, next ) => {
  const {email,otp1,otp2,otp3,otp4} = req.body;
  if (!otp1 || !otp2 || !otp3 || !otp4) {
    req.flash('error', 'Vui lòng nhập mã OTP');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.editInfo = async (req, res, next ) => {
  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect('back');
    return;
  }
  if (!phone) {
    req.flash('error', 'Vui lòng nhập số điện thoại');
    res.redirect('back');
    return;
  }
  next();
}
module.exports.changePassword = async (req, res, next ) => {
  const {oldpassword, password1, password2} = req.body;
  if (!oldpassword ) {
    req.flash('error', 'Vui lòng nhập mật khẩu cũ');
    res.redirect('back');
    return;
  }
  if (!password1 ) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect('back');
    return;
  }
  if (!password2) {
    req.flash('error', 'Vui lòng nhập mật khẩu xác nhận');
    res.redirect('back');
  }
  if (password1.length < 6 || password2.length < 6) {
    req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
    res.redirect('back');
    return;
  }
  if(password1 !== password2){
    req.flash('error', 'Mật khẩu không trùng khớp');
    res.redirect('back');
    return;
  }
  next();
}
