import pointSchema from '#src/shared/utils/point-schema.js';
import mongoose, { Schema } from 'mongoose';

const pastWorkSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Each past work must have a title'],
        minlength: [5, 'Title is too short it must be >= 5 characters'],
        maxlength: [50, 'Title is too long it musn\'t exceed 50 characters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Each past work must have a description'],
        minlength: [8, 'description is too short it must be >= 8 characters'],
        maxlength: [500, 'description is too long it musn\'t exceed 500 characters'],
        trim: true,
    },
    images: [
        {
            public_id: {
                type: String,
                required: [true, 'Image public_id is required'],
            },
            url: {
                type: String,
                required: [true, 'Image url is required']
            }
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pastwork Must have an owner'],
    },
    //TODO: Add category 
    location: pointSchema,
    dateCompleted: Date,
    customerName: {
        type: String, 
        trim: true
    }
},
    {
        timestamps: true
    }
);

const PastWork = mongoose.model('PastWork', pastWorkSchema);
export default PastWork;