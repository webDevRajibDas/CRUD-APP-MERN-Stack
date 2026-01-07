const mongoose = require('mongoose');
const { status } = require('http-status');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

}

const handleError = (err, res) => {
    const {statusCode , message } = err;
    res.status(statusCode).json({
        status:'error',
        statusCode,
        message
    })
}

module.exports = {
    handleError,
    AppError
}