const User = require('../models/User');

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },

    async post(req, res) {
        const results = await User.create(req.body);
        const userId = results.rows[0].id
        req.session.userId = userId;

        return res.redirect('/admin/register')
    },

    async index(req, res) {
        const {userId: id} = req.session;

        const user = await User.findOne({where: {id}});

        if(!user) return res.render('admin/users/register', {
            error: "Usuário não encontrado"
        })
        
        return res.render('admin/users/index', {user})
    }
}