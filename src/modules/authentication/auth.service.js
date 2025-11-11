import User from '../user/user.model.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AppError from '#src/shared/utils/app-error.js';

//VARIABLES
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

//SIGNUP
export const signup = asyncHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
});

//LOGIN
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, res);
});

export default { signup, login };
