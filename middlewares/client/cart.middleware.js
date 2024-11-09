const Cart = require("../..//models/cart.model");
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    res.cookie("cartId",cart.id ,{
      expires: new Date(Date.now() + 365*24*60*60*1000),
    });

  }
  else{
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    
    const totalQuantity = cart.products.reduce((total,product)=>{
      return total + product.quantity;
    },0);
    cart.totalQuantity = totalQuantity;
    res.locals.miniCart = cart;
  }
  next();
};