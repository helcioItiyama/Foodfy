const User = require('../../app/models/User');

module.exports = {
    async post(req, res, next) {
        //check if all fields are filled
        const keys = Object.keys(req.body);
        for (let key of keys) {
            if(req.body[key] =="" && key !== "removed_files") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        //check if user already exists
        const {email, password, passwordRepeat} = req.body;

        const user = await User.findOne(email);
      
        if(user) return res.render('admin/users/register', {
            user: req.body,
            error: "Email já cadastrado"
        })

        //check if password matches
        if(password != passwordRepeat) return res.render('admin/users/register', {
            user: req.body,
            error: "A repetição de senha não confere"
        })
       
        next()
    }

}