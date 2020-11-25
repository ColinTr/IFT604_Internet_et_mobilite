const express = require("express");
const router = express.Router();
const kognotteController = require("../controllers/kognotte.controller");

/* GET tous les soldes du dashboard */
router.get("/soldes", kognotteController.getSoldes);

/* GET toutes les transactions du dashboard */
router.get("/transactions", kognotteController.getTransactions);

/* POST Ajoute une transaction */
router.post("/", kognotteController.createTransaction);

/* DELETE Supprime une transaction */
router.delete("/:id", kognotteController.deleteTransaction);

module.exports = router;
