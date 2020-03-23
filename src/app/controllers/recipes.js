const Recipe = require('../models/Recipe');
const File = require('../models/File');
const FileRecipe = require('../models/FileRecipe');

const {date} = require('../../lib/utils')

module.exports = {
    async home(req, res) {
        const info = {
            title: "As melhores receitas",
            description: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
            image: "/images/chef.png",
            description2: "As 6 primeiras receitas"
        }

        const results = await Recipe.all();
        const recipes = results.rows;
   
        // loop over recipes to get id of each recipe
        const recipesPromise = recipes.map(async recipe => {
            //search for images of each recipe
            const files = await FileRecipe.files(recipe.id,'recipe_id');
            //alocate to recipe.src
            recipe.src = files[0].path.replace("public", "")
        })
        
        await Promise.all(recipesPromise)
       
        return res.render('admin/recipes/home', {info, items: recipes});
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

        const itemsPromise = items.map(async item => {
            const files = await FileRecipe.files(item.id,'recipe_id');
            item.src = files[0].path.replace("public", "")
        })

        await Promise.all(itemsPromise)
              
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
            if (req.body[key] == ""&& key != "userId") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }

        if(req.files.length == 0) {
            return res.send("Por favor, envie ao menos uma imagem")
        }

        let {title, ingredients, preparation, information, chefs, userId} = req.body
        
        const filteredIngredients = ingredients.filter(function (ingredients) {
            return ingredients != ""
        })

        const filteredPreparation = preparation.filter(function (preparation) {
            return preparation != ""
        })

        ingredients = filteredIngredients
        preparation = filteredPreparation

        const recipeId = await Recipe.create({
            title,
            ingredients,
            preparation,
            information,
            created_at: date(Date.now()).iso,
            chef_id: chefs,
            user_id: userId
        });
  
        const filesPromise = req.files.map(file => File.create({name: file.filename, path: file.path}))
        const filesId = await Promise.all(filesPromise);
  
        const relationPromise = filesId.map(fileId => FileRecipe.create({
            recipe_id: recipeId,
            file_id: fileId
          }))

        await Promise.all(relationPromise)
        
        return res.redirect(`/recipes`)
        
    },

    async show(req, res) {
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
        
        if(!recipe) return res.send("recipe not found!")

        let files = await FileRecipe.files(recipe.id,'recipe_id')
        files = files.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`
        }))

        console.log(files)
       
        return res.render("admin/recipes/show", {item: recipe, files})
    },
    
    async edit(req, res) {
        //get recipes
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];
        if(!recipe) return res.send("recipe not found!")
        
        //get chefs
        const options = await Recipe.chefSelectOptions();
        const chefOptions = options.rows;

        //get images
        let files = await FileRecipe.files(recipe.id, 'recipe_id');
        
        files = files.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`
        }))
   
        return res.render("admin/recipes/edit", {item: recipe, chefOptions, files})
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
                File.create({name: file.filename, path: file.path}));
                const filesId = await Promise.all(newFilesPromise);
            
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
            console.log(removedFiles)
            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        let {title, ingredients, preparation, information, chefs, userId} = req.body
        
        const filteredIngredients = ingredients.filter(function (ingredients) {
            return ingredients != ""
        })

        const filteredPreparation = preparation.filter(function (preparation) {
            return preparation != ""
        })

        ingredients = filteredIngredients;
        preparation = filteredPreparation;
        
        await Recipe.update(req.body.id, {
            title,
            ingredients,
            preparation,
            information,
            created_at: date(Date.now()).iso,
            chef_id: chefs,
            user_id: userId
        })
        return res.redirect(`/recipes/${req.body.id}`)
    },
    
    async delete(req, res) {
        await Recipe.delete(req.body.id)
        return res.redirect("/recipes")
    }

};

