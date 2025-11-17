import User from '../user/user.model.js';
import APIFeatures from '#src/shared/utils/api-features.js';
import asyncHandler from 'express-async-handler';
import AppError from '#src/shared/utils/app-error.js';
import { StatusCodes } from 'http-status-codes';
import PastWork from '#src/modules/past-work/past-work.model.js';

// utils
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// GET ALL USERS
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(
        User.find({
            active: true
        }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const users = await features.query;

    res.status(StatusCodes.OK).json({
        status: 'success',
        results: users.length,
        data: { users },
    });
});

// GET USER BY ID
export const getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: { user },
    });
});

// UPDATE CURRENT USER (name/email only)
export const updateMe = asyncHandler(async (req, res, next) => {
    // 1) Block password updates here
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword',
                StatusCodes.BAD_REQUEST
            )
        );
    }
    // 2) Allowlisted fields
    const filteredBody = filterObj(req.body, 'name', 'email', 'image');

    // 3) Update doc
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        return next(new AppError('User not found', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: { user: updatedUser },
    });
});

// DELETE (soft-delete current user)
export const deleteMe = asyncHandler(async (req, res, next) => {
    // Your original code used findByIdAndDelete with { active:false } (which doesn’t do what you intend).
    // Soft delete instead:
    const user = await User.findByIdAndUpdate(req.user.id, { active: false }, { new: true });

    if (!user) {
        return next(new AppError('User not found', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: { user },
    });
});

export const getMyPastWork = asyncHandler(async(req, res, next) => {
    const { id } = req.params;

    const myPastWork = await PastWork.find({
        userId: id
    });


    res.status(StatusCodes.OK).json({
        status: 'success',
        data: myPastWork,
    });
})

export default { getAllUsers, getUserById, updateMe, deleteMe, getMyPastWork };
