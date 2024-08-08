<template>
  <div class="container">
    <h1>Music Player</h1>
    <MusicList @edit="handleEdit" @play="handlePlay" />
    <div v-if="selectedMusic" class="edit-modal">
      <form @submit.prevent="handleSubmit">
        <h2>Edit Music</h2>
        <div class="form-group">
          <label>Title</label>
          <input type="text" v-model="form.title" />
        </div>
        <div class="form-group">
          <label>Artist</label>
          <input type="text" v-model="form.artist" />
        </div>
        <div class="form-group">
          <label>Album</label>
          <input type="text" v-model="form.album" />
        </div>
        <div class="form-group">
          <label>Genre</label>
          <input type="text" v-model="form.genre" />
        </div>
        <div class="button-group">
          <button type="submit" class="btn primary">Update</button>
          <button type="button" @click="closeEdit" class="btn secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import MusicList from '@/components/MusicList.vue';
import axios from 'axios';

export default {
  name: 'HomeView',
  components: {
    MusicList
  },
  data() {
    return {
      selectedMusic: null,
      form: {
        title: '',
        artist: '',
        album: '',
        genre: '',
      },
    };
  },
  methods: {
    handleEdit(music) {
      this.selectedMusic = music;
      this.form = {
        title: music.title || '',
        artist: music.artist || '',
        album: music.album || '',
        genre: music.genre || '',
      };
    },
    async handleSubmit() {
      try {
        await axios.patch(`http://localhost:5000/api/music/${this.selectedMusic._id}`, this.form);
        this.selectedMusic = null; // Zamknij modal po aktualizacji
      } catch (error) {
        console.error('Error updating music details:', error);
      }
    },
    closeEdit() {
      this.selectedMusic = null;
    },
    handlePlay(track) {
      this.$emit('play', track); // Wysyłanie zdarzenia do rodzica
    }
  }
};
</script>

<style>
.container {
  padding: 2rem;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px; /* Aby dodać miejsce na odtwarzacz */
}

h1 {
  color: #1DB954;
  text-align: center;
  padding-top: 20px;
}

.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: #2c2c2c;
  color: white;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.btn.primary {
  background-color: #1DB954;
  color: black;
  border: none;
}

.btn.primary:hover {
  background-color: #bb86fc;
}

.btn.secondary {
  background-color: #333;
  color: white;
  border: 1px solid #555;
}

.btn.secondary:hover {
  background-color: #555;
}
</style>
