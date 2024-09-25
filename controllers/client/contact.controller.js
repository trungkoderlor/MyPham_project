//[GET]/conact
const Brand = require('../../models/brand.model');
module.exports.index = async (req, res) => {
    const brands= await Brand.find();
    res.render('client/pages/contact/index', {
        brands: brands,
        pageTitle: "Liên hệ"
    });
}