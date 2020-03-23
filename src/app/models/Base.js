const db = require('../../config/db');
  
const Base = {
    init({table}) {
        if(!table) throw new Error('Invalid Params');

        this.table = table;
        return this
    },
    
    async findOne(filter) {
        try{
            let query = `SELECT * FROM ${this.table}`
            Object.keys(filter).map(key => {
                query += ` ${key}`

                Object.keys(filter[key]).map(field => {
                    query += ` ${field} = '${filter[key][field]}'`
                })
            })

            const results = await db.query(query);
            return results.rows[0]

        } catch(err) {
            console.error(err)
        }
    },

    async create(fields) {
        try {
            let keys = [],
                values = [],
                num = [];

        Object.keys(fields).map((key, index, array) => {
            keys.push(key)
            
            values.push(fields[key])
           
            if(index < array.length) {
                num.push(`$${index + 1}`)
            }
        })
 
            const query = `
            INSERT INTO ${this.table} (${keys.join(',')})
            VALUES (${num.join(',')})
            RETURNING id
            `

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch(error) {
            console.error(`create error ${error}`)
        }
    },

    update(id, fields) {
        try {
            let num = [],
                values = [],
                update = [];

            Object.keys(fields).map((key, index, array) => {
               
                if(index < array.length) {
                    num = (`$${index + 1}`)
                }

                values.push(fields[key]);

                let line = `${key} = (${num})`
                update.push(line);
            })

            let query =`UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}`
            
            return db.query(query, values)
            
        } catch(error) {
            console.error(error)
        }
    },

    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
        
    },

    async files(id, field) {
        
        try {
            const results = await db.query(`SELECT * 
            FROM files
            LEFT JOIN ${this.table} ON (files.id = ${this.table}.file_id)
            WHERE ${this.table}.${field} = $1`, [id])
            return results.rows
        } catch (err) {
            console.log(`database files error ${err}`)
        }
    },

    /*paginate(params) {
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM recipes) AS total`

        if (filter) {
            filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'
                OR chefs.name ILIKE '%${filter}%'`
            totalQuery = `(SELECT count(*) FROM chefs ${filterQuery}) As total2, (SELECT count(*) FROM recipes ${filterQuery}) AS total1`
        }

        query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
            ${filterQuery}
            ORDER BY updated_at DESC
            LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset])
    }*/
}

module.exports = Base;