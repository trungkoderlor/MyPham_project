const mongoose = require('mongoose');
const generate = require('../helpers/generate');
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    room_id: String,
    avatar: String,
    status: {
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy : {
        account_id: String,
        deletedAt: Date
    }
},{
    timestamps: true
});
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;