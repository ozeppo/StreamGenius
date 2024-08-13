<template>
  <div class="music-list-container">
    <!-- Display the title of the music list -->
    <h2>{{ title }}</h2>
    
    <!-- List each music item in the fetched music list -->
    <ul class="music-list">
      <!-- Iterate over musicList and display each music item -->
      <li v-for="music in musicList" :key="music._id" class="music-item">
        <div class="music-info">
          <!-- Display the title of the music, clicking will play the music -->
          <span class="music-title" @click="playMusic(music)">{{ music.title || 'Untitled' }}</span>
          <span class="music-details">
            <!-- Link to the artist's page if artist information is available -->
            <router-link v-if="music.artist" :to="{ name: 'Artist', params: { artistName: music.artist } }" class="link">{{ music.artist }}</router-link>
            <span v-else class="link">Unknown Artist</span>
            <!-- Display the album name, linking to the album's page -->
            <span v-if="music.album"> | 
              <router-link :to="{ name: 'Album', params: { artistName: music.artist || 'Unknown', albumName: music.album } }" class="link">{{ music.album }}</router-link>
            </span>
          </span>
        </div>
        <div class="music-actions">
          <!-- Button to toggle options for the current music item -->
          <button @click="toggleOptions(music._id)">...</button>
          <!-- Display additional options for the selected music item -->
          <div v-if="selectedMusic === music._id" class="music-options">
            <!-- Option to add the music to a playlist -->
            <button @click="openAddToPlaylistModal(music)">Add to Playlist</button>
            <!-- Option to edit the metadata of the music item -->
            <button @click="openEditMetadataModal(music)">Edit Metadata</button>
          </div>
        </div>
      </li>
    </ul>
    
    <!-- Modal to select a playlist to add the music to -->
    <div v-if="showPlaylistModal" class="modal">
      <div class="modal-content">
        <h3>Select Playlist</h3>
        <ul>
          <!-- List available playlists to add the selected music -->
          <li v-for="playlist in playlists" :key="playlist._id">
            <button @click="addToPlaylist(playlist)">{{ playlist.name }}</button>
          </li>
        </ul>
        <button @click="closeModal">Close</button>
      </div>
    </div>
    
    <!-- Modal to edit the metadata of the selected music -->
    <div v-if="showEditMetadataModal" class="modal">
      <div class="modal-content">
        <h3>Edit Metadata</h3>
        <!-- Form to update music metadata -->
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
    // The API endpoint from which the music list will be fetched
    apiEndpoint: {
      type: String,
      required: true
    },
    // The title to display for this music list
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      musicList: [],  // Array to hold the fetched music items
      selectedMusic: null,  // Currently selected music item for options display
      showPlaylistModal: false,  // Boolean to control the visibility of the "Add to Playlist" modal
      showEditMetadataModal: false,  // Boolean to control the visibility of the "Edit Metadata" modal
      playlists: [],  // Array to hold fetched playlists
      musicToAdd: null,  // The music item to be added to a playlist
      editMetadata: {
        title: '',
        artist: '',
        album: '',
        genre: ''
      },  // Object to hold metadata of the music item being edited
      musicToEdit: null,  // The music item being edited
    };
  },
  async created() {
    // Fetch the music list and playlists when the component is created
    await this.fetchMusic();
    await this.fetchPlaylists();
  },
  methods: {
    // Fetch the music list from the provided API endpoint
    async fetchMusic() {
      try {
        const res = await axios.get(this.apiEndpoint);
        this.musicList = res.data;
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    },
    // Fetch available playlists from the API
    async fetchPlaylists() {
      try {
        const res = await axios.get('http://localhost:5000/api/playlist');
        this.playlists = res.data;
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    },
    // Handle the playing of a music track
    playMusic(music) {
      // Create a playlist array from the current music list
      const playlist = this.musicList.map(track => ({ ...track }));
      // Find the index of the selected music in the playlist
      const startIndex = playlist.findIndex(track => track._id === music._id);
      // Emit the 'play' event to the parent component, passing the selected music, playlist, and startIndex
      this.$emit('play', music, playlist, startIndex);
      // Save the currently playing track queue in local storage
      localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(playlist));
    },
    // Toggle the visibility of options for a specific music item
    toggleOptions(musicId) {
      this.selectedMusic = this.selectedMusic === musicId ? null : musicId;
    },
    // Open the modal to add the selected music to a playlist
    openAddToPlaylistModal(music) {
      this.musicToAdd = music;
      this.showPlaylistModal = true;
    },
    // Open the modal to edit the metadata of the selected music
    openEditMetadataModal(music) {
      this.musicToEdit = music;
      this.editMetadata = { ...music };
      this.showEditMetadataModal = true;
    },
    // Close all modals
    closeModal() {
      this.showPlaylistModal = false;
      this.showEditMetadataModal = false;
      this.musicToAdd = null;
      this.musicToEdit = null;
    },
    // Add the selected music to a specific playlist
    async addToPlaylist(playlist) {
      try {
        // Add the music's ID to the playlist's songs array
        playlist.songs.push(this.musicToAdd._id);
        // Update the playlist on the server
        await axios.patch(`http://localhost:5000/api/playlist/${playlist._id}`, playlist);
        this.closeModal();
      } catch (error) {
        console.error('Error adding to playlist:', error);
      }
    },
    // Save the updated metadata for the selected music item
    async saveMetadata() {
      if (!this.musicToEdit) return;

      try {
        const updatedMusic = { ...this.editMetadata };
        // Update the music item on the server
        await axios.patch(`http://localhost:5000/api/music/${this.musicToEdit._id}`, updatedMusic);
        // Update the local music list with the updated data
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
  