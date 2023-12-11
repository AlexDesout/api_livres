const livreRoutes = require('./app/router/livreRoutes');
const express = require("express");
app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Utilisation des routes
app.use(livreRoutes);


app.listen(8080, () => {
    console.log("Server Started");
});
