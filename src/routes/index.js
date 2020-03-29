const express = require('express');
const routes = express.Router();

const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');

routes.use('/', recipes);
routes.use('/', chefs);
routes.use('/', users)

//Alias
routes.get("/", (req, res) =>{
    res.redirect("recipes/home")
})

routes.get("/accounts", (req, res) =>{
    res.redirect("/login")
})

module.exports = routes

