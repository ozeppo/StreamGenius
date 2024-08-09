// aiShuffle.js

/**
 * Funkcja sortująca utwory według podobieństwa na podstawie BPM, danceability, energy, artysty i albumu.
 * @param {Array} tracks - Tablica obiektów utworów do posortowania.
 * @returns {Array} - Posortowana tablica utworów.
 */
function aiShuffle(tracks) {
    // Funkcja obliczająca odległość między dwoma utworami na podstawie podanych parametrów
    function calculateDistance(track1, track2) {
      let distance = 0;
  
      // Waga dla każdego z kryteriów
      const weightBPM = 0.4;
      const weightDanceability = 0.2;
      const weightEnergy = 0.3;
      const weightArtist = 0.1;
      const weightAlbum = 0.1;
  
      // Różnica w BPM (z normalizacją)
      const bpmDiff = Math.abs(track1.bpm - track2.bpm) / 200;
      distance += weightBPM * bpmDiff;
  
      // Różnica w danceability (z normalizacją)
      const danceabilityDiff = Math.abs(track1.danceability - track2.danceability) / 100;
      distance += weightDanceability * danceabilityDiff;
  
      // Różnica w energy (z normalizacją)
      const energyDiff = Math.abs(track1.energy - track2.energy) / 100;
      distance += weightEnergy * energyDiff;
  
      // Różnica artystów (0 jeśli ten sam, 1 jeśli różny)
      const artistDiff = track1.artist === track2.artist ? 0 : 1;
      distance += weightArtist * artistDiff;
  
      // Różnica albumów (0 jeśli ten sam, 1 jeśli różny)
      const albumDiff = track1.album === track2.album ? 0 : 1;
      distance += weightAlbum * albumDiff;
  
      return distance;
    }
  
    // Sortowanie utworów metodą najbliższego sąsiada (Nearest Neighbor)
    const shuffledTracks = [tracks[0]]; // Rozpoczynamy od pierwszego utworu
    tracks.splice(0, 1);
  
    while (tracks.length > 0) {
      const lastTrack = shuffledTracks[shuffledTracks.length - 1];
      let closestTrackIndex = 0;
      let minDistance = calculateDistance(lastTrack, tracks[0]);
  
      // Znalezienie najbliższego utworu na podstawie obliczonej odległości
      for (let i = 1; i < tracks.length; i++) {
        const distance = calculateDistance(lastTrack, tracks[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestTrackIndex = i;
        }
      }
  
      // Dodanie najbliższego utworu do posortowanej listy
      shuffledTracks.push(tracks[closestTrackIndex]);
      tracks.splice(closestTrackIndex, 1);
    }
  
    return shuffledTracks;
  }
  
  module.exports = aiShuffle;
  