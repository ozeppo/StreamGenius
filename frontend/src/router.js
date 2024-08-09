import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import UploadView from './views/UploadView.vue';
import ArtistView from './views/ArtistView.vue';
import AlbumView from './views/AlbumView.vue';
import PlaylistDetailView from './views/PlaylistDetailView.vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/artist/:artistName',
      name: 'Artist',
      component: ArtistView
    },
    {
      path: '/artist/:artistName/album/:albumName',
      name: 'Album',
      component: AlbumView
    },
    {
      path: '/upload',
      name: 'Upload',
      component: UploadView
    },
    {
      path: '/playlist/:playlistId',
      name: 'PlaylistDetail',
      component: PlaylistDetailView
    }
  ];
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  });
  
  export default router;
