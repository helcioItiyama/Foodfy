const crypto = require('crypto');
const {hash} = require('bcryptjs');

const mailer = require('../../lib/mailer');
const {date} = require('../../lib/utils');
const PageService = require('../services/PageService');

const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = {
    async list(req, res) {
        const params = await PageService.page(req.query);
        const results = await User.paginate(params);
        const users = results.rows;

        if(users[0] == undefined) {
            return res.render("admin/chefs/chefs", {error: "Ops! Busca não encontrada"})
        }
        
        const {limit, page, filter} = params;

        const pagination = {
            total: Math.ceil(users[0].total / limit),
            page,
        }

        return res.render("admin/profile/list", {users, pagination, filter})
    },

    create(req, res) {
        return res.render("admin/profile/create")
    }, 
 
    async post(req, res) {
        try {
            const {name, email, admin=false} = req.body;
            const pin = Math.random().toString(36).slice(-8).toUpperCase();
            const passwordHash = await hash(pin, 8);

            const userId = await Profile.create({
                name,
                email,
                password: passwordHash,
                is_admin: admin,
                created_at: date(Date.now()).iso
            });
            const user = await User.findOne({where: {id:userId}});

            //create token for user
            const token = crypto.randomBytes(20).toString('hex');
            
            //create expiration time
            let now = new Date;
            now = now.setHours(now.getHours() + 1);
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
            //send email to user created by admin
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Você foi convidado a participar do Foodfy',
                html: `<h2>Olá ${user.name}!</h2>
                <p>Você foi convidado para ser membro do site de receitas Foodfy!</p>
                <p>Geramos uma senha automática para o seu acesso ao sistema: ${pin}</p>
                <p>Caso queira criar uma nova senha, click no link abaixo: </p>
                <p>
                    <a href='http://localhost:5000/admin/password-reset?token=${token}' target="_blank">
                    ENTRAR</a>
                </p>`
            })

            return res.render('admin/profile/edit', {
                user: req.body,
                success: "Usuário adicionado com sucesso!"
            })

        } catch(err) {
            console.error(err)
        }
    },

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

    async deletePage(req, res) {
        const id = req.params.id;
        const user = await User.findOne({where: {id}});
       
        if(!user) return res.render("admin/profile/list", {
            error: "Usuário não encontrado!"
        })

        return res.render("admin/profile/delete", {user})
    },

    async delete(req, res) {
       await Profile.delete(req.body.id)
       return res.render("message/success", {type: "Receita ", action: "deletada", path: "users/"})
    }
}
