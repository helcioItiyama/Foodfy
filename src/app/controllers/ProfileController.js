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
        const {user} = req;

        return res.render('admin/users/index', {user})
    },

    async put(req, res) {
        try {
            let {name, email} = req.body;
            const{user} = req;

            await User.update(user.id, {name, email});

            return res.render('admin/users/index', {
                user,
                success: "Conta atualizada com sucesso!"
            })

        } catch(err) {
            console.error(err)
            return res.render('admin/users/index', {
                error: "Houve algum erro imprevisto!"
            })
        }


    }
}