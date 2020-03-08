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
        try {
            const query = `INSERT INTO chefs(
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
        } catch(err) {
            console.log(`database create error ${err}`)
        }
        
    },

    find(id) {
        try {
            return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `, [id])
        } catch (err) {
            console.log(`Database find error ${err}`)
        }
    },

    RecipesOwned() {
        try {
            return db.query(`
                SELECT chef_id, id, title
                FROM recipes
                ORDER BY created_at DESC
                `)
        } catch(err) {
            console.log(`database recipesowned error ${err}`)
        }
    },

    update(data) {
        try {
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

        } catch(err) {
            console.log(`database update error ${err}`)
        }
    },

    checkDelete(id) {
        try {
            return db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes 
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                WHERE chefs.id = $1
                GROUP BY chefs.id`, [id])
        } catch(err) {
            console.log(`database checkdelete error ${err}`)
        }
    },

    delete(id) {
        try {
            return db.query(`
            DELETE FROM chefs
            WHERE id = $1`, [id])
        } catch(err) {
            console.log(`database delete error ${err}`)
        }
    },

    paginate(params) {
        try {
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
        } catch(err) {
            console.log(`database paginate error ${err}`)
        }
    },

    files(id) {
        try {
            return db.query(`SELECT * 
            FROM files 
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.id = $1`, [id])
        } catch (err) {
            console.log(`database files error ${err}`)
        }
    }
}