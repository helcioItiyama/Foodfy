const User = require('../models/User');

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },

    async post(req, res) {
        try {
            const userId = await User.create(req.body);
            const user = await User.findOne({where: {id:userId}})
            
            req.session.userId = user.id;
            req.session.admin = user.is_admin;
            
            return res.redirect('/admin/profile')
        } catch(err) {
            console.error(err)
        }
    },
 
    async index(req, res) {
        const {user} = req;

        return res.render('admin/users/index', {user})
    },

    async put(req, res) {
        try {
            let {name, email, admin} = req.body;
            const{user} = req;

            await User.update(user.id, {name, email, admin});

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