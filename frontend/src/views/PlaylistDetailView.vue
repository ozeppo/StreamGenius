<template>
  <div class="playlist-view">
    <div class="playlist-header">
      <h2>{{ playlistName }}</h2>
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
    <MusicList :apiEndpoint="`http://localhost:5000/api/playlist/${playlistId}/songs`" :title="`Songs in ${playlistName}`" @play="playTrack" />
  </div>
</template>

<script>
import MusicList from '@/components/MusicList.vue';
import axios from 'axios';

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
    };
  },
  async created() {
    await this.fetchPlaylistName();
    await this.checkImage();
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
    playTrack(track) {
      this.$emit('play', track);
    }
  }
};
</script>

<style>
.playlist-view {
  padding: 2rem;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
