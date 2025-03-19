//[GET] /cart
const ProductHelper = require('../../helpers/product.js');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  let cart = await Cart.findOne({ _id: cartId });
  if(cart.products.length > 0){
    for (const product of cart.products) {
      const productInfo = await Product.findOne({ _id: product.product_id }).select("title price discountPercentage slug thumbnail stock");
      productInfo.priceNew = ProductHelper.newPriceOne(productInfo);
      product.productInfo = productInfo;
      product.totalPrice = productInfo.priceNew * product.quantity;
  }

   cart.totalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
}
  res.render('client/pages/cart/index', {
    pageTitle: "Giỏ hàng",
    cart: cart,
    expressFlash:{
      success: req.flash('success'),
      error: req.flash('error')
  }
  });
  };
//[POST] /cart/add/:id

module.exports.addPost = async (req, res) => {
  const productId = req.params.id;
  let quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  const product = await Product.findOne({ _id: productId });
  if (quantity > product.stock) {
    req.flash('error', 'Số lượng sản phẩm trong kho không đủ');
    res.redirect('back');
    return;}
  const existProduct = cart.products.find(product => product.product_id == productId);
  try {
    if (existProduct) {
      quantity +=  existProduct.quantity;
      await Cart.updateOne
      (
          { _id: cartId, 'products.product_id': productId },
          { $set: { 'products.$.quantity': quantity } }
      );
    } else {  
      const objectCart ={
        product_id:productId,
        quantity:quantity
    }
    await Cart.updateOne
    (
        { _id: cartId },
        { $push: { products: objectCart } }
    );
  }
  req.flash('success', 'Thêm sản phẩm vào giỏ hàng thành công');
  res.redirect('/cart');
  
  } catch (error) {
    console.log(error);
    req.flash('error', 'Thêm sản phẩm vào giỏ hàng thất bại');
    res.redirect('back');
  }
}
//[GET] /cart/delete/:product_id
module.exports.delete = async (req, res) => {
  const productId = req.params.product_id;
  const cartId = req.cookies.cartId;
  try {
    await Cart.updateOne
    (
        { _id: cartId },
        { $pull: { products: { product_id: productId } } }
    );
    req.flash('success', 'Xóa sản phẩm khỏi giỏ hàng thành công');
    res.redirect('/cart');
  }
  catch (error) {
    console.log(error);
    req.flash('error', 'Xóa sản phẩm khỏi giỏ hàng thất bại');
    res.redirect('/cart');
  }
}
//[GET] /cart/update/:product_id/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.product_id;
  const quantity = parseInt(req.params.quantity);
  const product = await Product.findOne({_id:productId });
  console.log(product.stock);
  console.log(quantity);
  if (quantity > product.stock) {
    req.flash('error', 'Số lượng sản phẩm trong kho không đủ');
    res.redirect('back');
    return;}
  try {
    const cartId = req.cookies.cartId;
    await Cart.updateOne
    (
        { _id: cartId, 'products.product_id': productId },
        { $set: { 'products.$.quantity': quantity } }
    );
    req.flash('success', 'Cập nhật giỏ hàng thành công');
    res.redirect('/cart');
  }
  catch (error) {
    console.log(error);
    req.flash('error', 'Cập nhật giỏ hàng thất bại');
    res.redirect('back');
  }
}