import User from '../user/user.model.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AppError from '#src/shared/utils/app-error.js';
import sendEmail from '#src/shared/utils/email.js';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

// Helpers
const signToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id, user.role);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

// SIGNUP
export const signup = asyncHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, StatusCodes.CREATED, res);
});

// LOGIN
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', StatusCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', StatusCodes.UNAUTHORIZED));
    }

    createSendToken(user, StatusCodes.OK, res);
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('There is no user with that email address', StatusCodes.NOT_FOUND)
        );
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
If you didn't request a password reset, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            text: message,
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        );
    }
});

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', StatusCodes.BAD_REQUEST));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, StatusCodes.OK, res);
});

// UPDATE PASSWORD (logged-in user)
export const updatePassword = asyncHandler(async (req, res, next) => {
    // req.user is expected to be set by an auth middleware
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new AppError('User not found', StatusCodes.UNAUTHORIZED));
    }

    const { passwordCurrent } = req.body;
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', StatusCodes.UNAUTHORIZED));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, StatusCodes.OK, res);
});

export default { signup, login, forgotPassword, resetPassword, updatePassword };
