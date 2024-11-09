const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    featured: String,
    brand: String,
    images: [String],
    reviews: [
        {
            reviewerName: String,
            reviewerEmail: String,
            comment: String,
            rating: Number,
            created: {
                type: Date,
                default: Date.now
            }}],
    rating: Number,      
    tags : [String],
    slug: { type: String, slug: "title", unique: true },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
},
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;