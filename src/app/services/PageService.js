module.exports = {
    async page(query) {
        let {filter, page, limit} = query;
        page = page || 1;
        limit = limit || 8;
        let offset = limit * (page -1);

        const params = {
            filter,
            page,
            limit,
            offset
        } 

        return params
        
    }
}


