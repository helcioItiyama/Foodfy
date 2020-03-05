const Chef = require('../models/Chef');

module.exports = {
    async index(req, res) {
        let {filter, page, limit} = req.query;
        page = page || 1;
        limit = limit || 3;
        let offset = limit * (page -1);

        const params = {
            filter,
            page,
            limit,
            offset,
        }
        const results = await Chef.paginate(params);
        const items = results.rows;

        if(items[0] == undefined) {
            return res.render("admin/chefs/chefs")
        }
        const pagination = {
            total: Math.ceil(items[0].total / limit),
            page
        }
        return res.render("admin/chefs/chefs", {items, pagination, filter})
        
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    },

    async post(req, res) {
        const keys = Object.keys(req.body);
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        await Chef.create(req.body);
        return res.redirect(`/admin/chefs`)
    },

    async show(req, res) {
        const results = await Chef.find(req.params.id);
        const item = results.rows[0]

        if(!item) return res.send("chef not found!")
        
        const chefs = await Chef.RecipesOwned()
        const recipes = chefs.rows;
        return res.render("admin/chefs/show", {item, recipes})
    },
    
    async edit(req, res) {
        const results = await Chef.find(req.params.id);
        const item = results.rows[0];
        if(!item) return res.send("chef not found!")
        
        return res.render("admin/chefs/edit", {item})
    },
    
    async put(req, res) {
        const keys = Object.keys(req.body);
        for (let key of keys) {
            if(req.body[key] =="") {
                return res.send("Por favor preencha todos os campos")
            }
        }
        await Chef.update(req.body);
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    
    async delete(req, res) {
        const results = await Chef.checkDelete(req.body.id)
        const chef = results.rows;
        if(chef[0].total_recipes > 0) {
            return res.send("Somente chefs sem receitas podem ser deletados")
        }
        
        await Chef.delete(req.body.id)
        return res.redirect("/admin/chefs")     
    }
};