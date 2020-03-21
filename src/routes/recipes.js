const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const recipes = require('../app/controllers/recipes');
const {onlyUsers, ownersAndAdmin} = require('../app/middlewares/session');

routes.get("/recipes/home", recipes.home);
routes.get("/recipes/about", recipes.about);

routes.get("/recipes", recipes.index);
routes.get("/recipes/create", onlyUsers, recipes.create);
routes.post("/recipes", multer.array('photos', 5), recipes.post);
routes.get("/recipes/:id", recipes.show);
routes.get("/recipes/:id/edit", ownersAndAdmin, recipes.edit);
routes.put("/recipes", ownersAndAdmin, multer.array('photos', 5), recipes.put);
routes.delete("/recipes", ownersAndAdmin, recipes.delete);

module.exports = routes;