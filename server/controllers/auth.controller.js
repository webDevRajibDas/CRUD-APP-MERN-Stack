const {authService} = require('../services');
const {status} = require('http-status');

const authController = {
    async register(req, res) {
        try {
            const {email, password, firstname, lastname} = req.body;
            const user = await authService.createUser(email, password, firstname, lastname);
            const token = await authService.genAuthToken(user);

            // SEND VERIFICATION EMAIL
            res.cookie('x-access-token', token)
                .status(status.CREATED).send({
                user,
                token
            })
        } catch (error) {
            res.status(status.BAD_REQUEST).send(error.message)
        }
    },

    async loginApp(req, res, next) {
        try {
            //console.log(req.body);
            const {email, password} = req.body
            const user = await authService.signInWithEmailAndPassword(email, password);
            const token = await authService.genAuthToken(user);
            res.cookie('x-access-token', token).send({
                user,
                token
            })

        } catch (error) {
            res.status(status.BAD_REQUEST).send(error.message)
        }


    },

    async isAuth(req, res, next){
        try {
            //res.json({ ok: true });
            res.json(req.user)
        } catch (error) {
            res.status(status.BAD_REQUEST).send(error.message)
        }
    }

}


module.exports = authController;