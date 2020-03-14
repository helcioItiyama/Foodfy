const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const chefs = require('../app/controllers/chefs');

routes.get("/chefs", chefs.index);
routes.get("/chefs/create", chefs.create);
routes.post("/chefs", multer.array('chefs-photos', 1), chefs.post);
routes.get("/chefs/:id", chefs.show);
routes.get("/chefs/:id/edit", chefs.edit);
routes.put("/chefs", multer.array('chefs-photos', 1), chefs.put);
routes.delete("/chefs", chefs.delete);

module.exports = routes