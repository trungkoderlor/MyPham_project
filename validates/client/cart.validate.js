module.exports.QuantityPost = async (req, res, next ) => {
  let quantity = parseInt(req.body.quantity);
  if (quantity <= 0) {
    req.flash('error', 'Số lượng không hợp lệ');
    res.redirect('back');
    return
  }
  if (!quantity) {
    req.flash('error', 'Vui lòng chọn số lượng');
    res.redirect('back');
    return;
  }
 
  next();
}
module.exports.QuantityGet = async (req, res, next ) => {
  const quantity = parseInt(req.params.quantity);
  if (quantity <= 0) {
    req.flash('error', 'Số lượng không hợp lệ');
    res.redirect('back');
    return
  }

  if (!quantity) {
    req.flash('error', 'Vui lòng chọn số lượng');
    res.redirect('back');
    return;
  }
  next();
}