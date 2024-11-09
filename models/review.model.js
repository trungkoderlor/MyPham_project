const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: String,
    product_id: String,
    ratting : double,
    comment: String,
    deleted: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});
const Review = mongoose.model('Review', cartSchema, 'reviews');
module.exports = Review;