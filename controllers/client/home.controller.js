//[GET] /product
const Product = require('../../models/product.model');
module.exports.index = async (req, res) => {
  find ={

  }
  const products = await Product.find(find).sort({ stock: "asc" }).limit(8);
  const newProducts = products.map(item =>{
      item.priceNew= (item.price*(100-item.discountPercentage)/100).toFixed(2);
      return item;
  })
  res.render('client/pages/home/index',{
      pageTitle: "Trang Chủ",
      products: newProducts
  });
}