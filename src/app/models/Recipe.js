const db = require('../../config/db');
const Base = require('./Base');

Base.init({table: 'recipes'});

module.exports = {
    ...Base,

    all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chefs_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC
        `)
    },

    find(id) {
        return db.query(`
        SELECT recipes.*, chefs.name As chefs_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `, [id])
    },

    chefSelectOptions() {
        return db.query(`SELECT name, id
            FROM chefs`)
    },

    paginate(params) {
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
    }
}

/*
let query = `
SELECT products.*,
    categories.name AS category_name
FROM products
LEFT JOIN categories ON (categories.id = products.category_id)
WHERE 1 = 1
`

if(category) {
query += ` AND 
products.category_id = ${category}`
}

if(filter) {
` AND (products.name ilike '%${filter}%'
OR products.description ilike '%${filter}%')`
}

query += ` AND STATUS != 0`

const results = await db.query(query);
return results.rows*/