const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer');
const {onlyUsers, ownersAndAdmin} = require('../app/middlewares/session');

const FieldsValidator = require('../app/validator/fields');
const RecipeValidator = require('../app/validator/recipe');

const recipes = require('../app/controllers/recipes');

routes.get("/recipes/home", recipes.home);
routes.get("/recipes/about", recipes.about);

routes.get("/recipes", recipes.index);
routes.get("/recipes/create", onlyUsers, recipes.create);
routes.post("/recipes", multer.array('photos', 5), FieldsValidator.post, recipes.post);
routes.get("/recipes/:id", RecipeValidator.show, recipes.show);
routes.get("/recipes/:id/edit", ownersAndAdmin, RecipeValidator.edit, recipes.edit);
routes.put("/recipes", multer.array('photos', 5), ownersAndAdmin, FieldsValidator.put, RecipeValidator.put, recipes.put);
routes.delete("/recipes", ownersAndAdmin, recipes.delete);

module.exports = routes;