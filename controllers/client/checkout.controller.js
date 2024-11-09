//[GET] /checkout
const ProductHelper = require('../../helpers/product.js');
const Cart = require('../../models/cart.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
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
    cart: cart
  });
};
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  const userInfo = req.body;
  const products = [];
  for (const product of cart.products) {
    const productInfo = await Product.findOne({ _id: product.product_id }).select("title price discountPercentage");
    const objectProduct = {
      product_id: product.product_id,
      price: productInfo.price,
      discountPercentage: productInfo.discountPercentage,
      quantity: product.quantity
    };
    products.push(objectProduct);
  }
  const order = new Order({
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  });
  await order.save();
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
    await Product.updateOne({ _id: product.product_id }, { stock : productInfo.stock - product.quantity });
  }
  order.totalPrice = order.products.reduce((total, product) => total + product.totalPrice, 0);

  res.render('client/pages/checkout/success', {
    pageTitle: "Đặt hàng thành công",
    order: order
  });
}
