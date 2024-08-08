<template>
    <div v-if="music">
      <h2>{{ music.title || 'Untitled' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Title</label>
          <input type="text" v-model="form.title" />
        </div>
        <div>
          <label>Artist</label>
          <input type="text" v-model="form.artist" />
        </div>
        <div>
          <label>Album</label>
          <input type="text" v-model="form.album" />
        </div>
        <div>
          <label>Genre</label>
          <input type="text" v-model="form.genre" />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        music: null,
        form: {
          title: '',
          artist: '',
          album: '',
          genre: '',
        },
      };
    },
    async created() {
      const id = this.$route.params.id;
      try {
        const res = await axios.get(`http://localhost:5000/api/music/${id}`);
        this.music = res.data;
        this.form = {
          title: res.data.title || '',
          artist: res.data.artist || '',
          album: res.data.album || '',
          genre: res.data.genre || '',
        };
      } catch (error) {
        console.error('Error fetching music details:', error);
      }
    },
    methods: {
      async handleSubmit() {
        const id = this.$route.params.id;
        try {
          const res = await axios.patch(`http://localhost:5000/api/music/${id}`, this.form);
          this.music = res.data;
        } catch (error) {
          console.error('Error updating music details:', error);
        }
      },
    },
  };
  </script>
  