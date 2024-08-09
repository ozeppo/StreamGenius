<template>
    <div class="edit-artist">
      <h2>Edit Artist</h2>
      <form @submit.prevent="saveArtist">
        <div class="form-group">
          <label for="name">Artist Name</label>
          <input v-model="artist.name" id="name" type="text" required />
        </div>
        <div class="form-group">
          <label for="image">Artist Image</label>
          <input type="file" @change="onFileChange" />
          <div v-if="artistImage" class="image-preview">
            <img :src="artistImage" alt="Artist Image" />
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        artist: {
          name: '',
        },
        imageFile: null,
        artistImage: null,
      };
    },
    async created() {
      await this.fetchArtist();
      await this.checkImage();
    },
    methods: {
      async fetchArtist() {
        // Pobierz dane artysty
      },
      async checkImage() {
        const res = await axios.get('http://localhost:5000/api/images/check', {
          params: {
            type: 'artist',
            artistName: this.artist.name
          }
        });
  
        if (res.data.exists) {
          this.artistImage = res.data.imagePath;
        }
      },
      onFileChange(event) {
        this.imageFile = event.target.files[0];
      },
      async saveArtist() {
        // Zapisz dane artysty
        if (this.imageFile) {
          const formData = new FormData();
          formData.append('image', this.imageFile);
          formData.append('type', 'artist');
          formData.append('artistName', this.artist.name);
  
          await axios.post('http://localhost:5000/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
  
          this.checkImage();
        }
      }
    }
  };
  </script>
  
  <style>
  .image-preview img {
    max-width: 200px;
    margin-top: 10px;
  }
  </style>
  