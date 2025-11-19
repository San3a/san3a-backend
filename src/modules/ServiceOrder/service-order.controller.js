import ServiceOrder from '#src/modules/ServiceOrder/service-order.model.js';
import { createOne, deleteOne, getAll, getOne } from '#src/shared/services/handler-factory.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { SUCCESS } from '#src/shared/utils/response-status.js';
import { StatusCodes } from 'http-status-codes';

export const createServiceOrderCash = createOne(ServiceOrder);

export const getAllServiceOrders = getAll(ServiceOrder);

export const getSingleServiceOrder = getOne(ServiceOrder);

export const deleteServiceOrder = deleteOne(ServiceOrder);

export const updateServiceOrder = asyncHandler(async(req, res, next) => {
    // checkAllowedFields(req, res, next)(req.body, 'status');

    const { id } = req.params;

     const newServiceOrder = await ServiceOrder.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true
    });

    res.status(StatusCodes.OK).json({
        status: SUCCESS,
        message: "Service order updated successfully!",
        data: {
            newServiceOrder
        } 
    });

});


