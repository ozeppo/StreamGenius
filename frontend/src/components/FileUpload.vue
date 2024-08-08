<template>
    <div class="file-upload">
      <input type="file" @change="handleFileChange" class="file-input" />
      <button @click="handleUpload" class="btn primary">Upload</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        file: null,
      };
    },
    methods: {
      handleFileChange(e) {
        this.file = e.target.files[0];
      },
      async handleUpload() {
        if (!this.file) return;
  
        const formData = new FormData();
        formData.append('file', this.file);
  
        try {
          const res = await axios.post('http://localhost:5000/api/music/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.$emit('upload', res.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
    },
  };
  </script>
  
  <style>
  .file-upload {
    margin-bottom: 1rem;
  }
  
  .file-input {
    display: block;
    margin-bottom: 0.5rem;
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
  </style>
  