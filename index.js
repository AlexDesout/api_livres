const express = require("express");
app = express();
const nano = require('nano')('http://miguel:salut@127.0.0.1:5984');
const dbLivres = nano.db.use('livres');
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const Joi = require('joi');

// Initialisation d'un modèle de livre
const livre = Joi.object({
    numero: Joi.number()
        .integer()
        .min(1)
        .required(),
        titre: Joi.string()
        .regex(/^[a-zA-Z0-9À-ÿ\s]+$/u)
        .min(1)
        .max(100)
        .required(),    
    pages: Joi.array()
        .items(Joi.string().min(1).max(100))
        .required(),
})

// Route initiale
app.get("/", (req, res) => {
    res.json({ message: "API de gestion des livres " });
});

// Liste des livres 
app.get("/livres", async (req, res) => {

    const query = {
        "selector": {},
        "fields": ["numero", "titre"],
        "sort": []
    };

    let livres = await dbLivres.find(query);

    res.status(200).json(livres.docs);
});

// Information sur un livre unique
app.get("/livres/:numlivre", async (req, res) => {
    const numLivre = parseInt(req.params.numlivre)

    let query = {
        "selector": { "numero": numLivre },
        "fields": ["titre"],
        "sort": []
    };

    let searchLivre = await dbLivres.find(query);

    searchLivre.docs.length !== 0
        ? res.status(200).json(searchLivre.docs)
        : res.status(404).json({ message: "Livre non trouvé" });

});

// Afficher les pages d'un livre
app.get("/livres/:numlivre/pages", async (req, res) => {
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

});

// Afficher une page particulière d'un livre
app.get("/livres/:numlivre/pages/:numPage", async (req, res) => {
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

});

// Ajout d'un livre
app.post("/livres", async (req, res) => {
    const body = req.body;

    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    } else {
        const { value, error } = livre.validate(body);

        if (error == undefined) {
            const responseI = await dbLivres.insert(body);
            responseI
                ? res.status(201).json({ message: "Livre ajouté" })
                : res.status(400).json({ message: "Livre non ajouté" });

        } else {
            res.status(400).json({ message: error.details });
        }
    }

});

// Supprimer un livre
app.delete("/livres/:numlivre", async (req, res) => {
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
});

// Modification d'un livre
app.put("/livres", async (req, res) => {
    const body = req.body;


    if (Object.keys(body).length === 0) {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    }
    else {
        const { value, error } = livre.validate(body);
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
            res.status(400).json({ message: error.details });
        }
    }

});

app.listen(8080, () => {
    console.log("Server Started");
});
