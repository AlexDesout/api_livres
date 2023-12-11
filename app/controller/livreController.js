
// Import des méthodes couchDb
const { find, insert, destroy } = require('../model/livreModel');
const Joi = require('joi');

// Schéma d'un livre
const livreSchema = Joi.object({
    numero: Joi.number()
        .integer()
        .min(1)
        .required(),
    titre: Joi.string()
        .min(1)
        .max(100)
        .required(),
    pages: Joi.array()
        .items(Joi.string().min(1).max(100))
        .required(),
});

const home = async (req, res) => {
    res.status(200).json({ message: "Api de gestion de livres" })
}

// Afficher tous les livres
const getAllLivres = async (req, res, next) => {

    let livres = await find("allLivres")
    // console.log(livres);

    res.status(200).json(livres);
};

// Chercher un livre par son numero
const getLivreByNum = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)

    let searchLivre = await find("getLivreByNum", numLivre);
    searchLivre[0]
        ? res.status(200).json(searchLivre)
        : res.status(404).json({ message: "Livre non trouvé" });
};

// Obtenir les pages d'un livre
const getLivrePages = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)

    const searchLivre = await find("getLivreByNum", numLivre);

    if (searchLivre[0]) {
        const searchPage = await find("getLivrePages", numLivre);
        // console.log(searchPage);

        const response = searchPage.pages[0]
            ? { status: 200, data: searchPage }
            : { status: 404, message: "Page non trouvée" };

        res.status(response.status).json(response.data || { message: response.message });
    } else {
        res.status(404).json({ message: "Livre non trouvé" });
    }




}

// Obtenir une page particulière d'un livre
const getLivreUniquePage = async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)
    const numPage = parseInt(req.params.numPage)

    const searchLivre = await find("getLivreByNum", numLivre);
    if (searchLivre[0]) {
        let searchPage = await find("getLivreUniquePage", numLivre, numPage);
        const response = searchPage?.pages
            ? { status: 200, data: searchPage }
            : { status: 404, message: "Page non trouvée" };
        res.status(response.status).json(response.data || { message: response.message });
    } else {
        res.status(404).json({ message: "Livre non trouvé" });
    }
}

// Ajouter un livre
const addLivre = async (req, res) => {
    const body = req.body;
    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    } else {
        const { value, error } = livreSchema.validate(body);

        if (error == undefined) {
            const responseI = insert(body);
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
    const removeLivre = await destroy(numlivre);

    removeLivre
        ? res.status(200).json({ message: `Suppression du livre ${numlivre}` })
        : res.status(400).json({ message: "Erreur lors de la suppression" })
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
            let modifLivre = await insert(body, body.numero);
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
