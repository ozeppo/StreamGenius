<template>
    <div>
      <h2>Music List</h2>
      <ul class="music-list">
        <li v-for="music in musicList" :key="music._id" class="music-item">
          <div class="music-info">
            <span class="music-title" @click="playMusic(music)">{{ music.title || 'Untitled' }}</span>
            <span class="music-details">
              <router-link :to="{ name: 'Artist', params: { id: music.artistId } }" @click.native="logArtistId(music.artistId)">{{ music.artist }}</router-link> |
              <router-link :to="{ name: 'Album', params: { id: music.albumId } }" @click.native="logAlbumId(music.albumId)">{{ music.album }}</router-link>
            </span>
          </div>
          <button @click="selectMusic(music)" class="music-edit">...</button>
        </li>
        <li class="music-item">
          <router-link to="/upload" class="upload-link">+</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        musicList: [],
        selectedMusic: null
      };
    },
    async created() {
      try {
        const res = await axios.get('http://localhost:5000/api/music');
        this.musicList = res.data.map(music => ({
          ...music,
          artistId: music.artistId || 'unknown',
          albumId: music.albumId || 'unknown'
        }));
      } catch (error) {
        console.error('Error fetching music list:', error);
      }
    },
    methods: {
      playMusic(music) {
        this.$emit('play', music);
      },
      selectMusic(music) {
        this.selectedMusic = music;
        this.$emit('edit', music);
      },
      logArtistId(id) {
        console.log('Artist ID:', id);
      },
      logAlbumId(id) {
        console.log('Album ID:', id);
      }
    }
  };
  </script>
  
  <style>
  .music-list {
    list-style: none;
    padding: 0;
  }
  
  .music-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
  }
  
  .music-info {
    display: flex;
    flex-direction: column;
  }
  
  .music-title {
    font-weight: bold;
    color: #1DB954;
    cursor: pointer;
  }
  
  .music-title:hover {
    color: #bb86fc;
  }
  
  .music-details {
    font-size: 0.875rem;
    color: #888;
  }
  
  .music-edit {
    background: none;
    border: none;
    color: #1DB954;
    cursor: pointer;
    font-size: 1.5rem;
  }
  
  .music-edit:hover {
    color: #bb86fc;
  }
  
  .upload-link {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    color: #1DB954;
    text-decoration: none;
  }
  
  .upload-link:hover {
    color: #bb86fc;
  }
  </style>
  