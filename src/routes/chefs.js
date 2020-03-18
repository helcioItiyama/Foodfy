const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const chefs = require('../app/controllers/chefs');
const {onlyUser} = require('../app/middlewares/session');

routes.get("/chefs", chefs.index);
routes.get("/chefs/create", onlyUser, chefs.create);
routes.post("/chefs", onlyUser, multer.array('chefs-photos', 1), chefs.post);
routes.get("/chefs/:id", chefs.show);
routes.get("/chefs/:id/edit", onlyUser, chefs.edit);
routes.put("/chefs", onlyUser, multer.array('chefs-photos', 1), chefs.put);
routes.delete("/chefs", onlyUser, chefs.delete);

module.exports = routes