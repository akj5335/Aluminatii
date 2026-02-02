import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
    // Log the error for server-side debugging
    logger.error(`[Error] ${err.message}`, { stack: err.stack });

    // Default status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
