import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from "@/views/AuthView.vue";
import PlaylistsView from "@/views/PlaylistsView.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: "/auth",
			name: "auth",
			component: AuthView,
		},
		{
			path: "/playlists",
			name: "playlists",
			component: PlaylistsView,
		},
	],
})

export default router
