
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user_id: String,
    room_chat_id: String,
    content: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true
});
const Chat = mongoose.model('Chat', chatSchema, 'chats');
module.exports = Chat;