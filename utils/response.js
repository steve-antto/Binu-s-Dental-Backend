/**
 * Standardized API response utilities
 * Ensures consistent JSON structure between frontend and backend
 */

/**
 * Success response
 */
export const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...data
    });
};

/**
 * Created response (201)
 */
export const createdResponse = (res, data = {}, message = 'Created successfully') => {
    return successResponse(res, data, message, 201);
};

/**
 * Error response
 */
export const errorResponse = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message
    };

    // Include error details only in development
    if (error && process.env.NODE_ENV === 'development') {
        response.error = error.message || error;
    }

    return res.status(statusCode).json(response);
};

/**
 * Not found response (404)
 */
export const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, message, 404);
};

/**
 * Unauthorized response (401)
 */
export const unauthorizedResponse = (res, message = 'Unauthorized') => {
    return errorResponse(res, message, 401);
};

/**
 * Forbidden response (403)
 */
export const forbiddenResponse = (res, message = 'Forbidden') => {
    return errorResponse(res, message, 403);
};

/**
 * Validation error response (400)
 */
export const validationErrorResponse = (res, message = 'Validation failed') => {
    return errorResponse(res, message, 400);
};

export default {
    successResponse,
    createdResponse,
    errorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    validationErrorResponse
};
