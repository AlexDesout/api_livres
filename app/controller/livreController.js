const { dbLivres, livreSchema } = require('../model/livreModel');

const home = async (req, res) => {
    res.status(200).json({ message: "Api de gestion de livres" })
}

// Afficher tous les livres
const getAllLivres = async (req, res, next) => {
    const query = {
        "selector": {},
        "fields": ["numero", "titre"],
        "sort": []
    };
    let livres = await dbLivres.find(query);

    res.status(200).json(livres.docs);
};

// Chercher un livre par son numero
const getLivreByNum = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)
    console.log(req.params.numlivre)
    let query = {
        "selector": { "numero": numLivre },
        "fields": ["titre"],
        "sort": []
    };

    let searchLivre = await dbLivres.find(query);

    searchLivre.docs.length !== 0
        ? res.status(200).json(searchLivre.docs)
        : res.status(404).json({ message: "Livre non trouvé" });
};

// Obtenir les pages d'un livre
const getLivrePages = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)

    let query = {
        "selector": { "numero": numLivre },
        "fields": ["pages"],
        "sort": []
    };

    let searchLivre = await dbLivres.find(query);

    searchLivre.docs.length !== 0
        ? res.status(200).json(searchLivre.docs)
        : res.status(404).json({ message: "Livre non trouvé" });
}

// Obtenir une page particulière d'un livre
const getLivreUniquePage = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)
    const numPage = parseInt(req.params.numPage)

    let query = {
        "selector": {
            "numero": numLivre,
            [`pages.${numPage}`]: { "$exists": true }
        },
        "fields": [`pages.${numPage}`],
        "limit": 1,
        "sort": []
    };
    let searchLivre = await dbLivres.find(query);

    searchLivre.docs.length !== 0
        ? res.status(200).json(searchLivre.docs)
        : res.status(404).json({ message: "Page non trouvée" });
}

// Ajouter un livre
const addLivre = async (req, res) => {
    const body = req.body;
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    } else {
        const { value, error } = livreSchema.validate(body);

        if (error == undefined) {
            const responseI = await dbLivres.insert(body);
            responseI
                ? res.status(201).json({ message: "Livre ajouté" })
                : res.status(400).json({ message: "Livre non ajouté" });

        } else {
            res.status(400).json({ message: error.details[0] });
        }
    }
}

// Supprimer un livre
const deleteLivre = async (req, res) => {
    const numlivre = parseInt(req.params.numlivre)

    const query = {
        "selector": { "numero": numlivre },
        "fields": ["_id", "_rev"],
        "sort": []
    }

    const selectedLivre = await dbLivres.find(query);

    if (selectedLivre.docs.length === 0) {
        res.status(400).json({ message: "Livre non trouvé" })
    } else {

        const id = selectedLivre.docs[0]._id
        const rev = selectedLivre.docs[0]._rev
        const removeLivre = await dbLivres.destroy(id, rev);
        removeLivre
            ? res.status(200).json({ message: `Suppression du livre ${numlivre}` })
            : res.status(400).json({ message: "Erreur lors de la suppression" })
    }
}

// Modifier un livre
const modifyLivre = async (req, res) => {
    const body = req.body;

    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    }
    else {
        const { value, error } = livreSchema.validate(body);
        if (error == undefined) {

            const query = {
                "selector": { "numero": body.numero },
                "fields": ["_id", "_rev"],
                "sort": []
            }
            const selectedLivre = await dbLivres.find(query);
            const id = selectedLivre.docs[0]._id
            const rev = selectedLivre.docs[0]._rev
            const newData = {
                ...body,
                _id: id,
                _rev: rev
            }
            let modifLivre = await dbLivres.insert(newData);
            modifLivre
                ? res.status(200).json({ message: "Livre modifié" })
                : res.status(400).json({ message: "Erreur lors de la modification" })

        } else {
            res.status(400).json({ message: error.details[0] });
        }
    }
}

module.exports = {
    home,
    getAllLivres,
    getLivreByNum,
    getLivrePages,
    getLivreUniquePage,
    addLivre,
    deleteLivre,
    modifyLivre
};
