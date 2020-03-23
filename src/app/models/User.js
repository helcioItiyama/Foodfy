const Base = require('./Base');

Base.init({table: 'users'});

const {date} = require('../../lib/utils')
const {hash} = require('bcryptjs');

module.exports = {
    ...Base,
    
    /*async create(data) {
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

        const results = await db.query(query, values)
        return results.rows[0].id
        
        } catch(err) {
            console.error(err)
        }
    },*/
}