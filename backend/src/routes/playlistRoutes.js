const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getAllPlaylists);
router.get('/name/:name', playlistController.getPlaylistByName);
router.get('/:id', playlistController.getPlaylistById);
router.patch('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.get('/:id/songs', playlistController.getPlaylistSongs);

module.exports = router;
