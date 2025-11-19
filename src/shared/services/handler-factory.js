import ApiFeatures from '#src/shared/utils/api-features.js';
import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { SUCCESS } from '#src/shared/utils/response-status.js';
import { StatusCodes } from 'http-status-codes';

const getModelNameInLowerCase = (Model) => Model.modelName.toLowerCase();

export const deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        const modelName = getModelNameInLowerCase(Model);
        if (!doc) {
            return next(new AppError(`No ${modelName} found with that ID`, 404));
        }
        res.status(StatusCodes.NO_CONTENT).json({ status: SUCCESS, data: null });
    });

export const updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        const modelName = getModelNameInLowerCase(Model);

        if (!doc) {
            return next(new AppError(`No ${modelName} found with that ID`, 404));
        }
        res.status(StatusCodes.OK).json({ status: SUCCESS, data: doc });
    });

export const createOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(StatusCodes.CREATED).json({
            status: SUCCESS,
            data: doc,
        });
    });

export const getOne = (Model, populateOptions) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // Here we have query
        let query = Model.findById(id).select('-__v');

        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        const doc = await query;

        const modelName = getModelNameInLowerCase(Model);
        if (!doc) {
            return next(new AppError(`No ${modelName} found with that ID`, 404));
        }

        res.status(StatusCodes.OK).json({
            status: SUCCESS,
            data: doc,
        });
    });

export const getAll = (Model, populateOptions = null, nestedFilter = {}) =>
    asyncHandler(async (req, res, next) => {
        const filter = {};
        Object.entries(nestedFilter || {}).forEach(([paramName, fieldName]) => {
            if (req.params && req.params[paramName]) {
                filter[fieldName] = req.params[paramName];
            }
        });
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [{ title: searchRegex }, { description: searchRegex }];
        }
        const total = await Model.countDocuments(filter);

        const features = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        let { query } = features;
        if (populateOptions) query = query.populate(populateOptions);

        const docs = await query;
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;

        res.status(StatusCodes.OK).json({
            status: SUCCESS,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            results: docs.length,
            // This is called envelope
            data: docs,
        });
    });
