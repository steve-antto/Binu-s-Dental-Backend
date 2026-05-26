/**
 * Global Error Handling Middleware
 * @type {import('express').ErrorRequestHandler}
 */
export const errorHandler = (err, req, res, next) => {
    console.error('--- Error Log ---');
    console.error(err.stack || err);

    const statusCode = err.status || 500;

    // Ensure we don't try to send a response if headers are already sent
    if (res.headersSent) {
        return next(err);
    }

    return res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred on the server.'
    });
};