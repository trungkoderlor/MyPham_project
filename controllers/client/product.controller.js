//[GET] /product
const Product = require('../../models/product.model');
const Review = require('../../models/review.model');
const User = require('../../models/user.model');
const Category = require('../../models/category.model');
const Brand = require('../../models/brand.model');
const CategoryHelper = require('../../helpers/category.js');
const SearchHelper = require('../../helpers/search.js');
module.exports.index = async (req, res) => {
  const category_id = req.query.category;
  const brand_id = req.query.brand;
  const price = req.query.price;
  var priceArr = [];
  var min ;
  var max ;
  if (price) {
    if (!price.includes("-")) {
      min = parseInt(price);
    }
    else{
      priceArr = price.split("-");
      min = parseInt(priceArr[0]);
      max = parseInt(priceArr[1]);
    }
   
  }
  const rating = req.query.rating;
  const objSearch = SearchHelper(req.query);
  let find = {
    stock: { $gt: 0 }
  }
  if (req.query.keyword) {
    find.title = objSearch.regex;
  }
  if (category_id) {
    const categoryArr = await CategoryHelper.getCategory(category_id);
    find.category_id = { $in: [category_id, ...categoryArr] };
  }
  if (brand_id) {
    find.brand_id = brand_id;
  }
  if (price) {
    if (priceArr.length == 1) {
      find.price = { $gte: min };
    }x
    find.price = { $gte: min, $lte: max };
  }
  if (rating) {
    find.rating = { $gte: rating };
  }
  const products = await Product.find(find);
  var newProducts=[];
  if (products.length > 0) {
    newProducts = products.map(item => {
      item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
      return item;
    })
  }

  res.render('client/pages/product/index', {
    pageTitle: "Trang Sản Phẩm",
    products: newProducts,
    keyword: req.query.keyword,
    rating: req.query.rating,
    price: req.query.price,
    category_id: req.query.category,
    expressFlash:{
      success: req.flash('success'),
      error: req.flash('error')
  }

  });
}
// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const rv_id = req.query.rv_id;
  const product = await Product.findOne({ slug: slug }); 
 
  if (product) {
    const brand = await Brand.findOne({ _id: product.brand_id });
    const category = await Category.findOne({ _id: product.category_id });
    product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(2);
    product.reviews = await Review.find({ product_id: product._id, deleted: false }).sort({ createdAt: -1 });
    if (product.reviews.length > 0) {
      for (const review of product.reviews) {
        const userReview = await User.findOne({ _id: review.user_id });
        console.log(userReview);
        if (userReview) {

          review.reviewerName = userReview.fullname;
          review.avatar = userReview.avatar;
          review.reviewerEmail = userReview.email;
        }
      }
    }
    res.render('client/pages/product/detail', {
      pageTitle: product.title,
      product: product,
      category: category,
      brand: brand,
      rv_id: rv_id,
      expressFlash:{
        success: req.flash('success'),
        error: req.flash('error')
    }
    });
  }
  else
  {
    res.redirect("/Product-not-found");
  } 
}