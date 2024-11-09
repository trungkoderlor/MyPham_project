// [GET] /admin/auth/login
const Account = require("../../models/account.model");
const systemConfig = require('../../config/system');
const md5 = require('md5');
module.exports.login = async (req, res) => {
  if(req.cookies.token){
    const user= await Account.findOne({deleted:false , token: req.cookies.token});
    if (user){
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
      return;
    }
  else{
    res.clearCookie("token");
    }
  }
    res.render("admin/pages/auth/login",{
      pageTitle: "Trang đăng nhập",
      expressFlash:
        {
            success: req.flash('success'),
            error: req.flash('error')

        }

  })
}
  
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash("error", `Tài khoản không tồn tại !`);
    res.redirect('back');
    return;
  }
  if(md5(password) != user.password){
    req.flash("error", `Mật khẩu không đúng !`);
    res.redirect('back');
    return;
  }
  if(user.status == "inactive"){
    req.flash("error", `Tài khoản đã bị khóa !`);
    res.redirect('back');
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}
// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}