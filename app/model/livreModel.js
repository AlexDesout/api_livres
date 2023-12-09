const nano = require('nano')('http://miguel:salut@127.0.0.1:5984');
const dbLivres = nano.db.use('livres');

const Joi = require('joi');

const livreSchema = Joi.object({
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
});

module.exports = {
    dbLivres,
    livreSchema,
};
