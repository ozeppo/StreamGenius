const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const { upload } = require('../utils/fileUpload');

router.post('/upload', upload.single('file'), musicController.uploadMusic);
router.patch('/:id', musicController.updateMetadata);
router.get('/', musicController.getAllMusic);
router.get('/:id', musicController.getMusicById);
router.get('/stream/:id', musicController.streamMusic);

module.exports = router;
