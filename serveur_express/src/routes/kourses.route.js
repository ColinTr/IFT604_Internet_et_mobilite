const express = require("express");
const router = express.Router();
const kourseController = require("../controllers/kourse.controller");

/* GET toute les kourses */
router.get("/", kourseController.getKourses);

/* GET kourses par id */
router.get("/:id_kourse", kourseController.getKoursesById);

/*POST ajout d'une nouvelle liste de kourse */
router.post("/", kourseController.createKourses);

/* DELETE une liste de kourse*/
router.delete("/:id_kourse", kourseController.deleteKourses);

/*PUT modification kourse */
router.put("/:id_kourse", kourseController.updateKourses);

module.exports = router;
