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
    paymentMethod: {
        type: String,
        enum: ['cod', 'transfer'],
        default: 'cod'
    },
    products: [{
        product_id: String,
        price : Number,
        discountPercentage: Number,
        quantity: Number,
        status: {
            type: String,
            default: 'unreviewed'
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'shipping','shipped','unreceived', 'completed', 'canceled'],
        default: 'pending'
    }
},{
    timestamps: true
});
const Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;