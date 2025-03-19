
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: String,
    content: {
      type: String,
      required: true
    },
    detailLink: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: ['orders', 'products', 'users','chats','letters'],
      required: true
    },
    title: {
      type: String,
      required: true
    }
    ,
    isRead: {
      type: Boolean,
      default: false
    },
    relatedId: {
      type: String,
      required: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
});
const Notification = mongoose.model('Notification', notificationSchema, 'notifications');
module.exports = Notification;