module.exports.ContactPost = async (req, res, next ) => {
  const {fullname, email, phone, message} = req.body;
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
  if (!message) {
    req.flash('error', 'Vui lòng nhập nội dung');
    res.redirect('back');
    return;
  }
  next();
}