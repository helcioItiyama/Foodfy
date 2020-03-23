const db = require('../../config/db');
const Base = require('./Base');

Base.init({table: 'users'});

module.exports = {
    ...Base,

    delete(id) {
        try {
            return db.query(`
            DELETE FROM users
            WHERE id = $1`, [id])
        } catch(err) {
            console.error(`database delete error ${err}`)
            return res.render('admin/profile/edit', {
                users: req.body,
                error: "Houve algum imprevisto. Por favor, tente novamente!"
            })
        }
    },

    paginate(params) {
        try {
            const {filter, limit, offset} = params;
    
            let query = "",
                filterQuery = "",
                totalQuery = `(SELECT count(*) FROM users) AS total`
    
            if(filter) {
                filterQuery = `WHERE users.name ILIKE '%${filter}%'`
                totalQuery = `(SELECT count(*) FROM users ${filterQuery}) AS total`
            }
            query = `
                SELECT users.*, ${totalQuery}
                FROM users
                ${filterQuery}
                LIMIT $1 OFFSET $2`
    
            return db.query(query, [limit, offset])
        } catch(err) {
            console.error(`database paginate error ${err}`)
        }
    }
}
