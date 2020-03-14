const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const recipes = require('../app/controllers/recipes');

routes.get("/recipes/home", recipes.home);
routes.get("/recipes/about", recipes.about);

routes.get("/recipes", recipes.index);
routes.get("/recipes/create", recipes.create);
routes.post("/recipes", multer.array('photos', 5), recipes.post);
routes.get("/recipes/:id", recipes.show);
routes.get("/recipes/:id/edit", recipes.edit);
routes.put("/recipes", multer.array('photos', 5), recipes.put);
routes.delete("/recipes", recipes.delete);

module.exports = routes