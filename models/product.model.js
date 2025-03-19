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
    price: {
        type: Number,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    thumbnail: String,
    status: {
        type: String,
        default: "active"
    },
    position: Number,
    featured: {
        type: String,
        default: "0"
    },
    brand_id: {
        type: String,
        default: ""
    },
    images: [String],
    // reviews: [
    //     {
    //         reviewerName: String,
    //         reviewerEmail: String,
    //         comment: String,
    //         rating: Number,
    //         created: {
    //             type: Date,
    //             default: Date.now
    //         }}],
    count_reviews :{
        type: Number,
        default:0
    },
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