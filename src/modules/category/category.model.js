import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        nameAr: {
            type: String,
        },
        description: {
            type: String,
        },
        descriptionAr: {
            type: String,
        },
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
