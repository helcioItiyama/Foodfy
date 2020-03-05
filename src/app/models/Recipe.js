const db = require('../../config/db');
const {date} = require('../../lib/utils');

module.exports = {
    all() {
        return db.query (`
        SELECT recipes.*, chefs.name AS chefs_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `)
    },

    create(data) {
        const query = `
        INSERT INTO recipes(
            title,
            ingredients,
            preparation,
            information,
            created_at,
            chef_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`

        const filteredIngredients = data.ingredients.filter(function(ingredients){
            return ingredients != ""
        })
    
        const filteredPreparation = data.preparation.filter(function(preparation){
            return preparation != ""
        })

        ingredients = filteredIngredients
        preparation = filteredPreparation

        const values = [
            data.title,
            ingredients,
            preparation,
            data.information,
            date(Date.now()).iso,
            data.chefs
            ]

        return db.query(query, values)
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

    update(data) {
        const query = `
            UPDATE recipes
            SET title = ($1),
                ingredients = ($2),
                preparation = ($3),
                information = ($4),
                created_at = ($5),
                chef_id = ($6)
            WHERE id = $7`

        const filteredIngredients = data.ingredients.filter(function(ingredients){
            return ingredients != ""
        })
    
        const filteredPreparation = data.preparation.filter(function(preparation){
            return preparation != ""
        })

        ingredients = filteredIngredients
        preparation = filteredPreparation

        const value = [
            data.title,
            ingredients,
            preparation,
            data.information,
            date(Date.now()).iso,
            data.chefs,
            data.id
        ]

        return db.query(query, value)
    },

    delete(id) {
        return db.query(`
        DELETE FROM recipes
        WHERE id = $1`, [id])
    },

    paginate(params) {
        const {filter, limit, offset} = params;

        let query = "",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM recipes) AS total`
          
        if(filter) {
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
            LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset])
    },

        files(id) {
        return db.query(`
        SELECT files.*, recipe_id, file_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1
        `, [id]
        )
      },
}