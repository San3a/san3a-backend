import { getAllUsers, getUserById, updateMe, deleteMe } from '#src/modules/user/user.controller.js';

import { Router } from 'express';

const router = Router();

//endpoints user
router.patch('/updateMe', updateMe); //add isAuthorized
router.delete('/deleteMe', deleteMe); // add isAuthorized
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
