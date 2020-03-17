const db = require('../../config/db');
const {date} = require('../../lib/utils');
const {hash} = require('bcryptjs');

module.exports = {
    all(callback) {
        db.query(`
        SELECT *
        FROM users
        `, (err, results) => {
            if(err) throw `Data error! ${err}`;
            callback(results.rows)
        })
    },

    async create(data) {
        try {
            const query = `
            INSERT INTO users(
                name,
                email,
                password,
                is_admin,
                created_at
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `
            const password = Math.random().toString(36).substring(0, 7)
            const passwordHash = await hash(password, 8);

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.admin || false,
                date(Date.now()).iso
            ]
    
            const results = await db.query(query, values)
    
            return results.rows[0].id
            
        } catch(err) {
                console.error(err)
        }
    },
    

    /*find(id) {
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
    },*/

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
    },
/*
    files(id) {
        try {
            return db.query(`SELECT * 
            FROM files 
            LEFT JOIN chefs ON (files.id = chefs.file_id)
            WHERE chefs.id = $1`, [id])
        } catch (err) {
            console.log(`database files error ${err}`)
        }
    }*/
}