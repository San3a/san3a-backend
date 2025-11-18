import express from 'express';
import { upload } from '#src/shared/utils/upload.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import * as adminController from './admin.controller.js';
import Category from '#src/modules/category/category.model.js';

const router = express.Router();

router.get('/users', adminController.getAllUsers);
router.get('/technicians', adminController.getTechniciansByCategory);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id', adminController.updateUserByAdmin);
router.get('/users/:id/earnings', adminController.getUserEarnings);

router.get('/categories', adminController.getCategories);
router.post(
    '/categories',
    upload.array('images', 1),
    handleImageCreate(Category),
    adminController.createCategory
);
router.patch('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

router.get('/stats/counts', adminController.getCounts);
router.get('/stats/technicians-per-category', adminController.getTechniciansPerCategory);

router.get('/stats/user-demographics', adminController.getUserDemographics);
router.get('/stats/technician-demographics', adminController.getTechnicianDemographics);

export default router;
