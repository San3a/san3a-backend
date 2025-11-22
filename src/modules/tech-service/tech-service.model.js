import mongoose from 'mongoose';

const techServiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'ServiceOwner id is required'],
    },
    title: {
        type: String,
        required: [true, 'Service name is required!'],
        maxlength: [30, "Service name is too long it musn't exceed 30 characters"],
        minlength: [3, 'Service name is too short it must be >= 3 characters'],
    },
    description: {
        type: String,
        required: [true, 'Service description is required!'],
        maxlength: [300, "Service description is too long it musn't exceed 300 characters"],
        minlength: [5, 'Service description is too short it must be >= 5 characters'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Service price is required!'],
        min: [0, 'Service price must be a +ve number'],
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
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating can't be less than 1.0"],
        max: [5, "Rating can't be more than 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required!'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    // availabity: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Availability',
    //     },
    // ],
}, {
    timestamps: true
});

techServiceSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category'
    })
    .populate({
        path: 'user',
        select: 'name email image rating address'
    })
    // .populate({
    //     path: 'availabity'
    // });
    next();
});

const TechService = mongoose.model('TechService', techServiceSchema);
export default TechService;