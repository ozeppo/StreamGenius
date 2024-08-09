<template>
  <div id="app">
    <HeaderComponent />
    <div class="content-wrapper">
      <PlaylistSidebar />
      <div class="main-content">
        <router-view @play="playTrack"/>
      </div>
    </div>
    <MusicPlayer ref="player" />
  </div>
</template>

<script>
import MusicPlayer from './components/MusicPlayer.vue';
import PlaylistSidebar from './components/PlaylistSidebar.vue';
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  name: 'App',
  components: {
    MusicPlayer,
    PlaylistSidebar,
    HeaderComponent
  },
  methods: {
    playTrack(track) {
      this.$refs.player.playTrack(track);
    }
  }
};
</script>

<style>
body {
  font-family: 'Outfit', sans-serif;
  margin: 0;
  background-color: #121212;
  color: #FFFFFF;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
  width: 100%;
}

.main-content {
  flex-grow: 1;
  padding-bottom: 80px; /* Add space for the player */
  width: 100%;
  overflow-y: auto;
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
