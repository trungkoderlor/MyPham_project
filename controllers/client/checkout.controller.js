//[GET] /checkout
const ProductHelper = require('../../helpers/product.js');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const Notification = require('../../models/notification.model');
const socket = require('../../config/socket.js');
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  let cart = await Cart.findOne({ _id: cartId });
  if(cart.products.length > 0){
    for (const product of cart.products) {
      const productInfo = await Product.findOne({ _id: product.product_id }).select("title price discountPercentage slug thumbnail");
      productInfo.priceNew = ProductHelper.newPriceOne(productInfo);
      product.productInfo = productInfo;
      product.totalPrice = productInfo.priceNew * product.quantity;
  }

   cart.totalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
}
  res.render('client/pages/checkout/index', {
    pageTitle: "Thanh Toán",
    cart: cart,
    expressFlash:{
      success: req.flash('success'),
      error: req.flash('error')
  }
  });
};
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  const userInfo = req.body;
  const products = [];
  for (const product of cart.products) {
    const productInfo = await Product.findOne({ _id: product.product_id }).select("title price discountPercentage stock sold");
    if (product.quantity > productInfo.stock) {
      req.flash('error', `Số lượng sản phẩm ${productInfo.title} trong kho không đủ`);
      res.redirect('back');
      return;
    }
    await Product.updateOne({ _id: product.product_id }, { stock : productInfo.stock - product.quantity , sold : productInfo.sold + product.quantity });
    const objectProduct = {
      product_id: product.product_id,
      price: productInfo.price,
      discountPercentage: productInfo.discountPercentage,
      quantity: product.quantity
    };
    if (productInfo.stock - product.quantity == 0 ) {
      const notification = new Notification({
        content: `Sản phẩm ${productInfo.title} đã hết hàng`,
        type: 'products',
        title: 'Hết hàng',
        relatedId: product.product_id
      });
      await notification.save();
      _io.emit('NEW_NOTIFICATION', notification);
    }
    else if (productInfo.stock - product.quantity < 5) {
      const notification = new Notification({
        content: `Sản phẩm ${productInfo.title} chỉ còn ${productInfo.stock} sản phẩm`,
        type: 'products',
        title: 'Sắp hết hàng',
        relatedId: product.product_id,
        detailLink: `/admin/products/detail/${product.product_id}`
      });
      await notification.save();
      _io.emit('NEW_NOTIFICATION', notification);
    }
    products.push(objectProduct);
  }
  const order = new Order({
    user_id: res.locals.clientUser.id,
    cart_id: cartId,
    userInfo: userInfo,
    paymentMethod: req.body.paymentMethod,
    products: products
  });
  await order.save();
  const notification = new Notification({
    user_id: res.locals.clientUser.id,
    content: `Khách hàng ${res.locals.clientUser.email} đã đặt đơn hàng mới`,
    type: 'orders',
    title: 'Đơn hàng mới',
    relatedId: order._id,
    detailLink: `/admin/orders/detail/${order._id}`
  });
  await notification.save();
  _io.emit('NEW_NOTIFICATION', notification);
  await Cart.updateOne(
    { _id: cartId },
    { $set: { products: [] } }
  );
  res.redirect(`/checkout/success/${order._id}`);
};
// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ _id: orderId });
  for (const product of order.products) {
    const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail stock");
    product.productInfo = productInfo;
    product.priceNew = ProductHelper.newPriceOne(product);
    product.totalPrice = product.priceNew * product.quantity;
    
  }
  order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);

  res.render('client/pages/checkout/success', {
    pageTitle: "Đặt hàng thành công",
    order: order,
    expressFlash:{
      success: req.flash('success'),
      error: req.flash('error')
  }
  });
}
