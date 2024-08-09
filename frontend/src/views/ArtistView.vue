<template>
    <div class="artist-view">
      <div class="artist-header">
        <h2>{{ artistName }}</h2>
        <div class="artist-image-container">
          <div v-if="artistImage" class="image-preview">
            <img :src="artistImage" alt="Artist Image" />
          </div>
          <div v-else class="upload-image-placeholder">
            <label for="upload-image" class="upload-label">
              <input type="file" id="upload-image" @change="onFileChange" />
              <span>Upload Image</span>
            </label>
          </div>
        </div>
      </div>
      <div class="tabs">
        <button @click="activeTab = 'albums'" :class="{ active: activeTab === 'albums' }">Albums</button>
        <button @click="activeTab = 'songs'" :class="{ active: activeTab === 'songs' }">All Songs</button>
      </div>
      <div v-if="activeTab === 'albums'" class="albums">
        <div v-if="albums.length === 0">
          <p>No albums found for this artist.</p>
        </div>
        <ul v-else>
          <li v-for="album in albums" :key="album.name" class="album-item">
            <router-link :to="{ name: 'Album', params: { artistName: artistName, albumName: album.name } }">{{ album.name }}</router-link>
          </li>
        </ul>
      </div>
      <div v-if="activeTab === 'songs'" class="songs">
        <MusicList :apiEndpoint="`http://localhost:5000/api/music/artist/${artistName}`" title="All Songs" @play="playTrack" />
      </div>
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
        artistName: this.$route.params.artistName,
        activeTab: 'songs',
        albums: [],
        artistImage: null,
        imageFile: null,
      };
    },
    async created() {
      await this.fetchMusicByArtist();
      await this.checkImage();
    },
    methods: {
      async fetchMusicByArtist() {
        try {
          const res = await axios.get(`http://localhost:5000/api/music/artist/${this.artistName}`);
          this.extractAlbums(res.data);
        } catch (error) {
          console.error('Error fetching music by artist:', error);
        }
      },
      extractAlbums(musicList) {
        const albumSet = new Set(musicList.map(music => music.album).filter(album => album));
        this.albums = Array.from(albumSet).map(album => ({ name: album }));
      },
      async checkImage() {
        try {
          const res = await axios.get('http://localhost:5000/api/images/check', {
            params: {
              type: 'artist',
              artistName: this.artistName
            }
          });
  
          if (res.data.exists) {
            this.artistImage = `http://localhost:5000${res.data.imagePath}`;
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
          formData.append('type', 'artist');
          formData.append('artistName', this.artistName);
          formData.append('image', this.imageFile); // Upewnij się, że 'image' jest ostatnim polem
  
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
  .artist-view {
    padding: 2rem;
  }
  
  .artist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .artist-image-container {
    width: 150px;
    height: 150px;
    position: relative;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .upload-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #333;
    border-radius: 50%;
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
  
  .tabs {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .tabs button {
    background: none;
    border: none;
    color: #1DB954;
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s ease;
  }
  
  .tabs button:hover {
    border-bottom: 2px solid #1DB954;
  }
  
  .tabs button.active {
    border-bottom: 2px solid #1DB954;
  }
  
  .albums, .songs {
    margin-top: 2rem;
  }
  
  .album-item {
    list-style: none;
    margin-bottom: 1rem;
  }
  </style>
  