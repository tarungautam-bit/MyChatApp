const mongoose = require('mongoose');

// Define the message schema with `new mongoose.Schema`
const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    },
    {
        timestamps: true
    }
);

// Create the model using the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
