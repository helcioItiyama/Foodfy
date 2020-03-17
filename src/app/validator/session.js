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
    },

    async reset(req, res, next) {
        const {email, password, passwordRepeat, token} = req.body;
        //search user
        const user = await User.findOne({where: {email}});
     
        if(!user) return res.render('admin/session/password-reset', {
            user: req.body,
            token,
            error: "Email não encontrado"
        })

        //check if password matches
        if(password != passwordRepeat) return res.render('admin/session/password-reset', {
            user: req.body,
            token,
            error: "A repetição de senha não confere"
        })
       
        //check if token matches      
        if(token != user.reset_token) return res.render('admin/session/password-reset', {
            user: req.body,
            token,
            error: "Token inválido. Solicite uma nova recuperação de senha"
        })
        //check if token expired
        let now = new Date()
        now = now.setHours(now.getHours())
        if(now > user.reset_token_expires) return res.render('admin/session/password-reset', {
            user: req.body,
            error: "Token expirado. Solicite uma nova recuperação de senha"
        })

        req.user = user
        next()
    }

}