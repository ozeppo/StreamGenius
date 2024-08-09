const express = require('express');
const cors = require('cors');
const path = require('path');

const musicRoutes = require('./routes/musicRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const imageRoutes = require('./routes/imageRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/music', musicRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/home', homeRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;
