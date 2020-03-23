const {unlinkSync} = require('fs');

const {date} = require('../../lib/utils');

const Chef = require('../models/Chef');
const File = require('../models/File');
const FileRecipe = require("../models/FileRecipe");


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
            let files = await Chef.files(item.id, 'id');
            item.src = files[0].path.replace("public", "")
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
        const {filename, path} = req.files[0]
        let results = await File.create({name: filename, path})

        const {name} = req.body;
    
        await Chef.create({
            name,
            created_at: date(Date.now()).iso,
            file_id: results
        });

        return res.redirect(`/chefs`)
    },

    async show(req, res) {
        let foundChef = await Chef.find(req.params.id);
                
        let files = await Chef.files(foundChef.id, 'id');
        
        files = {
            ...foundChef,
            src: files[0].path.replace("public", "")
        }
        
        if(!foundChef) return res.send("chef not found!")
        
        const chefs = await Chef.RecipesOwned()
        const recipes = chefs.rows;

        const fileImage = recipes.map(async recipe => {
            let files = await FileRecipe.files(recipe.id, 'recipe_id');
            recipe.src = files[0].path.replace("public", "")
        })
        await Promise.all(fileImage)

        return res.render("admin/chefs/show", {item: foundChef, files, recipes})
    },
    
    async edit(req, res) {
        let foundChef = await Chef.find(req.params.id);
               
        if(!foundChef) return res.send("chef not found!")
        
        const fileImage = await Chef.files(foundChef.id, 'id')
        
        const files = {
            ...fileImage[0],
            src: fileImage[0].path.replace("public", "")
        }
        return res.render("admin/chefs/edit", {item: foundChef, files})
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body);
        for (let key of keys) {
            if(req.body[key] =="" && key !== "removed_files") {
                return res.send("Por favor, preencha todos os campos")
            }
        }

        if(req.files.length != 0) {
            const {filename, path} = req.files[0]
            let fileId = await File.create({name: filename, path})

            const {name} = req.body;
            await Chef.update(req.body.id, {
                name,
                created_at: date(Date.now()).iso,
                file_id: fileId
            });

        } else {
            let foundChef = await Chef.find(req.body.id);
            if(!foundChef) return res.send("chef not found!")
            let chef = await Chef.files(foundChef.id, 'id')

            const {name} = req.body;
            await Chef.update(req.body.id, {
                name,
                created_at: date(Date.now()).iso,
                file_id: chef[0].file_id
            });
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1)
            
            const id = removedFiles[0];
            const file = await File.findOne({where: {id}})

            unlinkSync(file.path)
            File.delete(file.id)
        }
    
        return res.redirect(`/chefs/${req.body.id}`)
    },
    
    async delete(req, res) {
        const results = await Chef.checkDelete(req.body.id)
        const chef = results.rows;
        if(chef[0].total_recipes > 0) {
            return res.send("Somente chefs sem receitas podem ser deletados")// enviar como mensagem de erro
        }

        const files = await Chef.files(req.body.id, 'id')
        await Chef.delete(req.body.id);
        files.map(file => {
            try {
                File.delete(file.file_id)
                unlinkSync(file.path)
            } catch(error) {
                console.error(error)
            }
        })
        return res.redirect("/chefs")      
    }
}; 