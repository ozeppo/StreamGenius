<template>
  <!-- Music player container that only shows if a track is playing or if sound is initialized -->
  <div v-if="isPlaying || sound" class="player">
    <div class="player-info">
      <!-- Album art or a default icon if no album art is available -->
      <div class="album-art">
        <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album Art" />
        <div v-else class="default-album-art">
          <i class="fas fa-compact-disc"></i>
        </div>
      </div>
      <div class="track-details">
        <!-- Display track title and artist/album details -->
        <span class="player-title">{{ currentTrack?.title || 'Unknown Title' }}</span><br>
        <span class="player-artist">{{ currentTrack?.artist || 'Unknown Artist' }} | {{ currentTrack?.album || 'Unknown Album' }}</span>
      </div>
    </div>

    <div class="player-controls">
      <div class="control-buttons">
        <!-- Previous track button -->
        <button @click="prevTrack"><i class="fas fa-backward"></i></button>
        <!-- Play/pause button based on current state -->
        <button v-if="isPlaying" @click="togglePlay">
          <i class="fas fa-pause"></i>
        </button>
        <button v-else @click="togglePlay">
          <i class="fas fa-play"></i>
        </button>
        <!-- Next track button -->
        <button @click="nextTrack"><i class="fas fa-forward"></i></button>
      </div>
      <!-- Track progress bar -->
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="time-range" />
      <!-- Display current time and total duration -->
      <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>

    <div class="player-options">
      <!-- AI shuffle button with tooltip -->
      <div class="ai-shuffle-container" @click="aiShuffleQueue" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <button>
          <i class="fas fa-brain"></i>
        </button>
        <!-- Tooltip text -->
        <div v-if="showTooltip" class="tooltip">
          Click here to have the artificial intelligence sort your play queue.
        </div>
      </div>
      <!-- Loop and shuffle buttons -->
      <button @click="setPlayerMode('loop')" :class="{ active: musicPlayerMode === 'loop' }">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button @click="setPlayerMode('shuffle')" :class="{ active: musicPlayerMode === 'shuffle' }">
        <i class="fas fa-random"></i>
      </button>
      <!-- Queue display with upcoming tracks -->
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
      <!-- Button that navigates to Lyrics view -->
      <div class="lyrics-button" @click="goToLyrics">
        <i class="fas fa-microphone-alt"></i>  
      </div>
      <!-- Volume control -->
      <div class="volume-control" @mouseenter="showVolume = true" @mouseleave="hideVolume">
        <i class="fas fa-volume-up"></i>
        <input type="range" v-show="showVolume" min="0" max="1" step="0.01" v-model="volume" @input="changeVolume" class="volume-range" />
      </div>
    </div>
    <!-- Popup message displayed when AI shuffle is activated -->
    <div v-if="showPopup" class="popup">
      Congratulations. The AI has just sorted your queue so that the most similar songs play next to each other.
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler'; // Import Howler.js library for audio playback
import aiShuffle from '@/utils/aiShuffle'; // Import AI shuffle utility function
import axios from 'axios'; // Import axios for API requests

export default {
  name: 'MusicPlayer',
  data() {
    return {
      sound: null, // Howl.js sound object
      isPlaying: false, // Boolean to track if music is playing
      currentTime: 0, // Current time of the track
      duration: 0, // Total duration of the track
      currentTrack: null, // Currently playing track details
      volume: 1.0, // Volume level
      showVolume: false, // Boolean to show/hide volume control
      musicPlayerMode: 'normal', // Current player mode (normal, loop, shuffle)
      showQueue: false, // Boolean to show/hide queue
      showTooltip: false, // Boolean to show/hide tooltip
      showPopup: false, // Boolean to show/hide popup message
      playlist: [], // Array of tracks in the current playlist
      currentIndex: 0, // Index of the currently playing track
      albumArtUrl: null, // URL of the album art
    };
  },
  created() {
    // Load the currently playing track queue from localStorage on component creation
    const savedQueue = localStorage.getItem('currentlyPlayingTrackQueue');
    if (savedQueue) {
      this.playlist = JSON.parse(savedQueue);
    }
    // Load the saved music player mode from localStorage
    this.musicPlayerMode = localStorage.getItem('musicPlayerMode') || 'normal';
  },
  computed: {
    // Compute the list of upcoming tracks in the queue
    upcomingTracks() {
      return this.playlist.slice(this.currentIndex + 1, this.currentIndex + 6);
    }
  },
  watch: {
    // Watcher to update album art when the current track changes
    currentTrack(newTrack) {
      if (newTrack && newTrack._id) {
        localStorage.setItem('currentlyPlayingTrack', JSON.stringify(newTrack));
        this.fetchAlbumArt(newTrack.album, newTrack.artist);
      }
    }
  },
  methods: {
    // Fetch the album art for the current track from the server
    async fetchAlbumArt(albumName, artistName) {
      try {
        const response = await axios.get(`http://localhost:5000/api/image/check`, {
          params: { 'type': 'album', 'artistName': artistName, 'albumName': albumName  },
        });
        this.albumArtUrl = response.data.imagePath
          ? `http://localhost:5000/${response.data.imagePath}`
          : null;
      } catch (error) {
        console.error('Error fetching album art:', error);
        this.albumArtUrl = null;
      }
    },
    // Play the selected track and load the playlist
    playTrack(track, playlist = [], startIndex = 0) {
      if (this.sound) {
        this.sound.unload();
      }
      if (playlist.length > 0) {
        this.playlist = playlist;
        this.currentIndex = startIndex;
        localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(this.playlist));
      } else {
        const savedQueue = localStorage.getItem('currentlyPlayingTrackQueue');
        if (savedQueue) {
          this.playlist = JSON.parse(savedQueue);
        }
      }
      this.currentTrack = track || this.playlist[this.currentIndex] || {};
      this.loadAndPlayTrack(this.currentTrack);
    },
    // Load and play the selected track using Howler.js
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
    // Toggle play/pause state
    togglePlay() {
      if (this.isPlaying) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    // Seek to a specific time in the track
    seek() {
      if (this.sound) {
        this.sound.seek(this.currentTime);
      }
    },
    // Update the current time of the track while playing
    step() {
      if (this.sound) {
        this.currentTime = this.sound.seek();
        if (this.isPlaying) {
          requestAnimationFrame(this.step);
        }
      }
    },
    // Change the volume of the track
    changeVolume() {
      if (this.sound) {
        this.sound.volume(this.volume);
      }
    },
    // Hide the volume control after a delay
    hideVolume() {
      setTimeout(() => {
        this.showVolume = false;
      }, 2000);
    },
    // Format time in MM:SS format
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },
    // Set the player mode (normal, loop, shuffle)
    setPlayerMode(mode) {
      this.musicPlayerMode = this.musicPlayerMode === mode ? 'normal' : mode;
      localStorage.setItem('musicPlayerMode', this.musicPlayerMode);
    },
    // Shuffle the playlist using AI and show a popup message
    aiShuffleQueue() {
      this.playlist = aiShuffle([...this.playlist]);
      localStorage.setItem('currentlyPlayingTrackQueue', JSON.stringify(this.playlist));
      this.showPopupMessage();
    },
    // Show the popup message for AI shuffle
    showPopupMessage() {
      this.showPopup = true;
      setTimeout(() => {
        this.showPopup = false;
      }, 3000);
    },
    // Play the previous track in the queue
    prevTrack() {
      this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
      this.playTrack(this.playlist[this.currentIndex]);
    },
    // Play the next track in the queue
    nextTrack() {
      this.currentIndex = this.currentIndex < this.playlist.length - 1 ? this.currentIndex + 1 : 0;
      this.playTrack(this.playlist[this.currentIndex]);
    },
    // Handle the event when a track ends
    onTrackEnded() {
      if (this.musicPlayerMode === 'loop') {
        this.playTrack(this.currentTrack);
      } else {
        this.nextTrack();
      }
    },
    // Hide the queue after a delay
    hideQueue() {
      setTimeout(() => {
        this.showQueue = false;
      }, 2000);
    },
    goToLyrics() {
      this.$router.push({ name: 'LyricsView' });
    },
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
  overflow: hidden;
}

.album-art {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-art i {
  font-size: 24px;
  color: #1DB954;
}

.track-details {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  max-width: 400px;
  width: 100%;
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
  z-index: 999;
  overflow-y: auto;
  max-height: 150px;
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

.ai-shuffle-container {
  position: relative;
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 0.8rem;
}

.popup {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1DB954;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
  z-index: 1000;
}
</style>
