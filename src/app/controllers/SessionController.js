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
    }
}