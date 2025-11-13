import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, default: 'text' },
    images: [{ url: String, public_id: String }],
});

export default mongoose.model('Message', messageSchema);
