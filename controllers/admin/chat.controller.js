//[GET] /admin/chat/:roomId

const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
  const { roomId } = req.params;
  try {
    const chats = await Chat.find({room_chat_id:roomId, deleted:false}).sort({ createdAt: -1 });
    const roomchat = await RoomChat.findById(roomId);
    const ClientUser = await User.findById(roomchat.user_id);
    res.render("admin/pages/chat/index", {
      chats: chats,
      roomId: roomId,
      ClientUser: ClientUser
    });
  } catch (error) {
    console.error("Chat controller error:", error);
    res.render("admin/pages/chat/index");
  }
};
