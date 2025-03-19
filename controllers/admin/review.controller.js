const Review = require('../../models/review.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');
// [GET] /admin/reviews
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };
  const records = await Review.find(find);
  for (const record of records) {
    const product = await Product.findOne({ _id: record.product_id });
    const user = await User.findOne({ _id: record.user_id });
    record.productTitle = product.title;
    record.userEmail = user.email;
    record.productThumbnail = product.thumbnail;
  }
  res.render("admin/pages/reviews/index", {
    pageTitle: "Quản Lý Đánh Giá",
    records: records,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
};
// [GET] /admin/reviews/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const record = await Review.findOne({ _id: id });
  const product = await Product.findOne({ _id: record.product_id });
  const user = await User.findOne({ _id: record.user_id });
  record.productTitle = product.title;
  record.userEmail = user.email;
  record.userName = user.fullname;
  record.productThumbnail = product.thumbnail;
  record.userAvatar = user.avatar;
  record.productPrice = product.price;
  record.productSlug = product.slug;
  res.render("admin/pages/reviews/detail", {
    pageTitle: "Chi Tiết Đánh Giá",
    record: record,
    expressFlash:
    {
      success: req.flash('success'),
      error: req.flash('error')

    }
  });
  
  }
