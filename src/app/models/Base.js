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
                position = [];

            Object.keys(fields).map((key, index, array) => {
                keys.push(key)
                values.push(fields[key])
            
                if(index < array.length) {
                    position.push(`$${index + 1}`)
                }
            })
            const query = `
            INSERT INTO ${this.table} (${keys.join(',')})
            VALUES (${position.join(',')})
            RETURNING id`
            
            const results = await db.query(query, values)
            return results.rows[0].id
        } catch(error) {
            console.error(`create error ${error}`)
        }
    },

    update(id, fields) {
        try {
            let position = [],
                values = [],
                update = [];

            Object.keys(fields).map((key, index, array) => {
                if(index < array.length) {
                    position = (`$${index + 1}`)
                }
                values.push(fields[key]);

                let line = `${key} = (${position})`
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
        } catch (error) {
            console.error(`database files error ${error}`)
        }
    },
}

module.exports = Base;