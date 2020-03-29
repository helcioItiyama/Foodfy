function checkAllFields (fields) {
    const keys = Object.keys(fields);
    for (key of keys) {
        if (fields[key] == "" && key != "removed_files")
            return true
    }
}

module.exports = {
    post(req, res, next) {
        const fillAllFields = checkAllFields(req.body);
        if(fillAllFields) {
            return res.render('message/fillForm');
        }

        if(req.files.length == 0) {
            return res.render('message/uploadPhoto');
        }
        next()
    },

    put(req, res, next) {
        const fillAllFields = checkAllFields(req.body);
        if(fillAllFields) {
            return res.render('message/fillForm');
        }
        next()
    }

}