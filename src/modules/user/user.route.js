import { DELETE_USER, UPDATE_USER } from '#src/modules/user/endpoints.js';
import { getAllUsers, getUserById, updateMe, deleteMe } from '#src/modules/user/user.controller.js';
import User from '#src/modules/user/user.model.js';
import { getMyPastWork, getMyReviews } from '#src/modules/user/user.service.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import { handleImageUpdate } from '#src/shared/middlewares/handleImageUpdate.js';
import { upload } from '#src/shared/utils/upload.js';

import { Router } from 'express';

const router = Router();

//endpoints user
router.patch('/updateMe', isAuthorized(UPDATE_USER), upload.array('image', 1), handleImageUpdate(User), updateMe); //add isAuthorized
router.delete('/deleteMe', isAuthorized(DELETE_USER), deleteMe); // add isAuthorized
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/past-work/:id', getMyPastWork);
router.get('/reviews/:id', getMyReviews);

export default router;
