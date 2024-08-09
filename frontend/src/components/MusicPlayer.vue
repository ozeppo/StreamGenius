<template>
  <div v-if="isPlaying || sound" class="player">
    <div class="player-info">
      <div class="album-art">
        <img :src="currentTrack?.albumArt || '/path/to/default-art.png'" alt="Album Art" />
      </div>
      <div class="track-details">
        <span class="player-title">{{ currentTrack?.title || 'Unknown Title' }}</span>
        <span class="player-artist">{{ currentTrack?.artist || 'Unknown Artist' }} | {{ currentTrack?.album || 'Unknown Album' }}</span>
      </div>
    </div>
    <div class="player-controls">
      <div class="control-buttons">
        <button @click="prevTrack"><i class="fas fa-backward"></i></button>
        <button @click="togglePlay">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button @click="nextTrack"><i class="fas fa-forward"></i></button>
      </div>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="time-range" />
      <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
    <div class="player-options">
      <button @click="setPlayerMode('loop')" :class="{ active: musicPlayerMode === 'loop' }">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button @click="setPlayerMode('shuffle')" :class="{ active: musicPlayerMode === 'shuffle' }">
        <i class="fas fa-random"></i>
      </button>
      <button @click="setPlayerMode('aiShuffle')" :class="{ active: musicPlayerMode === 'aiShuffle' }">
        <i class="fas fa-brain"></i>
      </button>
      <div class="queue-control" @mouseenter="showQueue = true" @mouseleave="hideQueue">
        <i class="fas fa-list"></i>
        <div v-show="showQueue" class="queue-list">
          <p v-if="upcomingTracks.length === 0">No upcoming tracks</p>
          <ul>
            <li v-for="(track, index) in upcomingTracks" :key="index">
              {{ track.title || 'Untitled' }} - {{ track.artist || 'Unknown Artist' }}
            </li>
          </ul>
        </div>
      </div>
      <div class="volume-control" @mouseenter="showVolume = true" @mouseleave="hideVolume">
        <i class="fas fa-volume-up"></i>
        <input type="range" v-show="showVolume" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume" class="volume-range" />
      </div>
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler';
import aiShuffle from '@/utils/aiShuffle';

export default {
  name: 'MusicPlayer',
  data() {
    return {
      sound: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentTrack: null,
      volume: 1.0,
      showVolume: false,
      musicPlayerMode: 'normal',
      showQueue: false,
      playlist: [],
      currentIndex: 0
    };
  },
  created() {
    const savedQueue = localStorage.getItem('currentlyPlayingTrackQueue');
    if (savedQueue) {
      this.playlist = JSON.parse(savedQueue);
    }
    this.musicPlayerMode = localStorage.getItem('musicPlayerMode') || 'normal';
  },
  computed: {
    upcomingTracks() {
      return this.playlist.slice(this.currentIndex + 1, this.currentIndex + 6);
    }
  },
  methods: {
    playTrack(track, playlist = [], startIndex = 0) {
      if (this.sound) {
        this.sound.unload();
      }
      if (playlist.length > 0) {
        this.playlist = playlist;
        this.currentIndex = startIndex;
        if (this.musicPlayerMode === 'aiShuffle') {
          this.playlist = aiShuffle(this.playlist);
        }
        localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(this.playlist));
      }
      this.currentTrack = track || this.playlist[this.currentIndex] || {};
      this.loadAndPlayTrack(this.currentTrack);
    },
    loadAndPlayTrack(track) {
      if (!track || !track._id) {
        console.error("Invalid track data:", track);
        return;
      }
      this.sound = new Howl({
        src: [`http://localhost:5000/api/music/stream/${track._id}`],
        html5: true,
        onload: () => {
          this.duration = this.sound.duration();
        },
        onplay: () => {
          this.isPlaying = true;
          requestAnimationFrame(this.step);
        },
        onend: () => {
          this.isPlaying = false;
          this.currentTime = 0;
          this.onTrackEnded();
        }
      });
      this.sound.play();
      this.sound.volume(this.volume);
    },
    togglePlay() {
      if (this.isPlaying) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    seek() {
      if (this.sound) {
        this.sound.seek(this.currentTime);
      }
    },
    step() {
      if (this.sound) {
        this.currentTime = this.sound.seek();
        if (this.isPlaying) {
          requestAnimationFrame(this.step);
        }
      }
    },
    changeVolume() {
      if (this.sound) {
        this.sound.volume(this.volume);
      }
    },
    hideVolume() {
      setTimeout(() => {
        this.showVolume = false;
      }, 2000);
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },
    setPlayerMode(mode) {
      this.musicPlayerMode = this.musicPlayerMode === mode ? 'normal' : mode;
      localStorage.setItem('musicPlayerMode', this.musicPlayerMode);
      if (this.musicPlayerMode === 'aiShuffle') {
        this.playlist = aiShuffle(this.playlist);
        localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(this.playlist));
      }
    },
    prevTrack() {
      if (this.musicPlayerMode === 'shuffle' || this.musicPlayerMode === 'aiShuffle') {
        this.shuffleTrack();
      } else {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        this.playTrack(this.playlist[this.currentIndex]);
      }
    },
    nextTrack() {
      if (this.musicPlayerMode === 'shuffle' || this.musicPlayerMode === 'aiShuffle') {
        this.shuffleTrack();
      } else {
        this.currentIndex = this.currentIndex < this.playlist.length - 1 ? this.currentIndex + 1 : 0;
        this.playTrack(this.playlist[this.currentIndex]);
      }
    },
    onTrackEnded() {
      if (this.musicPlayerMode === 'loop') {
        this.playTrack(this.currentTrack);
      } else {
        this.nextTrack();
      }
    },
    shuffleTrack() {
      const shuffledIndex = Math.floor(Math.random() * this.playlist.length);
      this.currentIndex = shuffledIndex;
      this.playTrack(this.playlist[shuffledIndex]);
    },
    hideQueue() {
      setTimeout(() => {
        this.showQueue = false;
      }, 2000);
    }
  },
  watch: {
    currentTrack(newTrack) {
      if (newTrack && newTrack._id) {
        localStorage.setItem('currentlyPlayingTrack', JSON.stringify(newTrack));
      }
    }
  }
};
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.player-info {
  display: flex;
  align-items: center;
  flex: 0.25;
  color: white;
  text-align: left;
}

.album-art {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 5px;
  overflow: hidden;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-details {
  overflow: hidden;
}

.player-title {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-artist {
  font-size: 0.875rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  align-items: center;
  flex: 0.5;
  justify-content: center;
  flex-direction: column;
}

.control-buttons {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.control-buttons button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0 10px;
}

.control-buttons button:hover {
  color: #1DB954;
}

.time-range {
  width: 100%;
  height: 5px;
  background: #333;
  border-radius: 5px;
  outline: none;
}

.time-range::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
  -webkit-appearance: none;
}

.time-range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}

.time {
  color: #888;
  font-size: 0.875rem;
  margin-left: 10px;
}

.player-options {
  display: flex;
  align-items: center;
  flex: 0.25;
  justify-content: flex-end;
}

.player-options button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 10px;
}

.player-options button.active {
  color: #1DB954;
}

.queue-control {
  position: relative;
  display: inline-block;
}

.queue-list {
  position: absolute;
  bottom: 50px;
  right: 0;
  background-color: #1e1e1e;
  border: 1px solid #1DB954;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
}

.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-range {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 100px;
  height: 5px;
  background: #333;
  border-radius: 5px;
  outline: none;
  display: none;
}

.volume-control:hover .volume-range,
.volume-control .volume-range:focus {
  display: block;
}

.volume-range::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
  -webkit-appearance: none;
}

.volume-range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}
</style>
