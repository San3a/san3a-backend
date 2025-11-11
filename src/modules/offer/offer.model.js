import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Offer must belong to a post'],
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Offer must have a technician'],
    },
    price: {
        type: Number,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Price must be a positive number',
        },
    },
    message: {
        type: String,
        required: [true, 'Offer must have a message'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

offerSchema.pre('save', function (next) {
    if (!this.isNew) this.updatedAt = Date.now();
    next();
});
offerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

export default mongoose.model('Offer', offerSchema);
