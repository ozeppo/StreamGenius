const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/albums', homeController.getRandomAlbums);
router.get('/playlists', homeController.getRandomPlaylists);
router.get('/artists', homeController.getRandomArtists);

module.exports = router;
