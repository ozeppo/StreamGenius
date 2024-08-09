const Playlist = require('../models/playlistModel');
const Music = require('../models/musicModel');

exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, songs } = req.body;

    const playlist = new Playlist({
      name,
      description,
      songs,
    });

    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs');
    res.status(200).json(playlists);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description, songs } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;
    if (songs) playlist.songs = songs;

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPlaylistByName = async (req, res) => {
    try {
      const playlist = await Playlist.findOne({ name: req.params.name }).populate('songs');
  
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      res.status(200).json(playlist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
exports.getPlaylistSongs = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.status(200).json(playlist.songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
