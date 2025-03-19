const mongoose = require('mongoose');
const BrandSchema = new mongoose.Schema({
    title: String,
    description: String,
    position: Number,
    status:{
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
});
const Brand = mongoose.model('Brand', BrandSchema, 'brands');
module.exports = Brand;