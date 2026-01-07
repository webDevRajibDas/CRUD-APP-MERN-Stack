const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('./middleware/sanitize');

// ===== BODY PARSING (MUST BE FIRST) =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== SECURITY MIDDLEWARE =====
app.use(xss());


// Then use the sanitize middleware
app.use(mongoSanitize());


// ===== ROUTES =====
const routes = require('./routes');
app.use('/api', routes);


// ===== DATABASE =====
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// ===== SERVER =====
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
