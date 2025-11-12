import mongoose from 'mongoose';
import TechService from '#src/modules/tech-service/tech-service.model.js';
const { Schema } = mongoose;

const reviewSchema = new Schema(
    {
        rating: {
            type: Number,
            required: [true, 'Review must have a rate'],
            min: [0, "Product Rate can't be lower than 0"],
            max: [5, "Product Rate can't be greater than 5"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        review: {
            type: String,
            required: [true, 'Review must have a review'],
        },
        techService: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TechService',
            required: [true, 'Review must belong to a Service.'],
        },
        //NOTE: Change this after merging user 

        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //     required: [true, 'Review must belong to a User.'],
        // },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (techServiceId) {
    const stats = await this.aggregate([
        {
            $match: { techService: techServiceId },
        },
        {
            $group: {
                _id: '$techService',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await TechService.findByIdAndUpdate(techServiceId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await TechService.findByIdAndUpdate(techServiceId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};

reviewSchema.post('save', async function (doc, next) {
    //NOTE: Change this after merging user 
    // await doc.populate({ path: 'user', select: 'name photo' });
    await doc.constructor.calcAverageRatings(doc.techService);
    next();
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatings(doc.techService);
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
