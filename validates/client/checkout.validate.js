module.exports.Checkout = async (req, res,next ) => {
  const {name, phone, address} = req.body;
  if (!name) {
    req.flash('error', 'Vui lòng nhập tên');
    res.redirect('back');
    return;
  }
  if (!phone) {
    req.flash('error', 'Vui lòng nhập số điện thoại');
    res.redirect('back');
    return;
  }
  if (!address) {
    req.flash('error', 'Vui lòng nhập địa chỉ');
    res.redirect('back');
    return;
  }
  next();
};