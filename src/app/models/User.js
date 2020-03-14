const db = require('../../config/db');
const {date} = require('../../lib/utils')
const {hash} = require('bcryptjs');

module.exports = {
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
        const passwordHash = await hash(data.password, 8);

        const values = [
            data.name,
            data.email,
            passwordHash,
            data.admin,
            date(Date.now()).iso
        ]

        return db.query(query, values)
        
        } catch(err) {
            console.error(err)
        }
    },

    findOne(filter) {
        try{
            return db.query(`
            SELECT * FROM users
            WHERE users.email = $1`, [filter])
        } catch(err) {
            console.error(err)
        }
    }
}