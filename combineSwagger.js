import fs from 'fs-extra';
import path from 'path';

const basePath = './swagger';
const pathsDir = path.join(basePath, 'paths');
const schemasDir = path.join(basePath, 'schemas'); // You can rename this later if you wish
const outputFile = path.join(basePath, 'swagger.json');

const base = fs.readJsonSync(path.join(basePath, 'base.json'));

// Helper to read all .json files recursively
function readJsonFilesRecursively(dir) {
    let results = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(readJsonFilesRecursively(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            results.push(fullPath);
        }
    });
    return results;
}

// ---------- Paths ----------
base.paths = {};
const pathFiles = readJsonFilesRecursively(pathsDir).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
);
pathFiles.forEach((file) => {
    const data = fs.readJsonSync(file);
    Object.assign(base.paths, data);
});

// ---------- Components/Schemas ----------
if (!base.components) base.components = {};
base.components.schemas = {};

const definitionFiles = fs
    .readdirSync(schemasDir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

definitionFiles.forEach((file) => {
    const data = fs.readJsonSync(path.join(schemasDir, file));
    Object.assign(base.components.schemas, data);
});

// ---------- Inject default 401/403 for secured endpoints ----------
function addAuthResponsesToSecuredOperations(pathsObj) {
    const methods = ['get', 'post', 'put', 'patch', 'delete'];
    Object.entries(pathsObj).forEach(([route, pathItem]) => {
        methods.forEach((m) => {
            const op = pathItem[m];
            if (!op) return;
            const isSecured = Array.isArray(op.security) && op.security.length > 0;
            if (!isSecured) return;
            if (!op.responses) op.responses = {};
            if (!op.responses['401']) {
                op.responses['401'] = { description: 'Unauthorized: missing or invalid token' };
            }
            if (!op.responses['403']) {
                op.responses['403'] = { description: 'Forbidden: insufficient permissions' };
            }
        });
    });
}

addAuthResponsesToSecuredOperations(base.paths);

// ---------- Optionally inject generic 400/404 where omitted ----------
function addGenericValidationAndNotFound(pathsObj) {
    const methods = ['get', 'post', 'put', 'patch', 'delete'];
    Object.entries(pathsObj).forEach(([route, pathItem]) => {
        methods.forEach((m) => {
            const op = pathItem[m];
            if (!op) return;
            // Ensure responses object exists
            if (!op.responses) op.responses = {};
            // Generic 400 if requestBody present and 400 missing
            if (op.requestBody && !op.responses['400']) {
                op.responses['400'] = { description: 'Validation error (generic auto-added)' };
            }
            // Generic 404 for resource routes if missing
            const isResourceRoute =
                /\{(id|postId|userId|messageId|conversationId|categoryId|offerId|reviewId|techServiceId|pastWorkId)\}/i.test(
                    route
                );
            if (isResourceRoute && !op.responses['404'] && m !== 'post') {
                op.responses['404'] = { description: 'Resource not found (generic auto-added)' };
            }
        });
    });
}

addGenericValidationAndNotFound(base.paths);

// ---------- OpenAPI Upgrade ----------
if (base.swagger) {
    base.openapi = '3.0.0';
    delete base.swagger;
}

// Convert securityDefinitions → components.securitySchemes (OpenAPI 3 format)
if (base.securityDefinitions) {
    base.components.securitySchemes = base.securityDefinitions;
    delete base.securityDefinitions;
}

// ---------- Save ----------
fs.writeJsonSync(outputFile, base, { spaces: 2 });
console.log('✅ OpenAPI 3.0 JSON generated successfully!');
