# San3a API - Development Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Code Style & Conventions](#code-style--conventions)
- [Import System](#import-system)
- [HTTP Status Codes](#http-status-codes)
- [Error Handling](#error-handling)
- [Middleware](#middleware)
- [Database](#database)
- [Best Practices](#best-practices)

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MongoDB instance
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment files
cp .env.example .env.development
cp .env.example .env.production

# Start development server
npm run dev
```

### Environment Variables

Create `.env.development` and `.env.production` files with:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/san3a
NODE_ENV=development
```

---

## Project Structure

```
San3a-api/
├── src/
│   ├── config/          # Configuration files (DB, environment)
│   ├── core/            # Core application files (app.js, server.js)
│   ├── modules/         # Feature modules (routes, controllers, models)
│   └── shared/          # Shared utilities
│       ├── middlewares/ # Custom middleware
│       ├── rbac/        # Role-based access control
│       ├── services/    # Reusable services (handler factory)
│       └── utils/       # Utility functions
├── uploads/             # File upload directory
└── package.json
```

---

## Code Style & Conventions

### ESM Modules

This project uses **ES Modules** (not CommonJS).

✅ **CORRECT:**

```javascript
import express from 'express';
export default app;
export const PORT = 3000;
```

❌ **WRONG:**

```javascript
const express = require('express');
module.exports = app;
```

### File Extensions

**Always include `.js` extensions** in local imports:

✅ **CORRECT:**

```javascript
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import app from './app.js';
```

❌ **WRONG:**

```javascript
import { asyncHandler } from '#src/shared/utils/async-handler';
import app from './app';
```

### Naming Conventions

- **Files:** kebab-case for files outside of module feature (`global-error-handler.middleware.js`, `rate-limiter.middleware.js`)
- **Files inside modules:** (`post.controller.js`, `post.model.js`, `post.routes.js`, `post.validator.js`)
- **Classes:** PascalCase (`UserModel`, `AppError`)
- **Functions/Variables:** camelCase (`getUserById`, `isAuthenticated`)
- **Constants:** UPPER_SNAKE_CASE (`API_VERSION`, `MAX_FILE_SIZE`)

---

## Import System

### Path Aliases

Use the `#src/` alias instead of relative paths for cleaner imports.

✅ **CORRECT:**

```javascript
import { AppError } from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { SUCCESS, ERROR } from '#src/shared/utils/response-status.js';
```

❌ **WRONG:**

```javascript
import { AppError } from '../../../shared/utils/app-error.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
```

### When to Use Relative vs Alias Imports

**Use `#src/` alias for:**

- Cross-module imports
- Importing from shared utilities
- Importing from config or core

**Use relative paths for:**

- Files in the same directory (`./utils.js`)
- Closely related files in the same module

**Examples:**

```javascript
// In src/modules/users/user.controller.js
import UserModel from './user.model.js'; // ✅ Same directory
import { asyncHandler } from '#src/shared/utils/async-handler.js'; // ✅ Shared utility
import { SUCCESS } from '#src/shared/utils/response-status.js'; // ✅ Shared utility
```

### VS Code Auto-Import Configuration

The project is configured to auto-import with:

- `#src/` alias (not relative paths)
- `.js` file extensions
- Single quotes

If auto-import uses `require()`, reload VS Code window (`Ctrl+Shift+P` → "Reload Window")

---

## HTTP Status Codes

### Using Status Code Constants

**Always use the constants** from `http-status-codes` package:

✅ **CORRECT:**

```javascript
import { StatusCodes } from 'http-status-codes';

res.status(StatusCodes.OK).json({ data });
res.status(StatusCodes.CREATED).json({ data });
res.status(StatusCodes.BAD_REQUEST).json({ error });
res.status(StatusCodes.UNAUTHORIZED).json({ error });
res.status(StatusCodes.FORBIDDEN).json({ error });
res.status(StatusCodes.NOT_FOUND).json({ error });
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
```

❌ **WRONG:**

```javascript
res.status(200).json({ data }); // Magic numbers!
res.status(404).json({ error });
```

### Available Status Codes

```javascript
// Success
StatusCodes.OK; // 200
StatusCodes.CREATED; // 201
StatusCodes.NO_CONTENT; // 204

// Client Errors
StatusCodes.BAD_REQUEST; // 400
StatusCodes.UNAUTHORIZED; // 401
StatusCodes.FORBIDDEN; // 403
StatusCodes.NOT_FOUND; // 404
StatusCodes.CONFLICT; // 409
StatusCodes.UNPROCESSABLE_ENTITY; // 422

// Server Errors
StatusCodes.INTERNAL_SERVER_ERROR; // 500
StatusCodes.NOT_IMPLEMENTED; // 501
StatusCodes.SERVICE_UNAVAILABLE; // 503
```

### Response Status Helpers

Use the response status helpers for consistent responses:

```javascript
import { SUCCESS, ERROR } from '#src/shared/utils/response-status.js';

// Success response
res.status(StatusCodes.OK).json({
    status: SUCCESS,
    data: users,
});

// Error response
res.status(StatusCodes.BAD_REQUEST).json({
    status: ERROR,
    message: 'Invalid input',
});
```

---

## Error Handling

### Using AppError Class

Create errors using the `AppError` class:

```javascript
import AppError from '#src/shared/utils/app-error.js';
import { StatusCodes } from 'http-status-codes';

// Throw operational errors
throw new AppError('User not found', StatusCodes.NOT_FOUND);
throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
throw new AppError('Access denied', StatusCodes.FORBIDDEN);
```

### Async Handler Wrapper

**Always wrap async route handlers** with `asyncHandler`:

✅ **CORRECT:**

```javascript
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { StatusCodes } from 'http-status-codes';

export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        status: SUCCESS,
        data: { user },
    });
});
```

❌ **WRONG:**

```javascript
// Missing asyncHandler - errors won't be caught!
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error); // Manual error handling
    }
};
```

### Error Response Format

All errors follow this format (handled by global error handler):

```json
{
    "status": "error",
    "error": {
        "statusCode": 404,
        "status": "error"
    },
    "message": "User not found",
    "stack": "..." // Only in development
}
```

---

## Middleware

### Order of Middleware

Middleware order in `app.js` is critical:

```javascript
// 1. Security & CORS
app.use(cors());
app.use(helmet());

// 2. Compression & Rate Limiting
app.use(compression());
app.use(limiter);

// 3. Body Parsing
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));

// 4. Security Sanitization
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());

// 5. Logging (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 6. Routes
mountRoutes(app);

// 7. Error Handling (MUST BE LAST)
app.use(unhandledRoutesHandler);
app.use(globalErrorHandler);
```

### Creating Custom Middleware

```javascript
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import AppError from '#src/shared/utils/app-error.js';
import { StatusCodes } from 'http-status-codes';

export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new AppError('Authentication required', StatusCodes.UNAUTHORIZED);
    }

    // Verify token logic here
    req.user = decodedUser;
    next();
});
```

---

## Database

### Mongoose Models

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export default mongoose.model('User', userSchema);
```

### Database Connection

Connection is handled automatically in `src/config/db.js`. Ensure `MONGO_URL` is set in your environment file.

---

## Best Practices

### 1. Use Handler Factory for CRUD Operations

```javascript
import * as factory from '#src/shared/services/handler-factory.js';
import UserModel from './user.model.js';

export const getAllUsers = factory.getAll(UserModel);
export const getUser = factory.getOne(UserModel);
export const createUser = factory.createOne(UserModel);
export const updateUser = factory.updateOne(UserModel);
export const deleteUser = factory.deleteOne(UserModel);
```

### 2. API Features (Pagination, Filtering, Sorting)

```javascript
import ApiFeatures from '#src/shared/utils/api-features.js';

const features = new ApiFeatures(User.find(), req.query).filter().sort().limitFields().paginate();

const users = await features.query;
```

### 3. Input Validation

Use Joi or similar validation library:

```javascript
import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

// In controller
const { error, value } = userSchema.validate(req.body);
if (error) {
    throw new AppError(error.details[0].message, StatusCodes.BAD_REQUEST);
}
```

### 4. Don't Commit Sensitive Files

The following are already in `.gitignore`:

- `.env*` files
- `node_modules/`
- `uploads/`
- Log files

### 5. Console Statements

Avoid `console.log()` in production code. Use proper logging:

❌ **WRONG:**

```javascript
console.log('User created:', user);
```

✅ **CORRECT:**

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
    // Use morgan for HTTP logging
}
```

### 6. Async/Await Best Practices

```javascript
// ✅ Always use asyncHandler
export const myHandler = asyncHandler(async (req, res, next) => {
    // Your async code
});

// ✅ Use Promise.all for parallel operations
const [users, posts] = await Promise.all([User.find(), Post.find()]);

// ❌ Don't use .then() chains
User.find()
    .then((users) => {
        res.json(users);
    })
    .catch((err) => next(err));
```

---

## Testing Routes

### Using Thunder Client / Postman

**Example: Get All Users**

```
GET http://localhost:3000/api/v1/users
```

**Example: Create User**

```
POST http://localhost:3000/api/v1/users
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com"
}
```

**Example: Query with Filters**

```
GET http://localhost:3000/api/v1/users?page=1&limit=10&sort=-createdAt&fields=name,email
```

---

## Common Issues & Solutions

### Issue: Cannot find module with `@/` alias

**Solution:** The alias is `#src/`, not `@/`. And always include `.js` extension.

### Issue: Auto-import uses `require()`

**Solution:** Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")

### Issue: Module not found errors at runtime

**Solution:** Ensure all imports include `.js` extension for local files.

### Issue: ESLint errors about file extensions

**Solution:** The project is configured to require `.js` extensions. Don't turn this off.

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/user-authentication

# Create Pull Request on GitHub/GitLab
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## Support

For questions or issues, contact the team lead or create an issue in the project repository.

**Happy Coding! 🚀**
