import * as adminService from './admin.service.js';

export const getAllUsers = async (req, res) => {
    res.json(await adminService.getAllUsers());
};

export const getTechniciansByCategory = async (req, res) => {
    const { categoryId } = req.query;
    res.json(await adminService.getTechniciansByCategory(categoryId));
};

export const banUser = async (req, res) => {
    await adminService.banUser(req.params.id);
    res.json({ message: 'User banned' });
};

export const unbanUser = async (req, res) => {
    await adminService.unbanUser(req.params.id);
    res.json({ message: 'User unbanned' });
};

export const updateUserByAdmin = async (req, res) => {
    res.json(await adminService.updateUser(req.params.id, req.body));
};

export const getUserEarnings = async (req, res) => {
    res.json(await adminService.getUserEarnings(req.params.id));
};

export const getCategories = async (req, res) => {
    res.json(await adminService.getCategories());
};

export const createCategory = async (req, res) => {
    res.json(await adminService.createCategory(req.body, req.file));
};

export const updateCategory = async (req, res) => {
    res.json(await adminService.updateCategory(req.params.id, req.body, req.file));
};

export const deleteCategory = async (req, res) => {
    await adminService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
};

export const getAllReviews = async (req, res) => {
    res.json(await adminService.getAllReviews());
};

export const deleteReview = async (req, res) => {
    await adminService.deleteReview(req.params.id);
    res.json({ message: 'Review deleted' });
};

export const getCounts = async (req, res) => {
    res.json(await adminService.getCounts());
};

export const getTechniciansPerCategory = async (req, res) => {
    res.json(await adminService.getTechniciansPerCategory());
};

export const getUserDemographics = async (req, res) => {
    res.json(await adminService.getUserDemographicsService());
};

export const getTechnicianDemographics = async (req, res) => {
    res.json(await adminService.getTechnicianDemographicsService());
};
