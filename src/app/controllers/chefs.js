const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require("../models/Recipe");

module.exports = {
    async index(req, res) {
        let {filter, page, limit} = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page -1);

        const params = {
            filter,
            page,
            limit,
            offset,
        }
        const results = await Chef.paginate(params);
        const items = results.rows;
        const itemsPromise = items.map(async item => {
            const files = await Chef.files(item.id);
            item.src = files.rows[0].path.replace("public", "")
        })
        await Promise.all(itemsPromise)

        if(items[0] == undefined) {
            return res.render("admin/chefs/chefs")
        }
        const pagination = {
            total: Math.ceil(items[0].total / limit),
            page
        }
        return res.render("admin/chefs/chefs", {items, pagination, filter})
        
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    }, 

    async post(req, res) {
        const keys = Object.keys(req.body);
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        let results = await File.create(req.files[0])

        const chefs = {
            ...req.body,
            fileId: results
        }
        await Chef.create(chefs);
        return res.redirect(`/chefs`)
    },

    async show(req, res) {
        let results = await Chef.find(req.params.id);
        let item = results.rows[0]

        
        results = await Chef.files(item.id)

        let files = results.rows[0].path
        
        files = {
            ...item,
            src: files.replace("public", "")
        }
        
        if(!item) return res.send("chef not found!")
        
        const chefs = await Chef.RecipesOwned()
        const recipes = chefs.rows;

        const itemsPromise = recipes.map(async recipe => {
            const files = await Recipe.files(recipe.id);
            recipe.src = files.rows[0].path.replace("public", "")
        })
        await Promise.all(itemsPromise)

        return res.render("admin/chefs/show", {item, files, recipes})
    },
    
    async edit(req, res) {
        let results = await Chef.find(req.params.id);
        let item = results.rows[0];
        
        if(!item) return res.send("chef not found!")
        
        results = await Chef.files(item.id)
        let fileImage = results.rows[0]
        
        files = {
            ...fileImage,
            src: fileImage.path.replace("public", "")
        }
        return res.render("admin/chefs/edit", {item, files})
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body);
        for (let key of keys) {
            if(req.body[key] =="" && key !== "removed_files") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        if(req.files.length != 0) {
            let results = await File.create(req.files[0])
            let chefs = {
                ...req.body,
                fileId: results
            }
            await Chef.update(chefs);
        } else {
            let results = await Chef.find(req.body.id);
            let item = results.rows[0];
            results = await Chef.files(item.id)

            let chef = {
                ...req.body,
                fileId: results.rows[0].file_id
            }
            await Chef.update(chef);
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1)
            File.delete(removedFiles[0])
        }
    
        return res.redirect(`/chefs/${req.body.id}`)
    },
    
    async delete(req, res) {
        const results = await Chef.checkDelete(req.body.id)
        const chef = results.rows;
        if(chef[0].total_recipes > 0) {
            return res.send("Somente chefs sem receitas podem ser deletados")
        }
        
        await Chef.delete(req.body.id)
        return res.redirect("/chefs")      
    }
};