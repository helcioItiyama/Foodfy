module.exports = {
    onlyUser(req, res, next) {
        if(!req.session.userId) return res.render('admin/session/login')
        next()
    } 
}