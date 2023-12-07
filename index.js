const express = require("express");
app = express();
const nano = require('nano')('http://miguel:salut@127.0.0.1:5984');
const dbLivres = nano.db.use('livres');
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const Joi = require('joi').extend(require('@joi/date'));


// const sportif = Joi.object({
//   numlicence: Joi.number()
//     .integer()
//     .min(1)
//     .required(),
//   nom: Joi.string()
//     .alphanum()
//     .min(3)
//     .max(30)
//     .required(),
//   prenom: Joi.string()
//     .alphanum()
//     .min(3)
//     .max(30)
//     .required(),
//   sport: {
//     codes: Joi.number()
//       .integer()
//       .min(1)
//       .required(),
//     libelle: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(30)
//       .required(),
//   },
//   datenaiss: Joi.date().format('DD/MM/YYYY'),
//   pays: Joi.string()
//     .alphanum()
//     .required()


// })

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
    console.log(query)

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

    if (Object.keys(body).length !== 0) {
        // const { value, error } = sportif.validate(body);
        // if (error == undefined) {
        //   console.log(error)
        //   const responseI = await dbSportifs.insert(body)
        //   res.status(200).json(responseI)
        // } else {
        //   console.log(error)
        //   res.status(400).json({ message: error })
        // }
        const responseI = await dbLivres.insert(body)
        res.status(200).json(responseI)

    }
    else {
        res.status(400).json({ message: "Veuillez saisir des informations" });
    }

});

// app.put("/sportifs/:id", async (req, res) => {
//   const body = req.body;
//   const id = req.params.id
//   // console.log(id)
//   if (Object.keys(body).length !== 0) {
//     const { value, error } = sportif.validate(body);
//     if (error == undefined) {
//       const query = {
//         "selector": { "_id": id },
//         "fields": ["_rev"],
//         "sort": ["nom", "prenom"]
//       }

//       let selectedSportif = await dbSportifs.find(query);
//       const rev = selectedSportif.docs[0]._rev
//       const newData = {
//         "nom": body.nom,
//         "prenom": body.prenom,
//         "sport": {
//           "libelle": body.libelle
//         },
//         "datenaiss": body.datenaiss,
//         "_id": body._id,
//         "_rev": rev
//       }
//       // const responseI = await dbSportifs.insert(body)
//       let newSportif = await dbSportifs.insert(newData);
//       res.status(200).json(newSportif)
//     } else {
//       res.status(400).json(error)
//     }
//   }
//   else {
//     res.status(400).json({ message: "Veuillez saisir des informations" });
//   }

//   // res.json(selectedSportif)
// });

// app.delete("/sportifs/:id", async (req, res) => {
//   const id = req.params.id

//   const query = {
//     "selector": { "_id": id },
//     "fields": ["_rev"],
//     "sort": ["nom", "prenom"]
//   }

//   let selectedSportif = await dbSportifs.find(query);
//   const rev = selectedSportif.docs[0]._rev


//   let removeSportif = await dbSportifs.destroy(id, rev);

//   res.status(200).json(removeSportif)
// });

app.listen(8080, () => {
    console.log("Server Started");
});
