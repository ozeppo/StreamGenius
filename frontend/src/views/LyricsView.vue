<template>
  <div class="lyrics-view">
    <div class="header">
      <button @click="goBack" class="close-button">
        <i class="fas fa-times"></i>
      </button>
      <button @click="openEditPopup" class="edit-button">
        <i class="fas fa-edit"></i>
      </button>
    </div>
    <h2>Lyrics for "{{ currentTrack.title }}" by "{{ currentTrack.artist }}"</h2>
    <div v-if="lyrics" class="lyrics-container">
      <pre class="lyrics-text" v-html="formattedLyrics"></pre>
    </div>
    <div v-else>
      <p>Error loading lyrics</p>
    </div>

    <div v-if="showEditPopup" class="edit-popup">
      <div class="popup-content">
        <h3>Edit Lyrics</h3>
        <textarea v-model="editedLyrics" rows="10"></textarea>
        <p>Other similar search results from Genius.com</p>
        <ul class="similar-results">
          <li v-for="(result, index) in similarResults" :key="index">
            <a href="#" @click.prevent="selectLyrics(result)">{{ result.title }} by {{ result.artist }}</a>
          </li>
        </ul>
        <button @click="saveLyrics" class="save-button">Save</button>
        <button @click="closeEditPopup" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      lyrics: null,
      formattedLyrics: '',
      currentTrack: {
        title: 'Unknown Title',
        artist: 'Unknown Artist',
      },
      showEditPopup: false,
      editedLyrics: '',
      similarResults: [],
    };
  },
  async created() {
    // Fetch current track from localStorage
    const savedTrack = localStorage.getItem('currentlyPlayingTrack');
    if (savedTrack) {
      this.currentTrack = JSON.parse(savedTrack);
    }

    // Fetch lyrics for the current track
    if (this.currentTrack.title && this.currentTrack.artist) {
      await this.fetchLyrics(this.currentTrack.title, this.currentTrack.artist);
      await this.fetchSimilarResults(this.currentTrack.title, this.currentTrack.artist);
    }
  },
  methods: {
    async fetchLyrics(title, artist) {
      try {
        const response = await axios.get(`http://localhost:5000/api/music/lyrics`, {
          params: { title, artist },
        });
        this.lyrics = response.data.lyrics || 'Lyrics not found';
        this.editedLyrics = this.lyrics;
        this.formatLyrics();
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        this.lyrics = 'Error loading lyrics';
      }
    },
    formatLyrics() {
      this.formattedLyrics = this.lyrics.replaceAll(/\[([^\]]+)\]/g, '<span style="font-weight: 900">[$1]</span>');
    },
    async fetchSimilarResults(title, artist) {
      try {
        const response = await axios.get(`http://localhost:5000/api/music/lyrics/similar`, {
          params: { title, artist },
        });
        this.similarResults = response.data.results || [];
      } catch (error) {
        console.error('Error fetching similar lyrics:', error);
      }
    },
    async selectLyrics(result) {
      await this.fetchLyrics(result.title, result.artist);
      this.closeEditPopup();
    },
    goBack() {
      this.$router.push('/');
    },
    openEditPopup() {
      this.showEditPopup = true;
    },
    closeEditPopup() {
      this.showEditPopup = false;
    },
    async saveLyrics() {
      // Code to save edited lyrics to the backend
      try {
        await axios.patch(`http://localhost:5000/api/music/lyrics/`, {
          title: this.currentTrack.title,
          artist: this.currentTrack.artist,
          lyrics: this.editedLyrics,
        });
        alert('Lyrics saved successfully!');
        this.closeEditPopup();
      } catch (error) {
        console.error('Error saving lyrics:', error);
      }
    }
  }
};
</script>

<style scoped>
.lyrics-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1DB954, #121212);
  color: white;
  padding: 20px;
  position: relative;
}

.header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-button,
.edit-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.3s ease;
}

.close-button:hover,
.edit-button:hover {
  color: #bb86fc;
}

h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
}

.lyrics-container {
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.lyrics-text {
  white-space: pre-wrap;
  font-size: 1.8rem;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}

.lyric-tag {
  font-weight: 800;
}

.edit-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #121212;
  padding: 20px;
  border-radius: 10px;
  z-index: 1000;
  width: 90%;
  max-width: 500px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-content h3 {
  color: #1DB954;
  margin-bottom: 20px;
}

.popup-content textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background: #333;
  color: white;
  margin-bottom: 20px;
}

.similar-results {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.similar-results li {
  margin-bottom: 10px;
}

.similar-results li a {
  color: #1DB954;
  text-decoration: none;
}

.similar-results li a:hover {
  color: #bb86fc;
}

.save-button {
  background: #1DB954;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #1ed760;
}

/* Custom scrollbar styling */
.lyrics-container::-webkit-scrollbar {
  width: 8px;
}

.lyrics-container::-webkit-scrollbar-thumb {
  background-color: #1DB954;
  border-radius: 10px;
}

.lyrics-container::-webkit-scrollbar-thumb:hover {
  background-color: #1ed760;
}
</style>
