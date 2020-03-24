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
            return res.send('Por favor, preencha todos os campos!')
        }

        if(req.files.length == 0) {
            return res.send("Por favor, envie ao menos uma imagem")
        }
        next()
    },

    put(req, res, next) {
        const fillAllFields = checkAllFields(req.body);
        if(fillAllFields) {
            return res.send('Por favor, preencha todos os campos!')
        }
        next()
    }

}