import mongoose from 'mongoose';

const serviceOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Each service order must have a user buying it'],
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['TechService', 'Offer'], 
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Each service order must have a service to be bought'],
        refPath: 'serviceType' 
    },
    paymentMethod: {
        type: String, 
        required: true,
        enum: ['cash', 'stripe']
    },
    paidAt: { 
        type: Date 
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    }
}, 
{
    timestamps: true
});

serviceOrderSchema.pre(/^find/, function() {
    this.populate({
        path: 'user',
        select: 'name email image address'
    });
    
});

serviceOrderSchema.methods.populateService = async function() {
    if (this.serviceType === 'TechService') {
        await this.populate({
            path: 'service',
            populate: [
                { path: 'user', select: 'name email image rating' },
                { path: 'category' },
                { path: 'availability' }
            ]
        });
    } else if (this.serviceType === 'Offer') {
        await this.populate({
            path: 'service',
            populate: [
                { path: 'technician', select: 'name email image rating' },
                { path: 'post' }
            ]
        });
    }
    return this;
};

serviceOrderSchema.statics.findWithServices = function(query = {}) {
    return this.find(query)
        .populate('user')
        .exec()
        .then(async (orders) => {
            for (let order of orders) {
                await order.populateService();
            }
            return orders;
        });
};

const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);
export default ServiceOrder;