<template>
    <div class="music-list-container">
      <h2>{{ title }}</h2>
      <ul class="music-list">
        <li v-for="music in musicList" :key="music._id" class="music-item">
          <div class="music-info">
            <span class="music-title" @click="playMusic(music)">{{ music.title || 'Untitled' }}</span>
            <span class="music-details">
              <router-link v-if="music.artist" :to="{ name: 'Artist', params: { artistName: music.artist } }" class="link">{{ music.artist }}</router-link>
              <span v-else class="link">Unknown Artist</span>
              <span v-if="music.album"> | 
                <router-link :to="{ name: 'Album', params: { artistName: music.artist || 'Unknown', albumName: music.album } }" class="link">{{ music.album }}</router-link>
              </span>
            </span>
          </div>
          <div class="music-actions">
            <button @click="toggleOptions(music._id)">...</button>
            <div v-if="selectedMusic === music._id" class="music-options">
              <button @click="openAddToPlaylistModal(music)">Add to Playlist</button>
              <button @click="openEditMetadataModal(music)">Edit Metadata</button>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="showPlaylistModal" class="modal">
        <div class="modal-content">
          <h3>Select Playlist</h3>
          <ul>
            <li v-for="playlist in playlists" :key="playlist._id">
              <button @click="addToPlaylist(playlist)">{{ playlist.name }}</button>
            </li>
          </ul>
          <button @click="closeModal">Close</button>
        </div>
      </div>
      <div v-if="showEditMetadataModal" class="modal">
        <div class="modal-content">
          <h3>Edit Metadata</h3>
          <form @submit.prevent="saveMetadata">
            <div class="form-group">
              <label for="title">Title</label>
              <input v-model="metadata.title" id="title" type="text" required />
            </div>
            <div class="form-group">
              <label for="artist">Artist</label>
              <input v-model="metadata.artist" id="artist" type="text" required />
            </div>
            <div class="form-group">
              <label for="album">Album</label>
              <input v-model="metadata.album" id="album" type="text" />
            </div>
            <div class="form-group">
              <label for="genre">Genre</label>
              <input v-model="metadata.genre" id="genre" type="text" />
            </div>
            <button type="submit" class="save-button">Save</button>
          </form>
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      apiEndpoint: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        musicList: [],
        selectedMusic: null,
        showPlaylistModal: false,
        showEditMetadataModal: false,
        playlists: [],
        musicToAdd: null,
        editMetadata: {
          title: '',
          artist: '',
          album: '',
          genre: ''
        },
        musicToEdit: null,
      };
    },
    async created() {
      await this.fetchMusic();
      await this.fetchPlaylists();
    },
    methods: {
      async fetchMusic() {
        try {
          const res = await axios.get(this.apiEndpoint);
          this.musicList = res.data;
        } catch (error) {
          console.error('Error fetching music:', error);
        }
      },
      async fetchPlaylists() {
        try {
          const res = await axios.get('http://localhost:5000/api/playlist');
          this.playlists = res.data;
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      },
      playMusic(music) {
        const playlist = this.musicList.map(track => ({ ...track }));
        const startIndex = playlist.findIndex(track => track._id === music._id);
        this.$emit('play', music, playlist, startIndex);
        localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(playlist));
      },
      toggleOptions(musicId) {
        this.selectedMusic = this.selectedMusic === musicId ? null : musicId;
      },
      openAddToPlaylistModal(music) {
        this.musicToAdd = music;
        this.showPlaylistModal = true;
      },
      openEditMetadataModal(music) {
        this.musicToEdit = music;
        this.editMetadata = { ...music };
        this.showEditMetadataModal = true;
      },
      closeModal() {
        this.showPlaylistModal = false;
        this.showEditMetadataModal = false;
        this.musicToAdd = null;
        this.musicToEdit = null;
      },
      async addToPlaylist(playlist) {
        try {
          playlist.songs.push(this.musicToAdd._id);
          await axios.patch(`http://localhost:5000/api/playlist/${playlist._id}`, playlist);
          this.closeModal();
        } catch (error) {
          console.error('Error adding to playlist:', error);
        }
      },
      async saveMetadata() {
        if (!this.musicToEdit) return;
  
        try {
          const updatedMusic = { ...this.editMetadata };
          await axios.patch(`http://localhost:5000/api/music/${this.musicToEdit._id}`, updatedMusic);
          this.musicList = this.musicList.map(music => 
            music._id === this.musicToEdit._id ? updatedMusic : music
          );
          this.closeModal();
        } catch (error) {
          console.error('Error updating metadata:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  .music-list-container {
    flex-grow: 1;
  }
  
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
  
  .music-details .link {
    color: #888;
    text-decoration: none;
  }
  
  .music-details .link:hover {
    color: #bbb;
  }
  
  .music-actions {
    position: relative;
  }
  
  .music-actions button {
    background: none;
    border: none;
    color: #1DB954;
    cursor: pointer;
    font-size: 1.5rem;
  }
  
  .music-actions button:hover {
    color: #bb86fc;
  }
  
  .music-options {
    position: absolute;
    top: 2rem;
    right: 0;
    background: #333;
    border: 1px solid #1DB954;
    padding: 0.5rem;
    border-radius: 4px;
    z-index: 100;
  }
  
  .music-options button {
    background: none;
    border: none;
    color: #1DB954;
    cursor: pointer;
    padding: 0.25rem 0;
    display: block;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
  }
  
  .music-options button:hover {
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
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
  }
  
  .modal-content {
    background: #121212;
    padding: 2rem;
    border-radius: 8px;
    width: 300px;
    text-align: center;
  }
  
  .modal-content h3 {
    color: #1DB954;
    margin-bottom: 1rem;
  }
  
  .modal-content ul {
    list-style: none;
    padding: 0;
  }
  
  .modal-content li {
    margin-bottom: 1rem;
  }
  
  .modal-content button {
    background: none;
    border: 1px solid #1DB954;
    color: #1DB954;
    cursor: pointer;
    padding: 0.5rem;
    width: 100%;
  }
  
  .modal-content button:hover {
    background: #1DB954;
    color: #121212;
  }
  
  .modal-content form {
    display: flex;
    flex-direction: column;
  }
  
  .modal-content form .form-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }
  
  .modal-content form .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #bbb;
  }
  
  .modal-content form .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #333;
    border-radius: 4px;
    background: #222;
    color: white;
  }
  
  .save-button {
    background-color: #1DB954;
    color: white;
    border: none;
    padding: 0.75rem;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .save-button:hover {
    background-color: #1ed760;
  }
  
  .progress-bar {
    width: 100%;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 2rem;
  }
  
  .progress {
    height: 1rem;
    background: #1DB954;
    transition: width 0.3s ease;
  }
  
  .upload-success {
    margin-top: 2rem;
    color: #1DB954;
    font-weight: bold;
  }
  </style>
  