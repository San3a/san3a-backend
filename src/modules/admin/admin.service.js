import User from '../user/user.model.js';
import Category from '../category/category.model.js';
import TechService from '../tech-service/tech-service.model.js';
import Review from '../review/review.model.js';
import roles from '#src/shared/rbac/enum/roles.js';

export const getAllUsers = async () => {
    const users = await User.find().select(
        '-password -passwordConfirm -passwordResetToken -passwordResetExpires'
    );

    return {
        customers: users.filter((u) => u.role === roles.USER),
        technicians: users.filter((u) => u.role === roles.TECHNICIAN),
    };
};

export const getTechniciansByCategory = async (categoryId) => {
    const services = await TechService.find({ category: categoryId }).populate('user');
    return services.map((s) => s.user);
};

export const banUser = async (userId) => {
    return User.findByIdAndUpdate(userId, { active: false });
};

export const unbanUser = async (userId) => {
    return User.findByIdAndUpdate(userId, { active: true });
};

export const updateUser = async (userId, data) => {
    return User.findByIdAndUpdate(userId, data, { new: true });
};

export const getUserEarnings = async (userId) => {
    return User.findById(userId).select('name totalEarning rating');
};

export const getCategories = async () => {
    return Category.find();
};

export const createCategory = async (data, file) => {
    return Category.create({
        name: data.name,
        description: data.description,
        images: file ? [{ url: file.path, public_id: file.filename }] : undefined,
    });
};

export const updateCategory = async (id, data, file) => {
    const update = { ...data };
    if (file) {
        update.icon = { url: file.path, public_id: file.filename };
    }
    return Category.findByIdAndUpdate(id, update, { new: true });
};

export const deleteCategory = async (id) => {
    return Category.findByIdAndDelete(id);
};

export const getAllReviews = async () => {
    return Review.find()
        .populate('user', 'name photo email')
        .populate({
            path: 'techService',
            populate: { path: 'user', select: 'name photo email' },
        });
};

export const deleteReview = async (id) => {
    return Review.findByIdAndDelete(id);
};

export const getCounts = async () => {
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    return { totalCustomers, totalTechnicians };
};

export const getTechniciansPerCategory = async () => {
    return TechService.aggregate([
        {
            $group: {
                _id: '$category',
                technicians: { $addToSet: '$user' },
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category',
            },
        },
        { $unwind: '$category' },
    ]);
};

export const getUserDemographicsService = async () => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });
    const inactiveUsers = await User.countDocuments({ active: false });

    const rolesCount = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        roles: rolesCount,
    };
};

export const getTechnicianDemographicsService = async () => {
    const technicians = await User.find({ role: roles.TECHNICIAN });

    const totalTechnicians = technicians.length;
    const activeTechs = technicians.filter((t) => t.active).length;

    const averageRating =
        technicians.length > 0
            ? technicians.reduce((acc, t) => acc + (t.rating || 0), 0) / technicians.length
            : 0;

    const totalEarnings = technicians.reduce((sum, t) => sum + (t.totalEarning || 0), 0);

    return {
        totalTechnicians,
        activeTechnicians: activeTechs,
        averageRating,
        totalEarnings,
    };
};
