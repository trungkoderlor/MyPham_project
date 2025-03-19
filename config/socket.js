const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const RoomChat = require('../models/room-chat.model');
const Chat = require('../models/chat.model');

module.exports = (io) => {
  const onlineAdmins = {}; // Lưu admin trực tuyến {adminId: socketId}
  const pendingAdminRequests = {}; // Lưu trạng thái các yêu cầu admin đang chờ {roomId: queueIndex}
  const clientQueue = []; // Hàng chờ cho client
  
  // Hàm kiểm tra và xử lý hàng chờ client
  function processClientQueue() {
    // Nếu hàng chờ client rỗng, không làm gì
    if (clientQueue.length === 0) return;
    
    // Lấy danh sách admin trực tuyến
    const adminQueue = Object.entries(onlineAdmins);
    
    // Nếu không có admin nào trực tuyến, thông báo không có admin
    if (adminQueue.length === 0) {
      clientQueue.forEach(({ socket }) => {
        socket.emit('NO_ADMIN_AVAILABLE');
      });
      return;
    }
    
    // Lấy client đầu tiên trong hàng chờ
    const { user, socket } = clientQueue.shift();
    
    // Tìm hoặc tạo phòng chat
    createOrFindRoomChat(user, socket);
  }
  
  // Hàm tạo hoặc tìm phòng chat cho client
  async function createOrFindRoomChat(user, socket) {
    try {
      let roomchat = await RoomChat.findOne({ user_id: user._id });

      if (!roomchat) {
        roomchat = new RoomChat({ user_id: user._id });
        await roomchat.save();
      }
      
      // Cập nhật room chat ID cho user
      await User.findByIdAndUpdate(user._id, { room_chat_id: roomchat._id });
      
      const roomId = roomchat._id.toString();
      socket.join(roomId);
      
      // Khởi tạo trạng thái chờ admin
      pendingAdminRequests[roomId] = 0;
      
      // Lấy danh sách admin trực tuyến
      const adminQueue = Object.entries(onlineAdmins);
      
      // Gửi yêu cầu đến admin
      sendRequestToAdmin(adminQueue, roomchat, socket);
    } catch (error) {
      console.error('Lỗi khi tạo phòng chat:', error);
      socket.emit('NO_ADMIN_AVAILABLE');
    }
  }
  
  // Hàm gửi yêu cầu đến admin
  function sendRequestToAdmin(adminQueue, roomchat, clientSocket) {
    const roomId = roomchat._id;
    const queueIndex = pendingAdminRequests[roomId];
   
    if (queueIndex >= adminQueue.length) {
      // Không còn admin nào trong hàng đợi
      clientSocket.emit('NO_ADMIN_AVAILABLE');
      return;
    }

    const [nextAdminId, nextAdminSocketId] = adminQueue[queueIndex];

    // Gửi yêu cầu kết nối đến admin
    io.to(nextAdminSocketId).emit("SERVER_REQUEST_CONNECT", {
      roomchat,
      clientSocketId: clientSocket.id
    });

    // Thiết lập timeout
    setTimeout(() => {
      if (pendingAdminRequests[roomId] === queueIndex) {
        pendingAdminRequests[roomId]++;
        sendRequestToAdmin(adminQueue, roomchat, clientSocket);
      }
    }, 15000); // Thời gian chờ: 15 giây
  }

  io.on('connection', (socket) => {
    const { adminId, userId } = socket.handshake.query;

    // Quản lý kết nối admin
    if (adminId) {
      onlineAdmins[adminId] = socket.id;
      
      socket.on('disconnect', () => {
        delete onlineAdmins[adminId];
      });
    }

    // Xử lý khi client yêu cầu kết nối
    socket.on("CLIENT_SENT_CONNECT", async (id) => {
      const user = await User.findById(id);
      if (!user) return;

      // Thêm client vào hàng chờ
      clientQueue.push({ user, socket });
      
      // Xử lý hàng chờ client
      processClientQueue();
    });

    // Admin chấp nhận chat
    socket.on("ADMIN_ACCEPT_CHAT", async (data) => {
      const { roomchat, clientSocketId } = data;
      const roomId = roomchat._id.toString();
      
      // Xóa yêu cầu đang chờ
      delete pendingAdminRequests[roomId];

      // Thông báo đến client đã được chấp nhận
      io.to(clientSocketId).emit("SERVER_ACCEPT_CHAT", roomchat);
      io.to(roomId).emit("SERVER_ACCEPT_CHAT", roomchat);
    });

    // Admin từ chối chat
    socket.on("ADMIN_REJECT_CHAT", async (data) => {
      const { roomchat, clientSocketId } = data;
      const roomId = roomchat._id;
      const adminQueue = Object.entries(onlineAdmins);
      
      pendingAdminRequests[roomId]++;
      
      // Gửi lại yêu cầu đến admin tiếp theo
      sendRequestToAdmin(adminQueue, roomchat, io.sockets.sockets.get(clientSocketId));
    });

    // Các sự kiện socket khác giữ nguyên
    socket.on("CLIENT_RECONNECT", async (roomID) => {
      socket.join(roomID);
    });

    socket.on("CLIENT_SENT_MESSAGE", async (data) => {
      const chat = new Chat({
        room_chat_id: data.roomchat._id,
        user_id: data.user_id,
        content: data.content
      });

      await chat.save();
      io.to(data.roomchat._id).emit("SERVER_RETURN_MESSAGE", {
        user_id: data.user_id,
        content: data.content,
      });
    });

    socket.on("CLIENT_SENT_TYPING", async (data) => {
      socket.broadcast.to(data.roomId).emit("SERVER_RETURN_TYPING", { type: data.type });
    });

    socket.on("CLIENT_END_CHAT", async (roomchat) => {
      io.to(roomchat._id).emit("SERVER_END_CHAT");
      socket.leave(roomchat._id);
    });

    // Thêm sự kiện đánh dấu thông báo đã đọc
    socket.on('MARK_AS_READ', async (notificationId) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        io.emit('NOTIFICATION_UPDATED', { notificationId, isRead: true });
      } catch (error) {
        console.error('❌ Error marking notification as read:', error);
      }
    });
  });
};