const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
    async list(req, res) {
        let {filter, page, limit} = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page -1);

        const params = {
            filter,
            page,
            limit,
            offset,
        }
        const results = await Profile.paginate(params);
        const users = results.rows;

        if(users[0] == undefined) {
            return res.render("admin/profile/list")
        }
        const pagination = {
            total: Math.ceil(users[0].total / limit),
            page
        }
        return res.render("admin/profile/list", {users, pagination, filter})
        
    },

    create(req, res) {
        return res.render("admin/profile/create")
    }, 

    async post(req, res) {
        try {
            const userId = await Profile.create(req.body);
            req.session.userId = userId;
          
            return res.render('admin/profile/edit', {
                user: req.body,
                success: "Usuário adicionado com sucesso!"
            })
        } catch(err) {
            console.error(err)
        }
    },

    //user profile when he receives the email
    async show(req, res) {
        const id = req.params.id;
        const user = await User.findOne({where: {id}});
       
        if(!user) return res.render("admin/profile/list", {
            error: "Usuário não encontrado!"
        })

        return res.render(`admin/profile/edit`, {user})
    },

    async put(req, res) {
        try {
            let {id, name, email, admin=false} = req.body;
           
            await User.update(id, {name, email, is_admin:admin});

            return res.render('admin/profile/edit', {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })

        } catch(err) {
            console.error(err)
            return res.render('admin/profile/edit', {
                user: req.body,
                error: "Houve algum erro imprevisto!"
            })
        }
    },

    async delete(req, res) {
        console.log(req.body)
       await Profile.delete(req.body.id)
       return res.redirect('/admin/users')
    }
}
