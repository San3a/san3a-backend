import mongoose from 'mongoose';

const serviceOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Each service order must have a user buying it'],
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechService',
        required: [true, 'Each service order must have a service to be bought'],
    },
    paymentMethod: {
        type: String, 
        required: true,
        enum: ['cash', 'stripe']
    },
    paidAt: { type: Date },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    address: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true
});

serviceOrderSchema.pre(/^find/, function() {
    this.populate({
        path: 'user'
    })
    .populate({
        path: 'service',
        populate: {
            path: 'availabity'
        }
    })
});

const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);
export default ServiceOrder;
