import mongoose, { Schema } from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
