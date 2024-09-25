const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    brand: String,
    thumbnail: String,
    status: String,
    position: Number,
    images: [String],
    warrantyInformation: String,
    reviews: [
        {
            reviewerName: String,
            reviewerEmail: String,
            comment: String,
            rating: Number,
            created: {
                type: Date,
                default: Date.now
            }
        }
    ],
    returnPolicy: String,
    rating: Number,
    tags: [String],
    slug: { type: String, slug: "title",unique:true },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
});
const Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;