<template>
    <div class="artist-container">
      <h2>{{ artist.name }}</h2>
      <h3>Albums</h3>
      <ul class="album-list">
        <li v-for="album in albums" :key="album._id">
          <router-link :to="{ name: 'Album', params: { id: album._id } }">{{ album.title }}</router-link>
        </li>
      </ul>
      <h3>Songs</h3>
      <ul class="song-list">
        <li v-for="song in songs" :key="song._id" @click="playMusic(song)">
          {{ song.title }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        artist: {},
        albums: [],
        songs: []
      };
    },
    async created() {
      const artistId = this.$route.params.id;
      try {
        const artistRes = await axios.get(`http://localhost:5000/api/artists/${artistId}`);
        const albumsRes = await axios.get(`http://localhost:5000/api/albums?artist=${artistId}`);
        const songsRes = await axios.get(`http://localhost:5000/api/songs?artist=${artistId}`);
        this.artist = artistRes.data;
        this.albums = albumsRes.data;
        this.songs = songsRes.data;
      } catch (error) {
        console.error('Error fetching artist data:', error);
      }
    },
    methods: {
      playMusic(song) {
        this.$root.playTrack(song);
      }
    }
  };
  </script>
  
  <style>
  .artist-container {
    padding: 2rem;
  }
  
  h2, h3 {
    color: #1DB954;
  }
  
  .album-list, .song-list {
    list-style: none;
    padding: 0;
  }
  
  .album-list li, .song-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
  }
  
  .album-list li a, .song-list li {
    color: #1DB954;
    text-decoration: none;
  }
  
  .album-list li a:hover, .song-list li:hover {
    color: #bb86fc;
  }
  
  .song-list li {
    cursor: pointer;
  }
  </style>
  