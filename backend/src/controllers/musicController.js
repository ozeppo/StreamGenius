const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid'); // Dodanie pakietu uuid dla unikalnych nazw plików
const Music = require('../models/musicModel');
const { analyzeMusic } = require('../utils/analyzeMusic');


exports.uploadMusic = async (req, res) => {
  try {
      const originalFilePath = req.file.path;
      const analysis = await analyzeMusic(originalFilePath);

      // Generowanie unikalnej nazwy pliku
      const uniqueId = uuidv4();
      const newFileName = `${uniqueId}.mp3`;
      const newFilePath = path.join('uploads', newFileName);

      // Konwersja pliku do MP3 z unikalną nazwą
      await convertToMp3(originalFilePath, newFilePath);

      // Usuwanie oryginalnego pliku
      fs.unlinkSync(originalFilePath);

      // Zapisanie informacji o pliku i wyników analizy w bazie danych
      const music = new Music({
          title: req.body.title,
          artist: req.body.artist,
          album: req.body.album,
          genre: req.body.genre,
          bpm: analysis.bpm,
          energy: analysis.energy,
          danceability: analysis.danceability,
          filePath: newFilePath // Używamy wygenerowanej nazwy pliku
      });

      await music.save();

      res.status(201).json(music);
  } catch (error) {
      console.error('Error uploading music:', error); // Dodajemy logowanie błędów
      res.status(500).json({ message: error.message });
  }
};

const convertToMp3 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
          .toFormat('mp3')
          .on('error', (err) => reject(err))
          .on('end', () => resolve(outputPath))
          .save(outputPath);
  });
};

exports.updateMetadata = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, artist, album, genre } = req.body;

      const music = await Music.findById(id);

      if (!music) {
          return res.status(404).json({ message: 'Music not found' });
      }

      // Aktualizujemy tylko te metadane, które są dostarczone
      if (title) music.title = title;
      if (artist) music.artist = artist;
      if (album) music.album = album;
      if (genre) music.genre = genre;

      await music.save();

      res.status(200).json(music);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getAllMusic = async (req, res) => {
  try {
    const music = await Music.find();
    res.status(200).json(music);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ error: 'Music not found' });
    res.status(200).json(music);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.streamMusic = async (req, res) => {
  try {
      const { id } = req.params;
      const music = await Music.findById(id);

      if (!music) {
          return res.status(404).json({ message: 'Music not found' });
      }

      const musicPath = path.join(__dirname, '..', '..', music.filePath);

      // Logowanie ścieżki pliku
      console.log(`Attempting to stream file: ${musicPath}`);

      fs.stat(musicPath, (err, stats) => {
          if (err) {
              console.error(`File not found: ${musicPath}`);
              return res.status(404).json({ message: 'Music not found' });
          }

          const range = req.headers.range;
          if (!range) {
              return res.status(400).send('Requires Range header');
          }

          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(musicPath, { start, end });
          const head = {
              'Content-Range': `bytes ${start}-${end}/${stats.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'audio/mpeg',
          };

          res.writeHead(206, head);
          file.pipe(res);
      });
  } catch (error) {
      console.error('Error streaming music:', error);
      res.status(500).json({ message: error.message });
  }
};

exports.searchMusic = async (req, res) => {
  try {
    const searchQuery = req.query.query; // Pobranie parametru zapytania
    console.log("Searching for: " + searchQuery);

    // Wyszukiwanie po tytule, artyście, albumie i gatunku
    const results = await Music.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } }, // case-insensitive search
        { artist: { $regex: searchQuery, $options: 'i' } },
        { album: { $regex: searchQuery, $options: 'i' } },
        { genre: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error during search:', error); // Dodanie logowania błędów
    res.status(500).json({ error: error.message });
  }
};

exports.getMusicByArtist = async (req, res) => {
  try {
    console.log(`Fetching music for artist: ${req.params.artistName}`);
    const music = await Music.find({ artist: req.params.artistName });

    if (!music.length) {
      console.log('No music found for this artist');
      return res.status(404).json({ message: 'No music found for this artist' });
    }

    res.status(200).json(music);
  } catch (error) {
    console.error('Error fetching music by artist:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getMusicByAlbum = async (req, res) => {
  try {
    console.log(`Fetching music for album: ${req.params.albumName} by artist: ${req.params.artistName}`);
    const music = await Music.find({ album: req.params.albumName, artist: req.params.artistName });

    if (!music.length) {
      console.log('No music found for this album');
      return res.status(404).json({ message: 'No music found for this album' });
    }

    res.status(200).json(music);
  } catch (error) {
    console.error('Error fetching music by album:', error);
    res.status(400).json({ message: error.message });
  }
};