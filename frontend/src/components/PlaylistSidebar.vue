<template>
    <div class="playlist-sidebar">
      <h2>Playlists</h2>
      <ul>
        <li v-for="playlist in playlists" :key="playlist._id">
          <router-link :to="{ name: 'PlaylistDetail', params: { playlistId: playlist._id } }">{{ playlist.name }}</router-link>
        </li>
      </ul>
      <router-link to="/upload" class="upload-link">+</router-link>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        playlists: []
      };
    },
    async created() {
      await this.fetchPlaylists();
    },
    methods: {
      async fetchPlaylists() {
        try {
          const res = await axios.get('http://localhost:5000/api/playlist');
          this.playlists = res.data;
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  .playlist-sidebar {
    width: 200px;
    background-color: #181818;
    padding: 1rem;
    height: 100vh;
    box-sizing: border-box;
  }
  
  h2 {
    color: #1DB954;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin: 1rem 0;
  }
  
  a {
    color: #1DB954;
    text-decoration: none;
  }
  
  a:hover {
    color: #bb86fc;
  }
  
  .upload-link {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    color: #1DB954;
    text-decoration: none;
    margin-top: 2rem;
  }
  
  .upload-link:hover {
    color: #bb86fc;
  }
  </style>
  