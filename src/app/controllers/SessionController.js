const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const User = require('../models/User');
const {hash} = require('bcryptjs');

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },

    login(req, res) {
        try{
            req.session.userId = req.user.id;
            return res.redirect('/admin/profile')

        } catch(err) {
            console.error(err)
            return res.render('admin/session/login', {
                user: req.body,
                error: "Houve um erro inesperado. Tente novamente!"
            })
        }
        
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },

    forgotForm(req, res){
        return res.render('admin/session/forgot-password')
    },

    async forgot(req, res) {
        const user = req.user;
        try {
            //create token for user
        const token = crypto.randomBytes(20).toString('hex');
        
        //create expiration time
        let now = new Date;
        now = now.setHours(now.getHours() + 1);
        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: now
        })

        //send email with the password recovery link
        await mailer.sendMail({
            to: user.email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Recuperação de senha',
            html: `<h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link para recuperar a sua senha!</p>
            <p>
                <a href='http://localhost:5000/admin/password-reset?token=${token}' target="_blank">
                RECUPERAR SENHA</a>
            </p>`
        })
        //inform user we sent the email
        return res.render('admin/session/forgot-password', {
            success: "Verifique seu email para resetar a sua senha"
        })
        } catch(err) {
            console.error(err)
            return res.render('admin/session/forgot-password', {
                error: "Erro inesperado. Tente novamente!"
            })
        }    
    },

    resetForm(req, res) {
        return res.render('admin/session/password-reset',{token: req.query.token})
    },

    async reset(req, res) {
        try {
            const {user} = req;
            const {password, token} = req.body
            //create new password hash
            const newPassword = await hash(req.body.password, 8);
            //update user
            await User.update(user.id, {
                password: newPassword,
                reset_token:'',
                reset_token_expires:''
            })
            //inform user he's new password
            return res.render('admin/session/login', {
                user: req.body,
                success: "Nova senha cadastrada com sucesso!"
            })

        } catch(err) {
            console.error(err)
            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: "Erro inesperado. Tente novamente!"
            })
        }
    }

}