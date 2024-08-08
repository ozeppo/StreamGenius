<template>
  <div v-if="sound" class="player">
    <div class="player-info">
      <span class="player-title">{{ currentTrack.title }}</span>
      <span class="player-artist">{{ currentTrack.artist }} | {{ currentTrack.album }}</span>
    </div>
    <div class="player-controls">
      <button @click="togglePlay">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="time-range"/>
      <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      <div class="volume-control" @mouseenter="showVolume = true" @mouseleave="hideVolume">
        <i class="fas fa-volume-up"></i>
        <input type="range" v-show="showVolume" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume" class="volume-range" />
      </div>
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler';

export default {
  name: 'MusicPlayer',
  data() {
    return {
      sound: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentTrack: {
        title: '',
        artist: '',
        album: ''
      },
      volume: 1.0,
      showVolume: false
    };
  },
  methods: {
    playTrack(track) {
      if (this.sound) {
        this.sound.unload();
      }
      this.currentTrack = track;
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
        onpause: () => {
          this.isPlaying = false;
        },
        onend: () => {
          this.isPlaying = false;
          this.currentTime = 0;
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
    }
  }
};
</script>

<style>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.player-info {
  flex: 1;
  color: white;
  text-align: left;
}

.player-title {
  display: block;
  font-weight: bold;
}

.player-artist {
  display: block;
  font-size: 0.875rem;
  color: #888;
}

.player-controls {
  display: flex;
  align-items: center;
  flex: 2;
  justify-content: center;
}

.player-controls button {
  background: none;
  border: none;
  color: #1DB954;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.player-controls button:hover {
  color: #bb86fc;
}

.player-controls .time-range {
  -webkit-appearance: none;
  width: 60%;
  height: 5px;
  background: #333;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
  margin: 0 1rem;
}

.player-controls .time-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}

.player-controls .time-range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}

.player-controls .time {
  color: #888;
  font-size: 0.875rem;
  margin-left: 1rem;
}

.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-control i {
  font-size: 1.5rem;
  cursor: pointer;
  color: #1DB954;
}

.volume-control .volume-range {
  position: absolute;
  bottom: 25px;
  right: 0;
  -webkit-appearance: none;
  width: 100px;
  height: 5px;
  background: #333;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
}

.volume-control:hover .volume-range,
.volume-control .volume-range:focus {
  display: block;
}

.volume-control .volume-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}

.volume-control .volume-range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1DB954;
  cursor: pointer;
}
</style>
