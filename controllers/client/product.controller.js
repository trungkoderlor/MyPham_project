//[GET] /product
const Product = require('../../models/product.model');
const SearchHelper = require('../../helpers/search.js');
module.exports.index = async (req, res) => {
  const objSearch = SearchHelper(req.query);
  let find ={

  }
  if (req.query.keyword) {
    find.title = objSearch.regex;
  }
  const products = await Product.find(find);
  const newProducts = products.map(item =>{
      item.priceNew= (item.price*(100-item.discountPercentage)/100).toFixed(2);
      return item;
  })
  res.render('client/pages/product/index',{
      pageTitle: "Trang Sản Phẩm",
      products: newProducts,
      keyword: req.query.keyword
  });
}