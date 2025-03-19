const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    order_id: String,
    user_id: String,
    product_id: String,
    rating : Number,
    comment: String,
    image: String,
    deleted: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});
const Review = mongoose.model('Review', reviewSchema, 'reviews');
module.exports = Review;