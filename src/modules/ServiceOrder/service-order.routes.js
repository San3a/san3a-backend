import { CREATE_SERVICE_ORDER } from '#src/modules/ServiceOrder/endpoints.js';
import { createServiceOrder, deleteServiceOrder, getAllServiceOrders, getSingleServiceOrder, updateServiceOrder } from '#src/modules/ServiceOrder/service-order.controller.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import express from 'express'

const router = express.Router();

router.route('/')
    .get(getAllServiceOrders)
    .post(
        isAuthorized(CREATE_SERVICE_ORDER),
        createServiceOrder
    );
    
    
router.route('/:id')
    .get(getSingleServiceOrder)
    .delete(deleteServiceOrder)
    .patch(updateServiceOrder);

export default router;