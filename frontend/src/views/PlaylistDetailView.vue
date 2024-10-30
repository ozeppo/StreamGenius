<template>
  <div class="playlist-view">
    <!-- Playlist Header with Play, Shuffle, and AI Shuffle buttons -->
    <div class="playlist-header">
      <div class="header-content">
        <h1>{{ playlistName }}</h1>
        <div class="playlist-buttons">
          <!-- Play Button -->
          <button @click="playPlaylist" class="play-button">
            <i class="fas fa-play"></i> Play
          </button>
          <!-- Shuffle Button -->
          <button @click="shufflePlaylist" class="shuffle-button">
            <i class="fas fa-random"></i> Shuffle
          </button>
          <!-- AI Shuffle Button -->
          <button @click="aiShufflePlaylist" class="ai-shuffle-button">
            <i class="fas fa-brain"></i> AI Shuffle
          </button>
        </div>
      </div>
      <!-- Playlist Image or Upload Placeholder -->
      <div class="playlist-image-container">
        <div v-if="playlistImage" class="image-preview">
          <img :src="playlistImage" alt="Playlist Image" />
        </div>
        <div v-else class="upload-image-placeholder">
          <label for="upload-image" class="upload-label">
            <input type="file" id="upload-image" @change="onFileChange" />
            <span>Upload Image</span>
          </label>
        </div>
      </div>
    </div>
    <!-- Music List Component for displaying songs in the playlist -->
    <MusicList :apiEndpoint="`http://localhost:5000/api/playlist/${playlistId}/songs`" :title="`Track List`" @play="playTrack" />
  </div>
</template>

<script>
import MusicList from '@/components/MusicList.vue';
import axios from 'axios';
import aiShuffle from '@/utils/aiShuffle'; // Import AI shuffle utility

export default {
  components: {
    MusicList
  },
  data() {
    return {
      playlistId: this.$route.params.playlistId,
      playlistName: '',
      playlistImage: null,
      imageFile: null,
      songs: [], // To store the fetched songs for playing
    };
  },
  async created() {
    await this.fetchPlaylistName();
    await this.checkImage();
    await this.fetchSongs(); // Fetch songs when the component is created
  },
  methods: {
    async fetchPlaylistName() {
      try {
        const res = await axios.get(`http://localhost:5000/api/playlist/${this.playlistId}`);
        this.playlistName = res.data.name;
      } catch (error) {
        console.error('Error fetching playlist name:', error);
      }
    },
    async checkImage() {
      try {
        const res = await axios.get('http://localhost:5000/api/images/check', {
          params: {
            type: 'playlist',
            playlistId: this.playlistId,
          }
        });

        if (res.data.exists) {
          this.playlistImage = `http://localhost:5000${res.data.imagePath}`;
        }
      } catch (error) {
        console.error('Error checking image:', error);
      }
    },
    onFileChange(event) {
      this.imageFile = event.target.files[0];
      this.uploadImage();
    },
    async uploadImage() {
      if (this.imageFile) {
        const formData = new FormData();
        formData.append('type', 'playlist');
        formData.append('playlistId', this.playlistId);
        formData.append('image', this.imageFile);

        try {
          await axios.post('http://localhost:5000/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          this.checkImage();
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
    async fetchSongs() {
      try {
        const res = await axios.get(`http://localhost:5000/api/playlist/${this.playlistId}/songs`);
        this.songs = res.data;
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    },
    playTrack(track) {
      this.$emit('play', track);
    },
    // Play function for playing the playlist in normal order
    playPlaylist() {
      if (this.songs.length > 0) {
        this.$emit('play', this.songs[0], this.songs, 0);
        localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(this.songs));
      }
    },
    // Shuffle function for randomizing the playlist
    shufflePlaylist() {
      const shuffledSongs = this.songs.sort(() => Math.random() - 0.5);
      this.$emit('play', shuffledSongs[0], shuffledSongs, 0);
      localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(shuffledSongs));
    },
    // AI Shuffle function for intelligent sorting and playing
    aiShufflePlaylist() {
      const shuffledSongs = aiShuffle([...this.songs]);
      this.$emit('play', shuffledSongs[0], shuffledSongs, 0);
      localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(shuffledSongs));
    }
  }
};
</script>

<style scoped>
.playlist-view {
  padding: 2rem;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.playlist-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.play-button,
.shuffle-button,
.ai-shuffle-button {
  background-color: #1DB954;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.play-button:hover,
.shuffle-button:hover,
.ai-shuffle-button:hover {
  background-color: #1ed760;
}

.playlist-image-container {
  width: 150px;
  height: 150px;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  cursor: pointer;
}

.upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #1DB954;
  text-align: center;
}

.upload-label input {
  display: none;
}
</style>