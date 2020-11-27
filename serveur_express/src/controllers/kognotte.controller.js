const transactionService = require("../services/transaction.service");
const soldeService = require("../services/solde.service");

const logger = require("../utils/logger");
const Erreur = require("../utils/erreur");
const config = require("../utils/config");

exports.getSoldes = async (req, res) => {
    soldeService.getSoldesFromDashboard(config.MONGODB_DASHBOARD_ID)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            logger.error(err);
            res.status(400).send(new Erreur("Impossible de trouver la liste de solde"));
        });
};

exports.getTransactions = async (req, res) => {
    transactionService.getTransactionsFromDashboard(config.MONGODB_DASHBOARD_ID)
        .then((response) => {
            res.send(response);
        })
        .catch((err) => {
            logger.error(err);
            res.status(400).send(new Erreur("Impossible de trouver la liste de transaction"));
        });
};

exports.createTransaction = async (req, res) => {
    if (
        req.body.from === undefined ||
        req.body.to === undefined ||
        req.body.montant === undefined ||
        req.body.object === undefined ||
        req.body.date === undefined) {
        logger.error("Contenu manquant dans le body de la requête d'ajout de transaction.");
        return res.status(400).send(new Erreur("Contenu manquant dans le body de la requête d'ajout de transaction."));
    } else {
        try {
            const transaction = await transactionService.addTransaction(
                config.MONGODB_DASHBOARD_ID,
                req.body.from,
                req.body.to,
                req.body.montant,
                req.body.object,
                new Date(req.body.date)
            );

            if (transaction === undefined) {
                return res.status(502).send(new Erreur("Le serveur n'a pas réussi à créer la transaction"));
            }

            // We update the solde from the user 'from'
            const change = req.body.montant;
            const resFrom = await soldeService.updateSoldeFromDashboardAndUser(
                config.MONGODB_DASHBOARD_ID,
                req.body.from,
                {$inc: {value: change}}
            );
            // We await here in case we change again the value in the users 'to'

            // We update all the sold from the users 'to'
            const mapPromiseSoldeUpdate = req.body.to.map((element) => {
                const change = -(req.body.montant / req.body.to.length);
                return soldeService.updateSoldeFromDashboardAndUser(
                    config.MONGODB_DASHBOARD_ID,
                    element,
                    {$inc: {value: change}}
                );
            });

            // We wait for all the promises
            const resTo = await Promise.all(mapPromiseSoldeUpdate);
            if (resFrom === undefined || resTo.includes(undefined)) {
                return res.status(502).send(new Erreur("Something went wrong during the process of your request"));
            }

            return res.send();
        } catch (error) {
            log.error(error);
            return res.status(502).send(new Erreur("Something went wrong during the process of your request"));
        }
    }
};

exports.deleteTransaction = async (req, res) => {
    if (req.params.id === undefined) {
        logger.error(
            "Contenu manquant dans le body de la requête de suppression de transaction."
        );
        return res.status(400).send(new Erreur("Contenu manquant dans le body de la requête de suppression de transaction."));
    } else {
        try {
            const transaction = await transactionService.getTransaction(req.params.id);
            const trIsDeleted = await transactionService.removeTransaction(req.params.id);

            if (trIsDeleted === undefined) {
                return res.status(502).send(new Erreur("Le serveur n'a pas réussi à supprimer la transaction"));
            }

            // We update the solde from the user 'from'
            const change = -transaction.montant;
            const resFrom = await soldeService.updateSoldeFromDashboardAndUser(
                config.MONGODB_DASHBOARD_ID,
                transaction.from,
                {$inc: {value: change}}
            );
            // We await here in case we change again the value in the users 'to'

            // We update all the sold from the users 'to'
            const mapPromiseSoldeUpdate = transaction.to.map((element) => {
                const change = transaction.montant / transaction.to.length;
                return soldeService.updateSoldeFromDashboardAndUser(
                    config.MONGODB_DASHBOARD_ID,
                    element,
                    {$inc: {value: change}}
                );
            });

            // We wait for all the promises
            const resTo = await Promise.all(mapPromiseSoldeUpdate);
            if (resFrom === undefined || resTo.includes(undefined)) {
                return res.status(502).send(new Erreur("Something went wrong during the process of your request"));
            }

            return res.send();
        } catch (error) {
            logger.error(error);
            return res.status(502).send(new Erreur("Something went wrong during the process of your request"));
        }
    }
};