const express = require('express');
const routes = express.Router();

const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');

routes.use('/admin', users);
routes.use('/', recipes);
routes.use('/', chefs);

//Alias
routes.get("/", (req, res) =>{
    res.redirect("recipes/home")
})

routes.get("/accounts", (req, res) => {
    res.redirect("/admin/login")
})

module.exports = routes

