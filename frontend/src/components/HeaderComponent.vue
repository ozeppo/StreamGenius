<template>
  <!-- Header section of the application -->
  <header class="app-header">
    <!-- Link to the home page with the application name -->
    <router-link to="/" class="app-name">StreamGenius</router-link>
    
    <!-- Search form to allow users to search for songs, artists, albums -->
    <form @submit.prevent="performSearch" class="search-form">
      <!-- Input field for the search query -->
      <input type="text" v-model="searchQuery" placeholder="Search for songs, artists, albums..." />
      <!-- Button to submit the search query -->
      <button type="submit"><i class="fas fa-search"></i></button>
    </form>
    
    <!-- Link to the upload page (e.g., for uploading new songs) -->
    <router-link to="Upload" class="uploadButton">+</router-link>
  </header>
</template>

<script>
export default {
  data() {
    return {
      // Search query entered by the user
      searchQuery: ''
    };
  },
  methods: {
    // Method to handle search functionality
    performSearch() {
      // Redirects the user to the search results page with the search query as a parameter
      this.$router.push({ name: 'SearchResults', query: { query: this.searchQuery } });
    }
  }
};
</script>

<style scoped>
/* Styling for the header section */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #121212;
  color: white;
}

/* Styling for the application name link */
.app-name {
  font-size: 1.5rem;
  color: #1DB954;
  text-decoration: none;
  justify-content: right;
}

/* Styling for the search form */
.search-form {
  display: flex;
  align-items: center;
  width: 87%;
  justify-content: center;
}

/* Styling for the search input field */
.search-form input {
  padding: 5px 10px;
  border: 1px solid #333;
  background-color: #1e1e1e;
  color: white;
  width: 100%;
  height: 40px;
}

/* Styling for the search button */
.search-form button {
  background: none;
  border: none;
  color: #1DB954;
  cursor: pointer;
  margin-left: 10px;
}

/* Styling for the upload button */
.uploadButton {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
</style>
