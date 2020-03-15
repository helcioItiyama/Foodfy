module.exports = {
    onlyAdmin(req, res, next) {
        if(!req.session.userId) return res.render('admin/users/index')
        next()
    } 
}