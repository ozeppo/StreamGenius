<template>
    <header class="app-header">
      <router-link to="/" class="app-name">StreamGenius</router-link>
      <form @submit.prevent="performSearch" class="search-form">
        <input type="text" v-model="searchQuery" placeholder="Search for songs, artists, albums..." />
        <button type="submit"><i class="fas fa-search"></i></button>
      </form>
      <router-link to="Upload" class="uploadButton">+</router-link>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: ''
      };
    },
    methods: {
      performSearch() {
        this.$router.push({ name: 'SearchResults', query: { query: this.searchQuery } });
      }
    }
  };
  </script>
  
  <style scoped>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #121212;
    color: white;
  }
  
  .app-name {
    font-size: 1.5rem;
    color: #1DB954;
    text-decoration: none;
    justify-content: right;
  }
  
  .search-form {
    display: flex;
    align-items: center;
    width: 87%;
    justify-content: center;
  }
  
  .search-form input {
    padding: 5px 10px;
    border: 1px solid #333;
    background-color: #1e1e1e;
    color: white;
    width: 100%;
    height: 40px;
  }
  
  .search-form button {
    background: none;
    border: none;
    color: #1DB954;
    cursor: pointer;
    margin-left: 10px;
  }

  .uploadButton{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }
  </style>
  