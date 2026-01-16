const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const {xss} = require('express-xss-sanitizer');
const mongoSanitize = require('./middleware/sanitize');

const routes = require('./routes');
const passport = require('passport');
const {jwtStrategy} = require('./middleware/passport')
const {handleError, convertToApiError} = require('./middleware/apiError')

// ===== BODY PARSING (MUST BE FIRST) =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Sanitize
app.use(xss());
app.use(mongoSanitize());
app.use(passport.initialize());
passport.use('jwt', jwtStrategy)

// ===== ROUTES =====
app.use('/api', routes);




//ERROR HANDLING
app.use(convertToApiError);//13
app.use((err, req, res, next) => {
  handleError(err, res)
})


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
