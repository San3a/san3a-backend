import mongoose from 'mongoose';

const timeRangeSchmea = new mongoose.Schema({
    start: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, 'invalid start date format'],
    },
    end: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, 'invalid end date format'],
    },
});

const availabitySchema = new mongoose.Schema({
    day: {
        type: Date,
        required: true,
    },
    slots: {
        type: [timeRangeSchmea],
        default: [],
    },
});

export const Availabity = mongoose.model('Availabity', availabitySchema);
