require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { xss } = require('express-xss-sanitizer');

// Local Imports
const routes = require('./routes');
const mongoSanitize = require('./middleware/sanitize');
const { jwtStrategy } = require('./middleware/passport');
const { handleError, convertToApiError } = require('./middleware/apiError');

const app = express();

/**
 *  ===== MIDDLEWARE =====
 */

// Body Parsing (Replaces body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & Sanitization
app.use(xss()); // Prevent XSS scripts
app.use(mongoSanitize()); // Prevent NoSQL injection

// Passport Authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

/**
 *  ===== ROUTES =====
 */
app.use('/api', routes);

/**
 *  ===== ERROR HANDLING =====
 */

// Convert non-api errors to ApiError instances
app.use(convertToApiError);

// Centralized error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});

/**
 *  ===== DATABASE & SERVER =====
 */
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false); // Prepare for Mongoose 7/8

const startServer = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`[Database]: MongoDB Connected: ${conn.connection.host}`);

        app.listen(PORT, () => {
            console.log(`[Server]: Running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`[Error]: ${error.message}`);
        process.exit(1);
    }
};

startServer();