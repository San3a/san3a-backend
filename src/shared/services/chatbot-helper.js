import Category from '#src/modules/category/category.model.js';
import TechService from '#src/modules/tech-service/tech-service.model.js';

export const findCategoryByName = async (categoryName) => {
    return await Category.findOne({
        $or: [
            { name: new RegExp(`^${categoryName}$`, 'i') },
            { nameAr: new RegExp(`^${categoryName}$`, 'i') },
        ],
    }).lean();
};

export const getTopTechniciansByCategory = async (categoryId) => {
    const services = await TechService.find({ category: categoryId })
        .populate({
            path: 'user',
            select: 'name image rating',
        })
        .sort({ 'user.rating': -1 })
        .limit(5)
        .lean();

    return services.map((s) => ({
        technicianId: s.user._id,
        name: s.user.name,
        image: s.user.image?.url,
        rating: s.user.rating,
        serviceId: s._id,
        title: s.title,
        price: s.price,
    }));
};
