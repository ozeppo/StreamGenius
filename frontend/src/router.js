import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import UploadView from './views/UploadView.vue';
import ArtistView from './views/ArtistView.vue';
import AlbumView from './views/AlbumView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadView,
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: ArtistView,
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: AlbumView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
