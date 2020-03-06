const db = require('../../config/db');
const {date} = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`
        SELECT *
        FROM chefs
        `, (err, results) => {
            if(err) throw `Data error! ${err}`;
            callback(results.rows)
        })
    },

    create(data) {
        const query = `
        INSERT INTO chefs(
            name,
            created_at,
            file_id
        ) VALUES ($1, $2, $3)
        RETURNING id`

        const values = [
            data.name,
            date(Date.now()).iso,
            data.fileId
            ]

        return db.query(query, values)
    },

    find(id) {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
        `, [id])
    },

    RecipesOwned() {
        return db.query(`SELECT chef_id, id, title
            FROM recipes`)
    },

    update(data) {
        const query = `
            UPDATE chefs
            SET name = ($1),
                file_id = ($2)
            WHERE id = $3`

        const value = [
            data.name,
            data.fileId,
            data.id
        ]

        return db.query(query, value)
    },

    checkDelete(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
    },

    delete(id) {
        return db.query(`
        DELETE FROM chefs
        WHERE id = $1`, [id])
    },

    paginate(params) {
        const {filter, limit, offset} = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM chefs) AS total`

        if(filter) {
            filterQuery = `WHERE chefs.name ILIKE '%${filter}%'`
            totalQuery = `(SELECT count(*) FROM chefs ${filterQuery}) AS total`
        }

        query = `
            SELECT chefs.*, ${totalQuery}
            FROM chefs
            ${filterQuery}
            LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset])
    },

    files(id) {
        return db.query(`SELECT * 
        FROM files 
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        WHERE chefs.id = $1`, [id])
    }
}