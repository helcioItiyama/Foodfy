const {date} = require('../../lib/utils');
const DeleteFiles = require('../services/DeleteFiles');
const PageService = require('../services/PageService');

const Chef = require('../models/Chef');
const File = require('../models/File');
const FileRecipe = require("../models/FileRecipe");

module.exports = {
    async index(req, res) {
        const params = await PageService.page(req.query);
        
        const results = await Chef.paginate(params);
        const items = results.rows;

        const itemsPromise = items.map(async item => {
                let files = await Chef.files(item.id, 'id')
                
                item.src = files[0].path.replace("public", "")
        })

        await Promise.all(itemsPromise)

        if(items[0] == undefined) {
            return res.render("admin/chefs/chefs", {error: "Ops! Busca não encontrada"})
        }

        const {filter, limit, page} = params;

        const pagination = {
            total: Math.ceil(items[0].total / limit),
            page,
        }
        
        return res.render("admin/chefs/chefs", {items, pagination, filter})
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    }, 

    async post(req, res) {
        const {filename, path} = req.files[0]
        let results = await File.create({name: filename, path})

        const {name} = req.body;
        await Chef.create({
            name,
            created_at: date(Date.now()).iso,
            file_id: results
        });
        return res.render("message/success", {type: "Chef ", action: "criado"})
    },

    async show(req, res) {
        let {foundChef, files} = await getChef(req.params.id);
        
        files = {...foundChef, src: files[0].path.replace("public", "")}
        
        const chefs = await Chef.RecipesOwned()
        const recipes = chefs.rows;

        const fileImage = recipes.map(async recipe => {
            let files = await FileRecipe.files(recipe.id, 'recipe_id');
            if(files[0]) {
                recipe.src = files[0].path.replace("public", "")
            } else {
            recipe.src = 'https://placehold.it/500x500?text=PRODUTO SEM FOTO'
            }
        })
        await Promise.all(fileImage)
        return res.render("admin/chefs/show", {item: foundChef, files, recipes})
    },
    
    async edit(req, res) {
        let {foundChef, files} = await getChef(req.params.id);
        files = {...foundChef, src: files[0].path.replace("public", "")}
        return res.render("admin/chefs/edit", {item:foundChef, files})
    },
    
    async put(req, res) {
        if(req.files.length == 0) {
            return res.render('message/uploadPhoto');
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
            let {files} = await getChef(req.params.id);
            
            const {name} = req.body;
            await Chef.update(req.body.id, {
                name,
                created_at: date(Date.now()).iso,
                file_id: files[0].file_id
            });
        }

        if(req.body.removed_files) {
            DeleteFiles.removeUpdatedFiles(req.body)
        }
        return res.render("message/success", {type: "Chef ", action: "editado"})
    },
    
    async delete(req, res) {
        const results = await Chef.checkDelete(req.body.id)
        const chef = results.rows;
        
        if(chef[0].total_recipes > 0) {
            return res.render("message/ownRecipe")
        }
        const files = await Chef.files(req.body.id, 'id')
        await Chef.delete(req.body.id);
        
        DeleteFiles.deleteFiles(files);

        return res.render("message/success", {type: "Chef ", action: "deletado"})   
    }
}; 

async function getChef(id) {
    let foundChef = await Chef.find(id);
    if(!foundChef) return res.send("chef not found!")
    let files = await Chef.files(foundChef.id, 'id');

    return {files, foundChef}
}

