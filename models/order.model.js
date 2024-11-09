const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    userInfo:{
        name: String,
        phone: String,
        email: String,
        address: String
    },
    products: [{
        product_id: String,
        price : Number,
        discountPercentage: Number,
        quantity: Number
    }],
    status: {
        type: String,
        default: 'pending'
    }
        // pending, shipping, completed, canceled
},{
    timestamps: true
});
const Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;