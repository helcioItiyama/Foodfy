const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');

routes.get("/", (req, res) =>{
    res.redirect("admin/recipes/home")
})

routes.get("/admin/recipes/home", recipes.home);
routes.get("/admin/recipes/about", recipes.about);

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.post("/admin/recipes", multer.array('photos', 5), recipes.post);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.put("/admin/recipes", multer.array('photos', 5), recipes.put);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.post("/admin/chefs", chefs.post);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);
routes.put("/admin/chefs", chefs.put);
routes.delete("/admin/chefs", chefs.delete);


module.exports = routes

