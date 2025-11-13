import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: [true, 'Point type is required!'],
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates is required!'],
        validate: [(val) => val.length === 2, 'Coordinates length must = 2 (longitude, latitude)'],
        index: '2dsphere',
    },
});

export default pointSchema;
