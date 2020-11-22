const express = require('express');
const router = express.Router();

const courseController = require('../controllers/kourse.controller')

/* GET toute les courses */
router.get('/', courseController.getCourses);

module.exports = router;