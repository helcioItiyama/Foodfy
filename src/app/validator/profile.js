const User = require('../models/User');

module.exports = {
    async post (req, res, next) {
        const {email} = req.body;

        const user = await User.findOne({where: {email}});
      
        if(user) return res.render('admin/profile/create', {
            user: req.body,
            error: "Email já cadastrado"
        })

        next()
    }
}