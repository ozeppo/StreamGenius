const express = require('express');
const cors = require('cors');
const musicRoutes = require('./routes/musicRoutes');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/music', musicRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;
