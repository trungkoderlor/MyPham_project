const mongoose = require('mongoose');
const BrandSchema = new mongoose.Schema({
    title: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
});
const Brand = mongoose.model('Brand', BrandSchema, 'brands');
module.exports = Brand;