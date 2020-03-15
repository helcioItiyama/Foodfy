const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const recipes = require('../app/controllers/recipes');
const {onlyAdmin} = require('../app/middlewares/session');

routes.get("/recipes/home", recipes.home);
routes.get("/recipes/about", recipes.about);

routes.get("/recipes", recipes.index);
routes.get("/recipes/create", onlyAdmin, recipes.create);
routes.post("/recipes", onlyAdmin, multer.array('photos', 5), recipes.post);
routes.get("/recipes/:id", recipes.show);
routes.get("/recipes/:id/edit", onlyAdmin, recipes.edit);
routes.put("/recipes", onlyAdmin, multer.array('photos', 5), recipes.put);
routes.delete("/recipes", onlyAdmin, recipes.delete);

module.exports = routes