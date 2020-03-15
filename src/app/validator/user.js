const User = require('../../app/models/User');
const {compare} = require('bcryptjs');

function checkAllFields(body) {
    const keys = Object.keys(body);
    for (let key of keys) {
        if(body[key] =="" && key !== "removed_files") {
            return {
                user: body,
                error: "Por favor, preencha todos os campos"
            }
        }
    }
}

module.exports = {
    async post(req, res, next) {
        //check if all fields are filled
        const fillAllFields = checkAllFields(req.body);

        if(fillAllFields) {
            return res.render('/admin/register', fillAllFields)
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
    },

    async show(req, res, next) {
        const {userId: id} = req.session;

        const user = await User.findOne({where: {id}});

        if(!user) return res.render('admin/users/register', {
            error: "Usuário não encontrado"
        })

        req.user = user;

        next()
    },

    async update(req, res, next) {
        //check if all fields are filled
        const fillAllFields = checkAllFields(req.body);

        if(fillAllFields) {
            return res.render('admin/users/index', fillAllFields)
        }
        //if there's a password
        const {id, password} = req.body;

        if(!password) return res.render('admin/users/index', {
            user: req.body,
            error: "Insira a sua senha para atualizar seu cadastro!"
        })

        const user = await User.findOne({where: {id}});

        const passed = await compare(password, user.password);

        if(!passed) return res.render('admin/users/index', {
            user: req.body,
            error: "Senha incorreta!"
        })

        req.user = user;

        next()
    }

}