const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Konfiguracja multer do przechowywania przesyłanych plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type, artistName, albumName, playlistId } = req.body;

    console.log('Received parameters:', req.body); // Dodanie logowania
    console.log('Received file info:', file); // Dodanie logowania informacji o pliku

    let uploadPath;
    if (type === 'artist' && artistName) {
      uploadPath = path.join(__dirname, '..', '..', 'uploads', 'artists', artistName);
    } else if (type === 'album' && artistName && albumName) {
      uploadPath = path.join(__dirname, '..', '..', 'uploads', 'albums', artistName, albumName);
    } else if (type === 'playlist' && playlistId) {
      uploadPath = path.join(__dirname, '..', '..', 'uploads', 'playlists', playlistId);
    } else {
      console.error('Invalid type or missing parameters:', req.body);
      return cb(new Error('Invalid type or missing parameters'), null);
    }

    console.log('Upload path:', uploadPath); // Dodanie logowania

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Directory created:', uploadPath); // Dodanie logowania
      }
      cb(null, uploadPath);
    } catch (err) {
      console.error('Error creating directory:', err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    console.log('Setting filename for:', file.originalname); // Dodanie logowania
    cb(null, 'image.jpg'); // Wszystkie obrazy będą zapisywane jako image.jpg
  }
});

const upload = multer({ storage });

// Endpoint do sprawdzania, czy obraz istnieje
router.get('/check', (req, res) => {
  const { type, artistName, albumName, playlistId } = req.query;

  console.log('Check parameters:', req.query); // Dodanie logowania

  let imagePath;
  if (type === 'artist') {
    imagePath = path.join(__dirname, '..', '..', 'uploads', 'artists', artistName, 'image.jpg');
  } else if (type === 'album') {
    imagePath = path.join(__dirname, '..', '..', 'uploads', 'albums', artistName, albumName, 'image.jpg');
  } else if (type === 'playlist') {
    imagePath = path.join(__dirname, '..', '..', 'uploads', 'playlists', playlistId, 'image.jpg');
  } else {
    console.error('Invalid type or missing parameters:', req.query);
    return res.status(400).json({ message: 'Invalid type or missing parameters' });
  }

  console.log('Image path:', imagePath); // Dodanie logowania

  if (fs.existsSync(imagePath)) {
    res.status(200).json({ exists: true, imagePath: `/uploads/${type === 'artist' ? `artists/${artistName}` : type === 'album' ? `albums/${artistName}/${albumName}` : `playlists/${playlistId}`}/image.jpg` });
  } else {
    res.status(200).json({ exists: false });
  }
});

// Endpoint do przesyłania obrazów
router.post('/upload', upload.single('image'), (req, res) => {
  console.log('File uploaded:', req.file); // Dodanie logowania
  console.log('Request body:', req.body); // Dodanie logowania
  res.status(201).json({ message: 'Image uploaded successfully' });
});

module.exports = router;
