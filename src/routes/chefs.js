const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const chefs = require('../app/controllers/chefs');
const {onlyAdmin} = require('../app/middlewares/session');
const ChefValidator = require('../app/validator/chef');

routes.get("/chefs", chefs.index);
routes.get("/chefs/create", onlyAdmin, chefs.create);
routes.post("/chefs", onlyAdmin, multer.array('chefs-photos', 1), ChefValidator.post, chefs.post);
routes.get("/chefs/:id", chefs.show);
routes.get("/chefs/:id/edit", onlyAdmin, chefs.edit);
routes.put("/chefs", onlyAdmin, multer.array('chefs-photos', 1), ChefValidator.put, chefs.put);
routes.delete("/chefs", onlyAdmin, chefs.delete);

module.exports = routes