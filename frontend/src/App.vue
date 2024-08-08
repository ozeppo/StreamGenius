<template>
  <div id="app">
    <router-view @play="playTrack"/>
    <MusicPlayer ref="player" />
  </div>
</template>

<script>
import MusicPlayer from './components/MusicPlayer.vue';

export default {
  name: 'App',
  components: {
    MusicPlayer
  },
  methods: {
    playTrack(track) {
      this.$refs.player.playTrack(track);
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');

body {
  font-family: 'Outfit', sans-serif;
  margin: 0;
  background-color: #121212;
  color: #FFFFFF;
}

#app {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px; /* Aby dodać miejsce na odtwarzacz */
}

h1 {
  color: #1DB954;
  text-align: center;
  padding-top: 20px;
}

.container {
  padding: 20px;
}

a {
  color: #1DB954;
  text-decoration: none;
}

a:hover {
  color: #bb86fc;
}

button {
  font-family: 'Outfit', sans-serif;
}
</style>
