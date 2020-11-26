const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotify.controller');

/* GET un token */
router.get('/', spotifyController.getToken);

/* GET featured playlists */
router.get('/featuredPlaylists/:country_code', spotifyController.getFeaturedPlaylists);

module.exports = router;