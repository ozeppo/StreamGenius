<template>
  <div class="search-results">
    <h2>Search Results for "{{ $route.query.query }}"</h2>

    <div v-if="matchingArtists.length">
      <h3>Matching Artists</h3>
      <div class="artist-grid">
        <div v-for="(artist, index) in matchingArtists" :key="index" class="artist-item">
          <router-link :to="{ name: 'Artist', params: { artistName: artist.name } }">
            <div class="artist-img-wrapper">
              <img
                v-if="artist.image"
                :src="artist.image"
                alt="Artist Image"
              />
              <i v-else class="fas fa-user-circle default-icon"></i>
            </div>
            <p>{{ artist.name }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="matchingAlbums.length">
      <h3>Matching Albums</h3>
      <div class="album-grid">
        <div v-for="(album, index) in matchingAlbums" :key="index" class="album-item">
          <router-link :to="{ name: 'Album', params: { artistName: album.artist, albumName: album.name } }">
            <div class="album-img-wrapper">
              <img
                v-if="album.image"
                :src="album.image"
                alt="Album Image"
              />
              <i v-else class="fas fa-compact-disc default-icon"></i>
            </div>
            <p>{{ album.name }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="matchingSongs.length">
      <h3>Matching Songs</h3>
      <MusicList
        :apiEndpoint="`http://localhost:5000/api/music/search?query=${$route.query.query}`"
        :title="'Songs matching ' + $route.query.query"
        @play="playTrack"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MusicList from '@/components/MusicList.vue';

export default {
  components: {
    MusicList
  },
  data() {
    return {
      matchingSongs: [],
      matchingArtists: [],
      matchingAlbums: []
    };
  },
  async created() {
    await this.searchMusic();
  },
  watch: {
    '$route.query.query': 'searchMusic'
  },
  methods: {
    async searchMusic() {
      try {
        const res = await axios.get('http://localhost:5000/api/music/search', { params: { query: this.$route.query.query } });
        const results = res.data;

        this.matchingSongs = results;

        // Usuwamy duplikaty artystów i albumów
        const uniqueArtists = new Map();
        const uniqueAlbums = new Map();

        results.forEach(song => {
          if (!uniqueArtists.has(song.artist)) {
            uniqueArtists.set(song.artist, {
              name: song.artist,
              image: song.artistImage
            });
          }
          if (!uniqueAlbums.has(song.album)) {
            uniqueAlbums.set(song.album, {
              name: song.album,
              artist: song.artist,
              image: song.albumImage
            });
          }
        });

        this.matchingArtists = Array.from(uniqueArtists.values());
        this.matchingAlbums = Array.from(uniqueAlbums.values());
      } catch (error) {
        console.error('Error searching music:', error);
      }
    },
    playTrack(track) {
      this.$emit('play', track);
    }
  }
};
</script>

<style scoped>
.search-results {
  padding: 20px;
  color: white;
}

.artist-grid, .album-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.artist-item, .album-item {
  text-align: center;
}

.artist-img-wrapper, .album-img-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-img-wrapper {
  border-radius: 10px;
}

.default-icon {
  font-size: 50px;
  color: #555;
}
</style>
