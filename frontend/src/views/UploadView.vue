<template>
  <div class="upload-container">
    <h2>Upload Music</h2>
    <form @submit.prevent="uploadFile">
      <input type="file" @change="handleFileChange" required />
      <button type="submit" class="btn primary">Upload</button>
    </form>
    <div v-if="uploadProgress !== null" class="progress-container">
      <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>
    <div v-if="uploadError" class="error-message">
      <span>{{ uploadError }}</span>
    </div>
    <div v-if="uploadSuccess" class="success-message">
      <span>&#10003; Upload successful!</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      uploadProgress: null,
      uploadError: null,
      uploadSuccess: false
    };
  },
  methods: {
    handleFileChange(e) {
      this.file = e.target.files[0];
      this.uploadProgress = null;
      this.uploadError = null;
      this.uploadSuccess = false;
    },
    async uploadFile() {
      if (!this.file) return;

      const formData = new FormData();
      formData.append('file', this.file);

      try {
        await axios.post('http://localhost:5000/api/music/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (percentCompleted >= 90) {
              percentCompleted = 90;
            }
            this.uploadProgress = percentCompleted;
          }
        });
        this.uploadSuccess = true;
        this.uploadProgress = 100; // Ustawienie na 100% po pomyślnym wgraniu pliku
        this.uploadError = null;
      } catch (error) {
        console.error('Error uploading file:', error);
        this.uploadError = 'Error uploading file. Please try again.';
        this.uploadSuccess = false;
        this.uploadProgress = null; // Zresetowanie paska postępu w przypadku błędu
      }
    }
  }
};
</script>

<style>
.upload-container {
  padding: 2rem;
}

h2 {
  color: #1DB954;
}

form {
  margin-bottom: 1rem;
}

input[type="file"] {
  display: block;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  background-color: #1DB954;
  color: black;
  border: none;
}

.btn.primary:hover {
  background-color: #bb86fc;
}

.progress-container {
  margin-top: 1rem;
  position: relative;
  height: 24px;
  background-color: #333;
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #1DB954;
  transition: width 0.4s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.success-message {
  color: green;
  margin-top: 1rem;
}
</style>
