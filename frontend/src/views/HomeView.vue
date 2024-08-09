<template>
  <div class="home-view">
    <section class="home-section">
      <h2>Featured Albums</h2>
      <div class="album-grid">
        <div v-for="album in albums" :key="album.name" class="album-card">
          <router-link :to="{ name: 'Album', params: { artistName: album.artist, albumName: album.name } }">
            <div class="album-image-container">
              <img v-if="album.hasImage" :src="album.imageUrl" alt="Album Image" class="album-image" />
              <div v-else class="placeholder-icon">
                <i class="fas fa-compact-disc"></i> <!-- Album icon -->
              </div>
            </div>
            <p class="album-title">{{ album.name }}</p>
            <p class="album-artist">{{ album.artist }}</p>
          </router-link>
        </div>
      </div>
    </section>
    
    <section class="home-section">
      <h2>Featured Playlists</h2>
      <div class="playlist-grid">
        <div v-for="playlist in playlists" :key="playlist._id" class="playlist-card">
          <router-link :to="{ name: 'PlaylistDetail', params: { playlistId: playlist._id } }">
            <div class="playlist-image-container">
              <img v-if="playlist.hasImage" :src="playlist.imageUrl" alt="Playlist Image" class="playlist-image" />
              <div v-else class="placeholder-icon">
                <i class="fas fa-music"></i> <!-- Ikona playlisty -->
              </div>
            </div>
            <p class="playlist-title">{{ playlist.name }}</p>
          </router-link>
        </div>
      </div>
    </section>
    
    <section class="home-section">
      <h2>Featured Artists</h2>
      <div class="artist-grid">
        <div v-for="artist in artists" :key="artist.name" class="artist-card">
          <router-link :to="{ name: 'Artist', params: { artistName: artist.name } }">
            <div class="artist-image-container">
              <img v-if="artist.hasImage" :src="artist.imageUrl" alt="Artist Image" class="artist-image" />
              <div v-else class="placeholder-icon artist-placeholder">
                <i class="fas fa-user"></i> <!-- Ikona artysty -->
              </div>
            </div>
            <p class="artist-name">{{ artist.name }}</p>
          </router-link>
        </div>
      </div>
    </section>
    
    <section class="home-section">
      <MusicList :apiEndpoint="`http://localhost:5000/api/music`" title="All Songs" @play="playTrack" />
    </section>
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
      albums: [],
      playlists: [],
      artists: [],
    };
  },
  async created() {
    await this.fetchHomeData();
  },
  methods: {
    async fetchHomeData() {
      try {
        const [albumsRes, playlistsRes, artistsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/home/albums'),
          axios.get('http://localhost:5000/api/home/playlists'),
          axios.get('http://localhost:5000/api/home/artists'),
        ]);

        this.albums = albumsRes.data;
        this.playlists = playlistsRes.data;
        this.artists = artistsRes.data;
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    },
    playTrack(track) {
      this.$emit('play', track);
    }
  }
};
</script>

<style>
.home-view {
  padding: 2rem;
}

.home-section {
  margin-bottom: 3rem;
}

.album-grid, .playlist-grid, .artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.album-card, .playlist-card, .artist-card {
  text-align: center;
}

.album-image-container, .playlist-image-container {
  width: 100%;
  height: 150px;
  position: relative;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.artist-image-container {
  width: 100%;
  height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-image, .playlist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.placeholder-icon {
  color: #1DB954;
  font-size: 3rem;
}

.artist-placeholder {
  border-radius: 50%;
  background-color: #333;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-title, .playlist-title, .artist-name {
  font-weight: bold;
  margin-top: 0.5rem;
}

.album-artist {
  color: #888;
}
</style>
