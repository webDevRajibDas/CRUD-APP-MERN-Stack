const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const userService = require('./users.service');
const { ApiError } = require('../middleware/apiError');
const { status } = require('http-status');
const createUser = async(email,password,firstname,lastname)=>{
    try {

        if(await User.emailTaken(email)){
            throw new ApiError(status.BAD_REQUEST,'Sorry email Taken');
        }
        const user = new User({
            email,
            password,
            firstname,
            lastname
        });
        // save user
        await user.save();
        // Return for token Generate
        return user;
    } catch (error) {
        throw error;
    }
}




/**
 * Sign in user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object with token or error
 */
const signInWithEmailAndPassword = async(email, password)=>{

    try {
        const user = await userService.findUserByEmail(email)
        if(!user){
            throw new ApiError(status.BAD_REQUEST,'Sorry Bad email');
        }
        /// validate password
        if(!(await user.comparePassword(password))){
            throw new ApiError(status.BAD_REQUEST,'Sorry bad password');
        }
        return user;

    } catch (error) {
        console.error('Sign in error:', error.message);
        return {
            success: false,
            error: error.message,
            message: error.message
        };
    }
}
// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
}

const genAuthToken = (user) => {
    if (!user || !user.generateAuthToken) {
        throw new Error('Invalid user object');
    }
    return user.generateAuthToken();
};

// GitHub upload next

module.exports = {
    createUser,
    genAuthToken,
    generateToken,
    signInWithEmailAndPassword
}