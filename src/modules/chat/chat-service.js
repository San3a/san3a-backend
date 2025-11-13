import Conversation from './models/conversation-model.js';
import Message from './models/message-model.js';

export const getUserConversations = async (userId) => {
    return await Conversation.find({ participants: userId })
        .populate('participants', 'username name avatar')
        .populate({
            path: 'messages',
            populate: { path: 'author', select: 'username name avatar' },
        });
};

export const getConversationMessages = async (conversationId) => {
    return await Message.find({ conversation: conversationId })
        .populate('author', 'username name avatar')
        .sort({ date: 1 });
};

export const getOrCreateConversation = async (participants) => {
    let conversation = await Conversation.findOne({
        participants: { $all: participants, $size: participants.length },
    });

    if (!conversation) {
        conversation = await Conversation.create({ participants });
    }

    return conversation;
};

export const createMessage = async ({ conversationId, author, content, type }) => {
    const message = await Message.create({
        conversation: conversationId,
        author,
        content,
        type: type || 'text',
        date: new Date(),
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: message._id },
    });

    return await message.populate('author', 'username name avatar');
};

export const createImageMessages = async (conversationId, author, images) => {
    const createdMessages = [];

    for (const image of images) {
        const message = new Message({
            conversation: conversationId,
            author,
            content: image.url,
            type: 'image',
            images: [
                {
                    url: image.url,
                    public_id: image.public_id,
                },
            ],
        });

        const savedMessage = await message.save();

        // Update conversation's messages array
        await Conversation.findByIdAndUpdate(conversationId, {
            $push: { messages: savedMessage._id },
        });

        const populatedMessage = await savedMessage.populate('author', 'username email');
        createdMessages.push(populatedMessage);
    }

    return createdMessages;
};
