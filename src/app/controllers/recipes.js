const {date} = require('../../lib/utils')
const DeleteFiles = require('../services/DeleteFiles');
const PageService = require('../services/PageService');

const Recipe = require('../models/Recipe');
const File = require('../models/File');
const FileRecipe = require('../models/FileRecipe');

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
            if(files[0]) {
                recipe.src = files[0].path.replace("public", "")
            } else {
                recipe.src = 'https://placehold.it/500x500?text=PRODUTO SEM FOTO'
            }
        })
        
        await Promise.all(recipesPromise)
       
        return res.render('admin/recipes/home', {info, items: recipes});
    },

    about(req, res) {
    return res.render('admin/recipes/about');
    },

    async index(req, res) {
        const params = await PageService.page(req.query);
        let {offset, filter, limit, page} = params;
        limit = 6;
        offset = limit * (page -1);
        const newParams = {offset, limit, filter, page};

        const results = await Recipe.paginate(newParams);
        const items = results.rows;

        const itemsPromise = items.map(async item => {
            const files = await FileRecipe.files(item.id,'recipe_id');
            if(files[0]) {
                item.src = files[0].path.replace("public", "")
            } else {
                item.src = 'https://placehold.it/500x500?text=PRODUTO SEM FOTO'
            }
        })

        await Promise.all(itemsPromise)
              
        if(items[0] == undefined) {
            return res.render("admin/recipes/recipes", {error: "Ops! Busca não encontrada"})
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
        let {title, ingredients, preparation, information, chefs, userId} = req.body
    
        const {checkedIngredients, checkedPreparation} = checkBlankFields(ingredients, preparation)

        const recipeId = await Recipe.create({
            title,
            ingredients: checkedIngredients,
            preparation: checkedPreparation,
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

        console.log(req.body)
        
        return res.render("message/success", {type: "Receita ", action: "criada"})
        
    },

    async show(req, res) {       
        const {recipe, files} = req.results;
        return res.render("admin/recipes/show", {item: recipe, files})
    },
    
    async edit(req, res) {
        const {recipe, files, chefOptions} = req.results;
        return res.render("admin/recipes/edit", {item: recipe, chefOptions, files})
    },
    
    async put(req, res) {
        let {title, ingredients, preparation, information, chefs, userId} = req.body
        
        const {checkedIngredients, checkedPreparation} = checkBlankFields(ingredients, preparation);
        
        await Recipe.update(req.body.id, {
            title,
            ingredients: checkedIngredients,
            preparation: checkedPreparation,
            information,
            created_at: date(Date.now()).iso,
            chef_id: chefs,
            user_id: userId
        })
        return res.render("message/success", {type: "Receita ", action: "editada"})
    },
    
    async delete(req, res) {
        const files = await FileRecipe.files(req.body.id, 'recipe_id')
        await Recipe.delete(req.body.id)
        
        DeleteFiles.deleteFiles(files);

        return res.render("message/success", {type: "Receita ", action: "deletada"})
    }
};

function checkBlankFields(ingredients, preparation) {
    const checkedIngredients = ingredients.filter(ingredients => ingredients != "");
    const checkedPreparation = preparation.filter(preparation => preparation != "");
    return {checkedIngredients, checkedPreparation}
}

