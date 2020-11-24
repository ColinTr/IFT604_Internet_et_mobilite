const userService = require("../services/user.service");
const dashboardService = require("../services/dashboard.service");
const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const config = require("../utils/config");

exports.getUsers = async (req, res) => {
  dashboardService
    .getDashboard(config.MONGODB_DASHBOARD_ID)
    .then((response) => {
      const usersList = response.users;
      let promises = [];

      usersList.forEach((userId, index) => {
        promises.push(userService.getUser(userId));
      });

      Promise.allSettled(promises).then((results) => {
        results.forEach((result) => {
          logger.info(result);
        });
      });
      //TODO send les users
      res.send().end();
    })
    .catch((error) => {
      logger.error(error);
      res
        .status(400)
        .send(new Erreur("Impossible de trouver la liste des Users"))
        .end();
    });
};
