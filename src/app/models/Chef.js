const db = require('../../config/db');
const Base = require('./Base');

Base.init({table: 'chefs'});

module.exports = {
    ...Base,
    
    async find(id) {
        try {
            const results = await db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            `, [id])

            return results.rows[0]
            
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
    }
}