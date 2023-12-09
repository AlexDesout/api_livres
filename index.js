const livreRoutes = require('./app/router/livreRoutes');
const express = require("express");
app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Liste des routes :
app.use("/", livreRoutes);
app.use("/livres", livreRoutes);
app.use("/livres/:numLivre", livreRoutes);
app.use("/livres/:numLivre/pages", livreRoutes);
app.use("/livres/:numLivre/pages/:numPage", livreRoutes);


app.listen(8080, () => {
    console.log("Server Started");
});
