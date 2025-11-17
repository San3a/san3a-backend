import { Availabity } from '#src/modules/tech-service/availabity.model.js';
import TechService from '#src/modules/tech-service/tech-service.model.js';
import * as factory from '#src/shared/services/handler-factory.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { FAIL, SUCCESS } from '#src/shared/utils/response-status.js';
import { StatusCodes } from 'http-status-codes';

export const getAllTechServicesHandler = factory.getAll(TechService);
export const getTechServiceHandler = factory.getOne(TechService);
export const updateTechServiceHandler = factory.updateOne(TechService);
export const deleteTechServiceHandler = factory.deleteOne(TechService);

export const createTechServiceHandler = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const existing = await TechService.findOne({ user });
    if (existing) {
        return res.status(StatusCodes.CONFLICT).json({
            status: FAIL,
            message: 'A Tech service with this technician already exisited',
        });
    }
    const newTechService = {
        user,
        ...req.body,
    };
    const doc = await TechService.create(newTechService);
    res.status(StatusCodes.CREATED).json({
        status: SUCCESS,
        data: doc,
    });
});
export const addAvailabiltySlots = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { availabity } = req.body;

    const createdSlots = await Promise.all(
        availabity.map((e) => Availabity.create({ day: e.day, slots: e.slots }))
    );
    await TechService.updateOne(
        { _id: id },
        { $push: { availabity: { $each: createdSlots.map((a) => a._id) } } }
    );

    res.status(200).json({
        status: SUCCESS,
        data: createdSlots,
    });
});
