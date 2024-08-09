const fs = require('fs');
const path = require('path');
const Music = require('../models/musicModel');
const Playlist = require('../models/playlistModel');

// Funkcja pomocnicza do sprawdzania istnienia pliku
const checkImageExists = (imagePath) => {
  return fs.existsSync(path.join(__dirname, '..', '..', imagePath));
};

// Losowe albumy
exports.getRandomAlbums = async (req, res) => {
  try {
    const albums = await Music.aggregate([
      { $match: { album: { $ne: null } } }, // Uwzględnij tylko utwory, które mają przypisany album
      { $group: { _id: { album: "$album", artist: "$artist" }, count: { $sum: 1 } } }, // Grupuj po albumie i artyście
      { $sample: { size: 5 } } // Wybierz losowo 5 albumów
    ]);

    const result = albums.map(album => {
      const imageUrl = `/uploads/albums/${album._id.artist}/${album._id.album}/image.jpg`;
      return {
        name: album._id.album,
        artist: album._id.artist,
        imageUrl: `http://localhost:5000${imageUrl}`,
        hasImage: checkImageExists(imageUrl)
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Losowe playlisty
exports.getRandomPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.aggregate([
      { $sample: { size: 5 } } // Wybierz losowo 5 playlist
    ]);

    const result = playlists.map(playlist => {
      const imageUrl = `/uploads/playlists/${playlist._id}/image.jpg`;
      return {
        _id: playlist._id,
        name: playlist.name,
        imageUrl: `http://localhost:5000${imageUrl}`,
        hasImage: checkImageExists(imageUrl)
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Losowi artyści
exports.getRandomArtists = async (req, res) => {
  try {
    const artists = await Music.aggregate([
      { $group: { _id: "$artist", count: { $sum: 1 } } }, // Grupuj po artyście
      { $sample: { size: 5 } } // Wybierz losowo 5 artystów
    ]);

    const result = artists.map(artist => {
      const imageUrl = `/uploads/artists/${artist._id}/image.jpg`;
      return {
        name: artist._id,
        imageUrl: `http://localhost:5000${imageUrl}`,
        hasImage: checkImageExists(imageUrl)
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
