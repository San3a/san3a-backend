import TechnicianRoles from '#src/shared/enums/technician-roles.js';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to a user'],
    },
    title: {
        type: String,
        required: [true, 'Post must have a title'],
        trim: true,
        minLength: [5, 'Title must be at least 5 characters long'],
        maxLength: [100, 'Title must be at most 100 characters long'],
    },
    description: {
        type: String,
        required: [true, 'Post must have a description'],
        trim: true,
        minLength: [5, 'Description must be at least 5 characters long'],
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    tags: {
        type: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
        validate: [(array) => array.length <= 10, 'Cannot have more than 10 tags'],
    },
    category: {
        type: String,
        enum: Object.values(TechnicianRoles),
        required: [true, 'Post must have a category'],
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
            required: [true, 'Post must have a location'],
        },
        coordinates: [Number],
        address: String,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open',
    },
    offersCount: {
        type: Number,
        default: 0,
    },
    selectedOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
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

postSchema.index({ location: '2dsphere' });

postSchema.pre('save', function (next) {
    if (!this.isNew) this.updatedAt = Date.now();
    next();
});
postSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

postSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name image' }).populate({
        path: 'selectedOffer',
        select: 'price technician',
    });
    next();
});

postSchema.pre('findOneAndDelete', async function (next) {
    const post = await this.model.findOne(this.getFilter());

    // delete related offers
    await mongoose.model('Offer').deleteMany({ post: post._id });

    // delete images from Cloudinary if stored there
    // for (const img of post.images) await cloudinary.uploader.destroy(img.public_id);

    next();
});

export default mongoose.model('Post', postSchema);
