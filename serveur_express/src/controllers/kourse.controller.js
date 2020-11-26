const service = require("../services/kourse.service");
const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const config = require("../utils/config");

exports.getKourses = async (req, res) => {
    service
        .getKoursesFromDashboard(config.MONGODB_DASHBOARD_ID)
        .then((response) => {
            return res.status(200).send(response).end();
        })
        .catch((err) => {
            logger.error(err);
            return res
                .status(400)
                .send(new Erreur("Impossible de trouver les listes de Kourse"))
                .end();
        });
};

exports.getKoursesById = async (req, res) => {
    if (req.params["id_kourse"] === undefined) {
        return res.status(400).send(new Erreur("L'id_kourse est manquant"));
    } else {
        service
            .getKourse(req.params["id_kourse"])
            .then((response) => {
                return res.status(200).send(response).end();
            })
            .catch((error) => {
                logger.error(error);
                return res
                    .status(400)
                    .send(new Erreur("Impossible de trouver la liste de Kourse"))
                    .end();
            });
    }
};

exports.createKourses = async (req, res) => {
    const body = req.body;

    if (
        body._dashboard === undefined ||
        body.title === undefined ||
        body.elements === undefined
    ) {
        logger.error(
            "Contenu manquant dans le body de la requête d'ajout de kourse."
        );
        return res
            .status(400)
            .send(
                new Erreur(
                    "Contenu manquant dans le body de la requête d'ajout de kourse."
                )
            );
    } else {
        service
            .addKourse(body._dashboard, body.title, body.elements)
            .then((message) => {
                return res.status(200).end();
            })
            .catch((err) => {
                logger.info(err);
                return res
                    .status(400)
                    .send(new Erreur("Impossible d'ajouter une liste de kourse"))
                    .end();
            });
    }
};

exports.deleteKourses = async (req, res) => {
    if (req.params["id_kourse"] === undefined) {
        return res.status(400).send(new Erreur("L'id_kourse est manquant"));
    } else {
        service
            .removeKourse(req.params["id_kourse"])
            .then((response) => {
                return res.status(204).send(response).end();
            })
            .catch((error) => {
                logger.error(error);
                return res
                    .status(400)
                    .send(new Erreur("Impossible de supprimer la liste de Kourse"))
                    .end();
            });
    }
};

exports.updateKourses = async (req, res) => {
    if (req.params["id_kourse"] === undefined) {
        return res.status(400).send(new Erreur("L'id_kourse est manquant"));
    } else {
        service
            .updateKourse(req.params["id_kourse"], req.body)
            .then((response) => {
                return res.status(200).send(response).end();
            })
            .catch((error) => {
                logger.error(error);
                return res
                    .status(400)
                    .send(new Erreur("Impossible de modifier la liste de Kourse"))
                    .end();
            });
    }
};
