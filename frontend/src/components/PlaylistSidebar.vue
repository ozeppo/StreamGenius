<template>
  <div class="playlist-sidebar">
    <h2>Playlists</h2>
    <ul>
      <li v-for="playlist in playlists" :key="playlist._id">
        <router-link :to="{ name: 'PlaylistDetail', params: { playlistId: playlist._id } }">{{ playlist.name }}</router-link>
      </li>
    </ul>
    <button @click="showAddPlaylistModal" class="upload-link">+</button>

    <!-- Modal for adding a new playlist -->
    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Create New Playlist</h3>
        <form @submit.prevent="createPlaylist">
          <div class="form-group">
            <label for="name">Playlist Name</label>
            <input v-model="newPlaylist.name" id="name" type="text" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea v-model="newPlaylist.description" id="description"></textarea>
          </div>
          <button type="submit" class="save-button">Create</button>
          <button @click="closeModal" class="cancel-button">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      playlists: [],
      isModalVisible: false,
      newPlaylist: {
        name: '',
        description: ''
      }
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
    },
    showAddPlaylistModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.newPlaylist.name = '';
      this.newPlaylist.description = '';
    },
    async createPlaylist() {
      try {
        const res = await axios.post('http://localhost:5000/api/playlist', this.newPlaylist);
        this.playlists.push(res.data);
        this.closeModal();
      } catch (error) {
        console.error('Error creating playlist:', error);
      }
    }
  }
};
</script>

<style scoped>
.playlist-sidebar {
  width: 200px;
  background-color: #181818;
  padding: 1rem;
  height: 100vh;
  box-sizing: border-box;
}

h2 {
  color: var(--primary-color);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 1rem 0;
}

a {
  color: var(--primary-color);
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
  color: var(--primary-color);
  background: none;
  border: none;
  cursor: pointer;
}

.upload-link:hover {
  color: #bb86fc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #282828;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #bbb;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: #222;
  color: white;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  border-radius: 4px;
  margin-right: 1rem;
}

.save-button:hover {
  background-color: #1ed760;
}

.cancel-button {
  background-color: #555;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  border-radius: 4px;
}

.cancel-button:hover {
  background-color: #777;
}
</style>