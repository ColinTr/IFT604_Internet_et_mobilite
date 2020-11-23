const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const service = require("../services/note.service");
const config = require("../utils/config");

exports.getNotes = async (req, res, next) => {
  service
    .getNotesFromDashboard(config.MONGODB_DASHBOARD_ID)
    .then((response) => {
      logger.info("DANS LE RESPONSE ", response);
      res.send(response).end();
    })
    .catch((error) => {
      logger.error(error);
    });
};

exports.createNote = async (req, res, next) => {};
