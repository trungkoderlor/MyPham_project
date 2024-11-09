const Category = require('../../models/category.model');
const createTreeHelper = require('../..//helpers/createTree');
module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false

  }
  const categories = await Category.find(find);
  const newCategories = createTreeHelper.Tree(categories);
  res.locals.categories = newCategories;
  next();
};