const Music = require('../models/musicModel');
const Genius = require('genius-lyrics-api');
const axios = require('axios');

const GENIUS_API_KEY = require('../config').GENIUS_ACCESS_TOKEN;

exports.getLyrics = async (req, res) => {
  try {
    const { title, artist } = req.query;

    // Check if there are song lyrics in the database
    const existingSong = await Music.findOne({ title: title, artist: artist });

    if (existingSong && existingSong.lyrics) {
      // If the song lyrics are already in the database, return them
      return res.status(200).json({ lyrics: existingSong.lyrics });
    }

    // If the text is not in the database, get it from the API
    const options = {
      apiKey: GENIUS_API_KEY,
      title: title,
      artist: artist,
      optimizeQuery: true,
    };

    const lyrics = await Genius.getLyrics(options);

    if (!lyrics) {
      return res.status(404).json({ error: 'Lyrics not found' });
    }

    // Save the song lyrics in the database for future use
    existingSong.lyrics = lyrics;
    await existingSong.save();

    res.status(200).json({ lyrics: lyrics });
  } catch (error) {
    console.error('An error occurred while fetching lyrics:', error);
    res.status(500).json({ error: 'An error occurred while fetching lyrics' });
  }
};

exports.updateLyrics = async (req, res) => {
  try {
    const { title, artist, lyrics } = req.body;

    console.log(`Trying to update Lyrics for ${title} by ${artist} with new lyrics: ` + lyrics );

    const song = await Music.findOne({ title, artist });

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Update the lyrics in the database
    song.lyrics = lyrics;
    await song.save();

    res.status(200).json({ message: 'Lyrics updated successfully' });
  } catch (error) {
    console.error('An error occurred while updating lyrics:', error);
    res.status(500).json({ error: 'An error occurred while updating lyrics' });
  }
};

exports.getSimilarLyrics = async (req, res) => {
  try {
      const { title, artist } = req.query;
      if (!title || !artist) {
          return res.status(400).json({ error: 'Title and artist are required' });
      }

      // API request to Genius search endpoint
      const response = await axios.get('https://api.genius.com/search', {
          headers: {
              'Authorization': `Bearer ${GENIUS_API_KEY}`
          },
          params: {
              q: `${title} ${artist}`
          }
      });

      const hits = response.data.response.hits;

      // Process the results
      const similarLyricsResults = hits.map(hit => {
          const song = hit.result;

          return {
              title: song.title || 'Unknown Title',
              artist: song.primary_artist.name || 'Unknown Artist',
              url: song.url,
              thumbnail: song.song_art_image_thumbnail_url || song.header_image_thumbnail_url
          };
      });

      return res.status(200).json({ results: similarLyricsResults });
  } catch (error) {
      console.error('An error occurred while fetching similar lyrics:', error);
      res.status(500).json({ error: 'An error occurred while fetching similar lyrics' });
  }
};
