//[GET] /about
const Brand = require('../../models/brand.model');
module.exports.index =async (req, res) => {
    const brands= await Brand.find();
    res.render('client/pages/about/index', {
        pageTitle: "Giới thiệu",
        brands: brands
    });
}