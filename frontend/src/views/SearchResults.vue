<template>
    <div class="search-results">
      <h2>Search Results for "{{ $route.query.query }}"</h2>
  
      <div v-if="matchingArtists">
        <h3>Matching Artists</h3>
        <div class="artist-grid">
          <div v-for="artist in matchingArtists" :key="artist" class="artist-item">
            <router-link :to="{ name: 'Artist', params: { artistName: artist } }">
              <img :src="getArtistArtUrl(artist)" alt="Artist Art" class="artist-img" />
              <p>{{ artist }}</p>
            </router-link>
          </div>
        </div>
      </div>
  
      <div v-if="matchingAlbums">
        <h3>Matching Albums</h3>
        <div class="album-grid">
          <div v-for="album in matchingAlbums" :key="album" class="album-item">
            <router-link :to="{ name: 'Album', params: { artistName: getArtistForAlbum(album), albumName: album } }">
              <img :src="getAlbumArtUrl(album)" alt="Album Art" />
              <p>{{ album }}</p>
            </router-link>
          </div>
        </div>
      </div>
  
      <div v-if="matchingSongs">
        <h3>Matching Songs</h3>
        <MusicList :musicList="matchingSongs" :title="'Songs matching ' + $route.query.query" @play="playTrack" />
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
          const res = await axios.get('http://localhost:5000/api/music/search', {
            params: { query: this.$route.query.query }
          });
          this.matchingSongs = res.data.matchingSongs;
          this.matchingArtists = res.data.matchingArtists;
          this.matchingAlbums = res.data.matchingAlbums;
        } catch (error) {
          console.error('Error searching music:', error);
        }
      },
      getArtistForAlbum(album) {
        const song = this.matchingSongs.find(song => song.album === album);
        return song ? song.artist : 'Unknown Artist';
      },
      getAlbumArtUrl(album) {
        const artistName = this.getArtistForAlbum(album);
        return `http://localhost:5000/api/image/check?type=album&artistName=${artistName}&albumName=${album}`;
      },
      getArtistArtUrl(artist) {
        return `http://localhost:5000/api/image/check?type=artist&artistName=${artist}`;
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
  
  .search-results h2 {
    color: #1DB954;
  }
  
  .search-results h3 {
    margin-top: 20px;
    color: #bb86fc;
  }
  
  .search-results ul {
    list-style: none;
    padding: 0;
  }
  
  .search-results li {
    margin: 5px 0;
  }
  
  .search-results li a {
    color: #1DB954;
    text-decoration: none;
  }
  
  .search-results li a:hover {
    color: #bb86fc;
  }
  
  .album-grid,
  .artist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 10px;
  }
  
  .album-item,
  .artist-item {
    text-align: center;
  }
  
  .album-item img,
  .artist-item img {
    width: 100%;
    border-radius: 5px;
  }
  
  .artist-item img {
    border-radius: 50%;
  }
  </style>
  