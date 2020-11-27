const userService = require("../services/user.service");
const dashboardService = require("../services/dashboard.service");
const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const config = require("../utils/config");

exports.getUsers = async (req, res) => {
  dashboardService
    .getDashboard(config.MONGODB_DASHBOARD_ID)
    .then((response) => {
      const listUsersId = response.users;
      let promises = [];

      listUsersId.forEach((userId, index) => {
        promises.push(userService.getUser(userId));
      });

      let listUsers = [];
      Promise.allSettled(promises).then((results) => {
        results.forEach((result) => {
          if (result.value != null) {
            const userObject = {
              _id: result.value._id,
              username: result.value.username,
            };
            listUsers.push(userObject);
          }
        });
        res.send(listUsers).end();
      });
    })
    .catch((error) => {
      logger.error(error);
      res
        .status(400)
        .send(new Erreur("Impossible de trouver la liste des Users"))
        .end();
    });
};

exports.getUser = async (req, res) => {
  const user = await userService.getUser(req.params.id);

  if (user === undefined || user === null) {
    return res.status(400).send(new Erreur("Impossible de trouver l'utilisateur"));
  }

  const response = {
    id: user._id,
    name: user.username,
    mail: user.mail,
  };

  return res.send(response);
};
