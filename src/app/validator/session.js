const User = require('../../app/models/User');
const {compare} = require('bcryptjs');

module.exports = {
    
    async login(req, res, next) {
        //check if user exists
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if(!user) return res.render('admin/session/login', {
            user: req.body,
            error: "Usuário não cadastrado!"
        })

        //check if password matches
        const passed = await compare(password, user.password);

        if(!passed) return res.render('admin/session/login', {
            user: req.body,
            error: "Senha incorreta!"
        })

        //put user to req.ression
        req.user = user
        next()
    },

    async forgot(req, res, next) {
       const {email} = req.body;

        try {
            let user = await User.findOne({where: {email}});
            
            if(!user) return res.render('admin/session/forgot-password', {
                user: req.body,
                error: "Usuário não cadastrado!"
            })
            req.user = user
            next()
        } catch(err) {
            console.error(err)
        }
    }

}