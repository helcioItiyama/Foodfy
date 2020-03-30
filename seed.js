const {hash} = require('bcryptjs');
const faker = require('faker');

const User = require('./src/app/models/User');
const File = require('./src/app/models/File');
const Chef = require('./src/app/models/Chef');
const Recipe = require('./src/app/models/Recipe');
const FileRecipe = require('./src/app/models/FileRecipe');

let usersIds = [],
    chefsIds = [],
    recipesIds = [],
    recipesImgIds = [],
    totalUsers = 20,
    totalChefs = 20,
    totalRecipes = 20;


async function createUsers() {
    const users = [];
    const password = await hash('1111', 8);

    while(users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: true
        })
    }
    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
    let files = [];
    
    while(files.length < totalChefs) {
        files.push({
            name: faker.image.image(),
            path: `public/images/chef.png`,
        })
    }
    const filesPromise = files.map(file => File.create(file));
    filesIds = await Promise.all(filesPromise);
    
    let chefs = [];

    while(chefs.length < totalChefs) {
        chefs.push({
            name: faker.name.firstName(),
            file_id: filesIds[Math.floor(Math.random() * totalChefs)]
        })
    }
    const chefsPromise = chefs.map(chef => Chef.create(chef));
    chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes() {
    let recipes = [];

    while(recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            title: faker.lorem.word(),
            ingredients: [faker.lorem.sentence()],
            preparation: [faker.lorem.words()],
            information: faker.lorem.sentence(),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)]
        })
    }
    const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
    recipesIds = await Promise.all(recipesPromise);
    
    let recipesImg = [];
    
    while(recipesImg.length < totalRecipes) {
        recipesImg.push({
            name: faker.image.image(),
            path: `public/images/pizza2.jpg`,
        })
    }
    const recipesImgPromise = recipesImg.map(img=> File.create(img));
    recipesImgIds = await Promise.all(recipesImgPromise);
}

async function createRecipeFiles() {
    let recipeFiles = [];
    let n = 0;

    while(recipeFiles.length < totalRecipes) {
        recipeFiles.push({
            recipe_id: recipesIds[n],
            file_id: recipesImgIds[n]
        })
        n += 1;
    }
   
    const recipeFilesPromise = recipeFiles.map(recipeFile => FileRecipe.create(recipeFile));
    await Promise.all(recipeFilesPromise)
}

async function init() {
    await createUsers();
    await createChefs();
    await createRecipes();
    await createRecipeFiles();
}

init()
