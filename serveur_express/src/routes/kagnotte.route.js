const express = require('express');
const router = express.Router();
const kagnotteController = require('../controllers/kagnotte.controller');

/* GET tous les soldes du dashboard */
router.get('/soldes', kagnotteController.getSoldes);

/* GET toutes les transactions du dashboard */
router.get('/transactions', kagnotteController.getTransactions);

/* POST Ajoute une transaction */
router.post('/', kagnotteController.createTransaction);

/* DELETE Supprime une transaction */
router.delete('/', kagnotteController.deleteTransaction);

module.exports = router;