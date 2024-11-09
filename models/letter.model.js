const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
    fullname : String,
    email : String,
    phone : String,
    message : String,
    status:{
      type: String,
      default: "unprocessed"      // Unprocessed, Processing, Processed             
    },
    deleted:{
      type: Boolean,
      default: false
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    reply: 
    {
      content: String,
      createdAt: Date
    }
},{
    timestamps: true
});
const Letter = mongoose.model('Letter', letterSchema, 'letters');
module.exports = Letter;