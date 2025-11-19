import { createServiceOrderCash, deleteServiceOrder, getAllServiceOrders, getSingleServiceOrder, updateServiceOrder } from '#src/modules/ServiceOrder/service-order.controller.js';
import express from 'express'

const router = express.Router();

router.route('/')
    .get(getAllServiceOrders)

router.route('/cash')
    .post(createServiceOrderCash)
    
// TODO: Add Create Service order Stripe
    
router.route('/:id')
    .get(getSingleServiceOrder)
    .delete(deleteServiceOrder)
    .patch(updateServiceOrder);

export default router;