const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator')
require('dotenv').config();

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:5,
        trim:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    firstname:{
        type:String,
        trim:true,
        maxLength:100,
    },
    lastname:{
        type:String,
        trim:true,
        maxLength:100,
    },
    age:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    },
    verified:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save', async function () {
    const user = this;

    // Only hash if password was modified
    if (!user.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});


userSchema.statics.emailTaken = async function(email) {
    const user = await this.findOne({email});
    return !!user;
}

userSchema.methods.generateAuthToken = function(){
    let user = this;
    const userObj = {sub:user._id.toHexString(),email:user.email};
    const token = jwt.sign(userObj,process.env.JWT_SECRET,{expiresIn:'1d'})
    return token;
}

// userSchema.methods.generateAuthToken = function () {
//     return jwt.sign(
//         {
//             sub: this._id.toString(),
//             email: this.email
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//     );
// };

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}


const User = mongoose.model('User', userSchema);
module.exports = { User }