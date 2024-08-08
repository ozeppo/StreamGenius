<template>
    <div class="album-container">
      <h2>{{ album.title }}</h2>
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
        album: {},
        songs: []
      };
    },
    async created() {
      const albumId = this.$route.params.id;
      try {
        const albumRes = await axios.get(`http://localhost:5000/api/albums/${albumId}`);
        const songsRes = await axios.get(`http://localhost:5000/api/songs?album=${albumId}`);
        this.album = albumRes.data;
        this.songs = songsRes.data;
      } catch (error) {
        console.error('Error fetching album data:', error);
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
  .album-container {
    padding: 2rem;
  }
  
  h2, h3 {
    color: #1DB954;
  }
  
  .song-list {
    list-style: none;
    padding: 0;
  }
  
  .song-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
  
  .song-list li:hover {
    color: #bb86fc;
  }
  </style>
  