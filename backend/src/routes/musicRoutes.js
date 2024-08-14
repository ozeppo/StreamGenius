const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const { upload } = require('../utils/fileUpload');
const lyricsController = require('../controllers/lyricsController');

// Upload files
router.post('/upload', upload.single('file'), musicController.uploadMusic);

// Update info
router.patch('/:id', musicController.updateMetadata);

router.get('/search', musicController.searchMusic);

// Lyrics Routes
router.get('/lyrics', lyricsController.getLyrics);
router.patch('/lyrics', lyricsController.updateLyrics);
router.get('/lyrics/similar', lyricsController.getSimilarLyrics);

// Get infos for musics, artists and albums
router.get('/', musicController.getAllMusic);
router.get('/artist/:artistName', musicController.getMusicByArtist);
router.get('/artist/:artistName/:albumName', musicController.getMusicByAlbum);
router.get('/:id', musicController.getMusicById);

// Streaming route for musics
router.get('/stream/:id', musicController.streamMusic);

module.exports = router;
