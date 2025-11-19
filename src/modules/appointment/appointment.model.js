import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Appointment must belong to a customer'],
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Appointment must have a technician'],
        },
        startTime: {
            type: Date,
            required: [true, 'Appointment must have a start time'],
        },
        problemDescription: {
            type: String,
        },

        price: {
            type: Number,
            required: [true, 'Appointment must have a price'],
            validate: {
                validator(value) {
                    return value >= 0;
                },
                message: 'Price must be a positive number',
            },
        },

        platformDiscountAmount: {
            type: Number,
            default: 0,
            validate: {
                validator(value) {
                    return value >= 0;
                },
                message: 'Discount must be a positive number',
            },
        },

        platformDiscountSource: {
            type: String,
            enum: ['none', 'san3a-promo', 'san3a-manual', 'campaign'],
            default: 'none',
        },

        status: {
            type: String,
            enum: ['pending', 'paid', 'completed', 'cancelled'],
            default: 'pending',
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
    },
    {
        timestamps: true,
    }
);

appointmentSchema.pre('save', function (next) {
    if (!this.isNew) this.updatedAt = Date.now();
    next();
});

appointmentSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

appointmentSchema.pre(/^find/, function (next) {
    this.populate('customer', 'name image').populate('technician', 'name image');
    next();
});

// final price
appointmentSchema.methods.getChargePrice = function () {
    const discount = this.platformDiscountAmount || 0;
    const raw = this.price - discount;
    return raw > 0 ? raw : 0;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
