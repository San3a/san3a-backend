import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: [true, 'Point type is required!'],
    },
    coordinates: {
        type: [Number], // [latitude, longitude]
        required: [true, 'Coordinates is required!'],
        validate: [(val) => val.length === 2, 'Coordinates length must = 2 (latitude, longitude)'],
    },
});

export default pointSchema;
