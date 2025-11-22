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
        required: [true, 'Offer must have a price'],
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
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
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

offerSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'technician',
        select: 'name email image'
    })
    .populate({
        path: 'post'
    })
    next();
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;