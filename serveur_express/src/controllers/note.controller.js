const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const service = require("../services/note.service");
const config = require("../utils/config");

exports.getNotes = async (req, res, next) => {
    service.getNotesFromDashboard(config.MONGODB_DASHBOARD_ID)
        .then((response) => {
            return res.status(200).send(response).end();
        })
        .catch((error) => {
            logger.error(error);
            return res.status(400).send(new Erreur("Impossible de récupérer les notes")).end();
        });
};

exports.getNote = async (req, res, next) => {
    if (req.params['id_note'] === undefined) {
        res.status(400).send(new Erreur("Paramètre id_note manquant"))
    } else {
        service.getNote(req.params['id_note'])
            .then(response => {
                return res.status(200).send(response).end();
            })
            .catch(error => {
                logger.error(error);
                return res.status(400).send(new Erreur("Impossible de récupérer la note")).end();
            });
    }
};

exports.updateNote = async (req, res, next) => {
    const body = req.body;
    if (body.note === undefined) {
        res.status(400).send(new Erreur("Objet note manquant"))
    } else {
        service.updateNote(req.params["id_note"], body.note)
            .then(response => {
                return res.status(200).send(response).end();
            })
            .catch(error => {
                logger.error(error);
                return res.status(400).send(new Erreur("Impossible de modifier la note")).end();
            });
    }
};

exports.createNote = async (req, res, next) => {
    const params = req.body;
    if (params._dashboard === undefined || params.title === undefined || params.content === undefined || params.author === undefined || params.users === undefined) {
        res.status(400).send(new Erreur("Attributs manquants"))
    } else {
        service.addNote(params._dashboard, params.title, params.content, params.author, params.users)
            .then(response => {
                return res.status(200).send(response).end();
            })
            .catch(error => {
                logger.error(error);
                return res.status(400).send(new Erreur("Impossible de créer la note")).end();
            });
    }
};

exports.deleteNote = async (req, res, next) => {
    if (req.params['id_note'] === undefined) {
        res.status(400).send(new Erreur("Paramètre id_note manquant"))
    } else {
        service.deleteNote(req.params['id_note'])
            .then(response => {
                return res.status(204).send(response).end();
            })
            .catch(error => {
                logger.error(error);
                return res.status(400).send(new Erreur("Impossible de supprimer la note")).end();
            });
    }
};