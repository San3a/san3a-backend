import roles from '#src/shared/rbac/enum/roles.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';
import pointSchema from '#src/shared/utils/point-schema.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'User must have a name'],
            trim: true,
            maxlength: [40, 'A user name must have less or equal than 40 characters'],
            minlength: [3, 'A user name must have more or equal than 3 characters'],
        },
        email: {
            type: String,
            required: [true, 'User must have an email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(roles),
            default: roles.USER,
        },
        password: {
            type: String,
            required: [true, 'User must have a password'],
            minlength: [8, 'A user password must have more or equal than 8 characters'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'User must confirm his password'],
            validate: {
                //This only works on CREATE and SAVE!!!
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
        },
        totalEarning: {
            type: Number,
            default: 0,
        },
        image: {
            public_id: String,
            url: String,
        },
        address: pointSchema,
        rating: {
            type: Number,
            default: 0,
            min: [0, "Product Rate can't be lower than 0"],
            max: [5, "Product Rate can't be greater than 5"],
        },
    },
    {
        timestamps: true
    }
);

//MIDDELWARE
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//METHODS

//check login password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// change password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

// password reset
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
