const { authService }  = require('../services');
const { status } = require('http-status');

const authController = {
    async register(req,res){
        try {
            const { email,password,firstname,lastname } = req.body;
            const user = await authService.createUser(email,password,firstname,lastname);
            const token = await authService.genAuthToken(user);

            // SEND VERIFICATION EMAIL
            res.cookie('x-access-token',token)
                .status(status.CREATED).send({
                user,
                token
            })
        } catch (error) {
            res.status(status.BAD_REQUEST).send(error.message)
        }
    },

     async loginApp(req, res) {
         try {
             //console.log(req.body);
             const { email, password } = req.body
             const user = await authService.signInWithEmailAndPassword(email, password);
             const token = await authService.generateToken(user);

             res.cookie('x-access-token',token).send({
                 user,
                 token
             })
             // const user = await User.findOne({ email })
             //
             // console.log('Is Mongoose document?', user instanceof mongoose.Document);
             // console.log('User has generateAuthToken?', typeof user.generateAuthToken);
             // console.log('User type:', typeof user);
             // console.log('User constructor name:', user.constructor.email);
             // console.log('User found:', user);
             //
             // if (!user) return res.status(404).json({ message: 'User not found' })
             //
             // const isPasswordValid = await user.comparePassword(password)
             // if (!isPasswordValid)
             //     return res.status(400).json({ message: 'Invalid credentials' })
             //
             // const token = await authService.generateToken(user)
             // res.status(200).json({ user, token })
         } catch (error) {
             res.status(500).json({ message: error.message })
         }


    }

}


module.exports = authController;