//[GET] /product
const Brand = require('../../models/brand.model');
const Product = require('../../models/product.model');
const Category = require('../../models/category.model');
module.exports.index = async (req, res) => {
  find ={

  }
  const products = await Product.find(find).sort({ sold: "desc" }).limit(8);
  const bestSellProducts = products.map(item =>{
      item.priceNew= (item.price*(100-item.discountPercentage)/100).toFixed(2);
      return item;
  });
  const feautedProducts = await Product.find({featured: "1"}).sort({ sold: "desc"  }).limit(4);
  const newFeautedProducts = feautedProducts.map(item =>{
    item.priceNew= (item.price*(100-item.discountPercentage)/100).toFixed(2);
    return item;
});
  const posters = [
    { src: '/images/poster1.png', alt: 'Poster 1' },
    { src: '/images/poster2.png', alt: 'Poster 2' },
    { src: '/images/poster3.png', alt: 'Poster 3' }
  ];
  res.render('client/pages/home/index',{
      pageTitle: "Trang Chủ",
      bestSellProducts: bestSellProducts,
      posters: posters,
      feautedProducts: newFeautedProducts,
      expressFlash:{
        success: req.flash('success'),
        error: req.flash('error')
    }
  });
}