const mongoose = require('mongoose');

const roomChatSchema = new mongoose.Schema({
    title: String,
    user_id: String
},{
    timestamps: true
});
const RoomChat = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat');
module.exports = RoomChat;