const DeleteFiles = require('../services/DeleteFiles');

const Recipe = require('../models/Recipe');
const FileRecipe = require('../models/FileRecipe');
const File = require('../models/File');

async function findRecipe(id) {
    let results = await Recipe.find(id);
    const recipe = results.rows[0];
    if(!recipe) return res.send("recipe not found!")
    return recipe
}

async function getImage(id) {
    let files = await FileRecipe.files(id, 'recipe_id');
        files = files.map(file => ({
            ...file,
            src: `${file.path.replace("public", "")}`
        }))
    return files
}

module.exports = {
    async show(req, res, next) {
        recipe = await findRecipe(req.params.id);
        files = await getImage(recipe.id);
        req.results = {recipe, files};
        next()
    },

    async edit(req, res, next) {
        await findRecipe(req.params.id);
        const recipe = await findRecipe(req.params.id);
        
        //get chefs
        const options = await Recipe.chefSelectOptions();
        const chefOptions = options.rows;

        const files = await getImage(recipe.id);
        req.results = {files, recipe, chefOptions};

       await getImage();

       next()
    },

    async put(req, res, next) {
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
            DeleteFiles.removeUpdatedFiles(req.body)
        }

        next()
    }
}