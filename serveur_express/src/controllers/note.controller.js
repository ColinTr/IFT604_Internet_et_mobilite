const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const service = require("../services/note.service");
const config = require("../utils/config");

exports.getNotes = async (req, res, next) => {
    service.getNotesFromDashboard(config.MONGODB_DASHBOARD_ID)
        .then((response) => {
            res.status(200).send(response).end();
        })
        .catch((error) => {
            res.status(400).send(new Erreur("Impossible de récupérer les notes")).end();
            logger.error(error);
        });
};

exports.getNote = async (req, res, next) => {
    if (req.params['id_note'] === undefined) {
        res.status(400).send(new Erreur("Paramètre id_note manquant"))
    } else {
        service.getNote(req.params['id_note'])
            .then(response => {
                res.status(200).send(response).end();
            })
            .catch(error => {
                res.status(400).send(new Erreur("Impossible de récupérer la note")).end();
                logger.error(error);
            });
    }
};

exports.updateNote = async (req, res, next) => {
    const body = req.body;
    if (body.note === undefined) {
        res.status(400).send(new Erreur("Objet note manquant"))
    } else {
        service.updateNote(body.note._id, body.note)
            .then(response => {
                res.status(200).send(response).end();
            })
            .catch(error => {
                res.status(400).send(new Erreur("Impossible de modifier la note")).end();
                logger.error(error);
            });
    }
};

exports.createNote = async (req, res, next) => {
    const note = req.body.note;
    if (note === undefined) {
        res.status(400).send(new Erreur("Objet note manquant"))
    } else {
        service.addNote(note._dashboard, note.title, note.content, note.author, note.users)
            .then(response => {
                res.status(200).send(response).end();
            })
            .catch(error => {
                res.status(400).send(new Erreur("Impossible de créer la note")).end();
                logger.error(error);
            });
    }
};

exports.deleteNote = async (req, res, next) => {
    if (req.params['id_note'] === undefined) {
        res.status(400).send(new Erreur("Paramètre id_note manquant"))
    } else {
        service.deleteNote(req.params['id_note'])
            .then(response => {
                res.status(200).send(response).end();
            })
            .catch(error => {
                res.status(400).send(new Erreur("Impossible de supprimer la note")).end();
                logger.error(error);
            });
    }
};