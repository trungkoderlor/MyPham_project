//[GET] /cart
const ProductHelper = require('../../helpers/product.js');
const Cart = require('../../models/cart.model');
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
  res.render('client/pages/cart/index', {
    pageTitle: "Giỏ hàng",
    cart: cart
  });
  };
//[POST] /cart/add/:id

module.exports.addPost = async (req, res) => {
  const productId = req.params.id;
  let quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  const existProduct = cart.products.find(product => product.product_id == productId);
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
res.redirect('/cart');
}
//[GET] /cart/delete/:product_id
module.exports.delete = async (req, res) => {
  const productId = req.params.product_id;
  const cartId = req.cookies.cartId;
  await Cart.updateOne
  (
      { _id: cartId },
      { $pull: { products: { product_id: productId } } }
  );
  res.redirect('/cart');
}
//[GET] /cart/update/:product_id/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.product_id;
  const quantity = parseInt(req.params.quantity);
  const cartId = req.cookies.cartId;
  await Cart.updateOne
  (
      { _id: cartId, 'products.product_id': productId },
      { $set: { 'products.$.quantity': quantity } }
  );
  res.redirect('back');
}