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
  if(password1 !== password2){
    req.flash('error', 'Mật khẩu không trùng khớp');
    res.redirect('back');
    return;
  }
  next();
}