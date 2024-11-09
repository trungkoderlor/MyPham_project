const Product = require('../../models/product.model');
const Brand = require('../../models/brand.model');
const SearchHelper = require('../../helpers/search.js');
//[GET] /brand/:title
module.exports.index = async (req, res) => {
    const title = req.params.title;
    const objSearch = SearchHelper(req.query);
    let find ={
        brand: title
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
        pageTitle: title,
        products: newProducts,
        keyword: req.query.keyword,
    });
}