<template>
  <div class="upload-container">
    <h2>Upload Music</h2>
    <div class="file-upload">
      <label for="file-input" class="file-upload-label">
        <span>Select a file to upload</span>
        <input id="file-input" type="file" @change="uploadFile" />
      </label>
    </div>

    <div v-if="showMetadataForm" class="metadata-form">
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
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
      <div class="progress" :style="{ width: uploadProgress + '%' }"></div>
    </div>

    <div v-if="uploadProgress === 100" class="upload-success">
      <p>Upload successful!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showMetadataForm: false,
      metadata: {
        title: '',
        artist: '',
        album: '',
        genre: ''
      },
      uploadProgress: 0,
      uploadedMusicId: null
    };
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/api/music/upload', formData, {
          onUploadProgress: progressEvent => {
            this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 90);
          }
        });

        this.uploadedMusicId = res.data._id;
        this.metadata = {
          title: res.data.title || '',
          artist: res.data.artist || '',
          album: res.data.album || '',
          genre: res.data.genre || ''
        };

        this.uploadProgress = 100;
        this.showMetadataForm = true;
      } catch (error) {
        console.error('Error uploading file:', error);
        this.uploadProgress = 0;
      }
    },
    async saveMetadata() {
      if (!this.uploadedMusicId) return;

      try {
        await axios.patch(`http://localhost:5000/api/music/${this.uploadedMusicId}`, this.metadata);
        this.showMetadataForm = false;
        this.uploadProgress = 0;
        alert('Metadata saved successfully!');
      } catch (error) {
        console.error('Error saving metadata:', error);
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');

.upload-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2, h3 {
  color: #1DB954;
  margin-bottom: 1rem;
}

.file-upload {
  margin-bottom: 2rem;
}

.file-upload-label {
  display: block;
  padding: 1rem;
  border: 2px dashed #1DB954;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-upload-label:hover {
  background-color: rgba(29, 185, 84, 0.1);
}

.file-upload-label span {
  color: #1DB954;
}

.file-upload-label input {
  display: none;
}

.metadata-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #bbb;
}

.form-group input {
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
  background-color: #1DB954;
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
