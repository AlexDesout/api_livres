const nano = require('nano')('http://miguel:salut@127.0.0.1:5984');
const dbLivres = nano.db.use('livres');


// Fonctions associées à coucheDb : 

// Rechercher
const find = async (request, numLivre, numPage) => {
    let query = {
        "selector": {},
        "fields": ["numero", "titre"],
        "sort": []
    };
    switch (request) {
        case "allLivres":
            query = {
                "selector": {},
                "fields": ["numero", "titre"],
                "sort": []
            };
            break
        case "getLivreByNum":
            query = {
                "selector": { "numero": numLivre },
                "fields": ["titre"],
                "sort": []
            };
            break
        case "getLivrePages":
            query = {
                "selector": { "numero": numLivre },
                "fields": ["pages"],
                "sort": []
            };
            break
        case "getLivreUniquePage":
            query = {
                "selector": {
                    "numero": numLivre,
                    [`pages.${numPage}`]: { "$exists": true }
                },
                "fields": [`pages.${numPage}`],
                "limit": 1,
                "sort": []
            };
            break
        case "getId":
            query = {
                "selector": { "numero": numLivre },
                "fields": ["_id", "_rev"],
                "sort": []
            }
            break
        default:
            return null
    }

    return (await dbLivres.find(query)).docs
}

// Insérer des données
const insert = async (body, numLivre) => {
    // Pour modifier
    if (numLivre) {
        const selectedLivre = await find("getId", numLivre);
        console.log(selectedLivre);

        const result = selectedLivre[0]
            ? { ...body, _id: selectedLivre[0]._id, _rev: selectedLivre[0]._rev }
            : false;

        console.log(result);

        return result ? await dbLivres.insert(result) : false;
    } else { // Pour ajouter
        return await dbLivres.insert(body);
    }
};


// Supprimer des données
const destroy = async (numlivre) => {
    let findLivre = await find("getId", numlivre)
    let result
    findLivre[0]
        ? result = await dbLivres.destroy(findLivre[0]._id, findLivre[0]._rev)
        : result = false
    return result
}


module.exports = {
    find,
    insert,
    destroy
};
