const Recipe = require('../models/Recipe');
const File = require('../models/File');
const FileRecipe = require('../models/FileRecipe');

module.exports = {
    async home(req, res) {
        const info = {
            title: "As melhores receitas",
            description: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
            image: "/chef.png",
            description2: "As 6 primeiras receitas"
        }

        const recipes = await Recipe.all();
        const items = recipes.rows;
        return res.render('admin/recipes/home', {info, items});
    },

    about(req, res) {
    return res.render('admin/recipes/about');
    },

    async index(req, res) {
        let {filter, page, limit} = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page -1);

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipe.paginate(params);
        let items = results.rows;

        let recipes = await Recipe.all()
        
        // essa parte que não estou conseguindo fazer
        let id = []
        let filesId = recipes.rows
        for (let file of filesId) {
            
           id.push(file.id)
        }
        console.log(id)
        /*const idPromise = id.map(fileId => Recipe.files({
            fileId
          }))

        results = await Promise.all(idPromise)

        
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))*/
              
        if(items[0] == undefined) {
            return res.render("admin/recipes/recipes")
        }

        const countTotal = () => {
            const total = items[0].total;
            const totalRecipes = items[0].total1;
            const totalChef = items[0].total2;
            if(total) {
                return Math.ceil(total / limit)
            } else if(!total && totalChef < totalRecipes) {
                return Math.ceil(totalChef / limit)
            } else if(!total && totalRecipes < totalChef) {
                return Math.ceil(totalRecipes / limit)
            }
        }

        const pagination = {
            total: countTotal(),
            page
        }

         return res.render("admin/recipes/recipes", {items, pagination, filter})
    },

    async create(req, res) {
        const options = await Recipe.chefSelectOptions()
        const chefOptions = options.rows;
        return res.render("admin/recipes/create", {chefOptions})
    },

    async post(req, res) {
        const keys = Object.keys(req.body);
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        if(req.files.length == 0) {
            return res.send("Por favor, envie ao menos uma imagem")
        }
        
        let results = await Recipe.create(req.body);
        const recipeId = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file}))
        const filesId = await Promise.all(filesPromise);
        const relationPromise = filesId.map(fileId => FileRecipe.create({
            recipe_id: recipeId,
            file_id: fileId
          }))
      
        await Promise.all(relationPromise)

        return res.redirect(`/admin/recipes`)
        
    },

    async show(req, res) {
        let results = await Recipe.find(req.params.id);
        const item = results.rows[0];
        if(!item) return res.send("recipe not found!")

        results = await Recipe.files(item.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
       
        return res.render("admin/recipes/show", {item, files})
    },
    
    async edit(req, res) {
        //get recipes
        let results = await Recipe.find(req.params.id);
        const item = results.rows[0];
        if(!item) return res.send("recipe not found!")
        //get chefs
        const options = await Recipe.chefSelectOptions();
        const chefOptions = options.rows;

        //get images
        results = await Recipe.files(item.id);
        let files = results.rows
        
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
   
        return res.render("admin/recipes/edit", {item, chefOptions, files})
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body);
        for (let key of keys) {
            if(req.body[key] =="" && key != "removed_files") {
                return res.send("Por favor preencha todos os campos")
            }
        }

        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create(file))
                const filesId = await Promise.all(newFilesPromise)
            
            const relationPromise = filesId.map(fileId => FileRecipe.create({
                recipe_id: req.body.id,
                file_id: fileId
                }))
                await Promise.all(relationPromise)
            
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1)
            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        await Recipe.update(req.body)
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    
    async delete(req, res) {
        await Recipe.delete(req.body.id)
        return res.redirect("/admin/recipes")
    }

};

