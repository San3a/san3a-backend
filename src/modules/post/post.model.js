import TechnicianRoles from '#src/shared/enums/technician-roles.js';
import pointSchema from '#src/shared/utils/point-schema.js';
import cloudinaryV2 from '#src/config/cloudinary.js';
import mongoose from 'mongoose';
import Offer from '#src/modules/offer/offer.model.js';
import Category from '#src/modules/category/category.model.js';

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Post must have a category'],
        validate: {
            validator: async function (value) {
                const exists = await Category.exists({ _id: value });
                return exists;
            },
            message: 'Invalid category ID. Category does not exist.',
        },
    },
    location: {
        type: pointSchema,
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
    this.populate({ path: 'user', select: 'name image' })
        .populate({
            path: 'selectedOffer',
            select: 'price technician',
        })
        .populate('category');
    next();
});

postSchema.pre('findOneAndDelete', async function (next) {
    const post = await this.model.findOne(this.getFilter());

    await Offer.deleteMany({ post: post._id });

    // delete images from Cloudinary if stored there
    for (const img of post.images) await cloudinaryV2.uploader.destroy(img.public_id);

    next();
});

export default mongoose.model('Post', postSchema);
