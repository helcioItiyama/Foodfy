const User = require('../models/User');

module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },

    async post(req, res) {
        const results = await User.create(req.body);
        const userId = results.rows[0].id
        //req.session.userId = userId;

        return res.redirect('/admin/register')
    },

    async show(req, res) {
        
    }
}