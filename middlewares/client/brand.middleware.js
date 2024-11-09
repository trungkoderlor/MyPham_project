const Brand = require('../../models/brand.model');
module.exports.brand = async (req, res, next) => {
  
  const brands = await Brand.find();
  res.locals.brands = brands;
  next();
};