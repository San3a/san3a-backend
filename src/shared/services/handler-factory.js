import cloudinaryV2 from '#src/config/cloudinary.js';
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
        const body = {
            ...req.body,
        };

        if (req.files && req.files.length > 0) {
            let updatedImages = [];
            const images = [];
            await Promise.all(
                req.files.map(async (file) => {
                    const result = await cloudinaryV2.uploader.upload(file.path, {
                        folder: Model.modelName,
                    });

                    images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                })
            ).then(async () => {
                const item = await Model.findById(req.params.id);
                if (!item) {
                    return next(new AppError(`No ${Model.modelName} found with that ID`, 404));
                }

                updatedImages = [...item.images, ...images];
                body.images = updatedImages;
            });
        }

        const doc = await Model.findByIdAndUpdate(req.params.id, body, {
            new: true,
            runValidators: true,
        });
        const modelName = getModelNameInLowerCase(Model);

        if (!doc) {
            return next(new AppError(`No ${modelName} found with that ID`, 404));
        }
        res.status(200).json({ status: SUCCESS, data: doc });
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

export const createOneWithImages = (Model) =>
    asyncHandler(async (req, res, next) => {
        const images = [];
        if (!req.files || req.files.length === 0) {
            const err = new AppError('Each product must have at least one photo', 400);
            return next(err);
        }

        await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinaryV2.uploader.upload(file.path, {
                    folder: Model.modelName,
                });
                images.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            })
        );

        const body = { ...req.body, images };
        console.log(`This is the body ${body}`);

        const doc = await Model.create(body);

        res.status(201).json({
            status: SUCCESS,
            data: doc,
            images: images,
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
        const features = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        let { query } = features;
        if (populateOptions) query = query.populate(populateOptions);

        const docs = await query;

        res.status(StatusCodes.OK).json({
            status: SUCCESS,
            results: docs.length,
            data: docs,
        });
    });
