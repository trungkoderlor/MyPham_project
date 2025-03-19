const User = require('../../models/user.model');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const Review = require('../../models/review.model');
const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/room-chat.model');
const Notification = require('../../models/notification.model');
const ProductHelper = require('../../helpers/product.js');
const md5 = require('md5');
const generateHelper = require('../../helpers/generate');
const ForgotPassword = require('../../models/forgot-password.model');
const sendMailHelper = require('../../helpers/sendMail');


const e = require('connect-flash');
//[GET]/user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
}
//[POST]/user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail) {
    req.flash('error', 'Email đã tồn tại');
    res.redirect('back');
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect('/');
}
//[GET]/user/login
module.exports.login = async (req, res) => {
  if (req.cookies.tokenUser) {
    res.redirect('/');
  }
  else {
    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập",
      expressFlash:
      {
        success: req.flash('success'),
        error: req.flash('error')

      }
    });
  }

}
//[POST]/user/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
    deleted: false
  })
  if (!user) {
    req.flash('error', 'Tài khoản không tồn tại');
    res.redirect('back');
    return;
  }
  if (user.password !== md5(password)) {
    req.flash('error', 'Mật khẩu không chính xác');
    res.redirect('back');
    return;
  }
  if (user.status === 'inactive') {
    req.flash('error', 'Tài khoản chưa được kích hoạt');
    res.redirect('back');
    return;
  }
  const cart = await Cart.findOne({ user_id: user.id });
  if (cart) {
    res.cookie("cartId", cart.id);
  }
  else {
    await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
  }
  res.cookie("tokenUser", user.tokenUser);
  let returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  if (returnTo.startsWith('/user/')) {
    returnTo = '/';
  }
  res.redirect(returnTo);
}
//[GET]/user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser');
  res.clearCookie('cartId');
  res.redirect('/user/login');

}
//[GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
}
//[POST]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const user = await User.findOne({ email: req.body.email, deleted: false });
  if (!user) {
    req.flash('error', 'Email không tồn tại');
    res.redirect('back');
    return;
  }
  if (user.status === 'inactive') {
    req.flash('error', 'Tài khoản chưa được kích hoạt');
    res.redirect('back');
    return;
  }
  //luu vao bang forgot-password
  const ExistOTP = await ForgotPassword.findOne({ email: user.email });
  if (ExistOTP) {
    await ForgotPassword.deleteOne({ email: user.email });
  }
  const objectForgotPassword = {
    email: user.email,
    expireAt: Date.now(),
    otp: generateHelper.generateRandomNumber(4)
  }
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //nếu tồn tại email thì gửi OTP qua email
  const subject = "Mã OTP đổi mật khẩu";
  const html = `Mã OTP của bạn là:<b> ${forgotPassword.otp}</b>.Thời gian hiệu lực 3 phút`;
  sendMailHelper.sendMail(user.email, subject, html)
  res.redirect(`/user/password/otp?email=${user.email}`);

}
//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {

  const email = req.query.email;
  if (!email) {
    res.redirect('/user/login');
    return;
  }
  // const forgotPassword = await ForgotPassword
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
    },
    email: email
  })
}
//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp1, otp2, otp3, otp4 } = req.body;
  const otp = otp1 + otp2 + otp3 + otp4;
  const forgotPassword = await ForgotPassword.findOne({ email: email, otp: otp });
  if (!forgotPassword) {
    req.flash('error', 'Mã OTP không chính xác');
    res.redirect('back');
    return;
  }
  const user = await User.findOne({ email: email });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect(`/user/password/reset`);
}
//[GET]/user/password/reset
module.exports.resetPassword = async (req, res) => {
  if (!req.cookies.tokenUser) {
    res.redirect('/user/login');
    return;
  }
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
    }

  })
}
//[POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const { password1, password2 } = req.body;
  const password = md5(password1);
  await User.updateOne({ tokenUser: req.cookies.tokenUser }, { password: password });
  res.redirect('/');
}
//[GET]/user/info
module.exports.info = async (req, res) => {


  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân",
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
    }
  })
}
//[POST]/user/info/edit
module.exports.editInfo = async (req, res) => {
  const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
  console.log(req.body);
  if (req.file) {
    req.body.avatar = `/uploads/${req.file.filename}`;

  }
  try{
    await User.updateOne({ tokenUser: req.cookies.tokenUser }, req.body);
    req.flash('success', 'Cập nhật thông tin thành công');
    
    
  }
  catch(error){
    
    req.flash('error', 'Cập nhật thông tin thất bại');
  }
  res.redirect('/user/info');
  


}
//[POST]/user/info/change-password
module.exports.changePassword = async (req, res) => {
  const { password1, password2, password3 } = req.body;
  const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
  if (user && user.password === md5(password1))
  {
    await User.updateOne({ tokenUser: req.cookies.tokenUser }, { password: md5(password2) });
    req.flash('success', 'Đổi mật khẩu thành công');
    res.redirect('/user/info');
  }
  else
  {
    req.flash('error', 'Mật khẩu cũ không chính xác');
    res.redirect('back');
  }
}
//[GET]/user/history-orders
module.exports.historyOrders = async (req, res) => {

  const status = req.query.status ? req.query.status : "";
  var orders;
  if (status !== "") {
    orders = await Order.find({ user_id: res.locals.clientUser.id, status: status }).sort({ createdAt: -1 });
  }
  else {
    orders = await Order.find({ user_id: res.locals.clientUser.id }).sort({ createdAt: -1 });
  }
  for (const order of orders) {
    for (const product of order.products) {
      const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail slug stock");
      product.productInfo = productInfo;
      const review = await Review.findOne({ user_id: res.locals.clientUser.id, product_id: product.product_id, order_id: order._id });
      product.review = review;
      product.priceNew = ProductHelper.newPriceOne(product);
      product.totalPrice = product.priceNew * product.quantity;
      await Product.updateOne({ _id: product.product_id }, { stock: productInfo.stock - product.quantity });
    }
    order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);
  }
  res.render("client/pages/user/history-orders", {
    orders: orders,
    pageTitle: "Lịch Sử Đơn Hàng",
    status: status,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
    }
  })
}
//[POST]/user/history-orders/cancel
module.exports.CancelOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findOne({ _id: orderId });
  if (order.status != 'completed'){
    await Order.updateOne({ _id: orderId }, { status: 'canceled' });
    for (const product of order.products) {
      const productInfo = await Product.findOne({ _id: product.product_id });
      await Product.updateOne({ _id: product.product_id }, { stock: productInfo.stock + product.quantity , sold: productInfo.sold - product.quantity });
    }
    req.flash('success', 'Hủy đơn hàng thành công');
    res.redirect('back');
  }

}
//[POST]/user/history-orders/confirm
module.exports.ConfirmOrder = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findOne({ _id: orderId });
  if (order.status === 'shipping') {
    await Order.updateOne({ _id: orderId }, { status: 'completed' });
    req.flash('success', 'Xác nhận đơn hàng thành công');
    res.redirect('back');
  }
 }
//[POST]/user/history-orders/unreceived
module.exports.Unreceived = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findOne({ _id: orderId });
  const user = await User.findOne({ _id: order.user_id });
  if (order.status === 'shipped') {
    await Order.updateOne({ _id: orderId }, { status: 'unreceived' });
    const notification = new Notification({
      userId: order.user_id,
      content: `Khách hàng ${order.userInfo.name} đã xác nhận chưa nhận được hàng`,
      type: 'orders',
      title: 'Khách hàng chưa nhận được hàng',
      relatedId: order._id,
      detailLink: `/admin/orders/detail/${order._id}`
  });
  await notification.save();
  _io.emit('NEW_NOTIFICATION', notification);
    req.flash('success', 'Xác nhận chưa nhận được hàng thành công');
    res.redirect('back');
  }
}
//[POST]/user/history-orders/review/:orderId
module.exports.review = async (req, res) => {

  const orderId = req.params.orderId;
  req.body.order_id = orderId;
  const order = await Order.findOne({ _id: orderId });
  const product_id = req.body.product_id;
  req.body.rating = parseInt(req.body.rating);
  req.body.user_id = res.locals.clientUser.id;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  try {
    const review = new Review(req.body);
    await review.save();
    await Order.updateOne({ _id: orderId, "products.product_id": product_id }, { $set: { "products.$.status": "reviewed" } });
    const product = await Product.findOne({ _id: product_id });
    await Product.updateOne({ _id: product_id }, { $set: { count_reviews: product.count_reviews + 1, rating: (product.rating * product.count_reviews + req.body.rating) / (product.count_reviews + 1) } });
    res.redirect('back');
  } catch (error) {
    console.log(error);

  }

}
//[GET] /admin/users/chat
module.exports.chat = async (req, res) => {
  const roomchat = await RoomChat.findOne({ user_id: res.locals.clientUser._id });
  var chats = null;
  if (roomchat) {
    chats = await Chat.find({
      deleted: false,
      room_chat_id: roomchat._id
    }).sort({ createdAt: -1 });
  }
  else {
    chats = [];
  }
  res.render('client/pages/user/chat', {
    pageTitle: "Trò chuyện",
    chats: chats,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')
    }
  });
}
