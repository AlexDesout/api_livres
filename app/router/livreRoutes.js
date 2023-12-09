
const express = require('express');
const router = express.Router();
const livreController = require("../controller/livreController");

router.get("/", livreController.home); // Route pour l'accueil
router.get("/livres", livreController.getAllLivres); // Route pour la liste des livres
router.post("/livres", livreController.addLivre); // Route pour ajouter un livre
router.put("/livres", livreController.modifyLivre); // Route pour modifier un livre
router.get("/:numlivre", livreController.getLivreByNum); // Route pour un livre particulier
router.delete("/:numlivre", livreController.deleteLivre); // Route pour un livre particulier
router.get("/:numlivre/pages", livreController.getLivrePages); // Route pour les pages d'un livres
router.get("/:numlivre/pages/:numPage", livreController.getLivreUniquePage); // Route pour une page d'un livres


module.exports = router;
