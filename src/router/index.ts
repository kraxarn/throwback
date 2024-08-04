import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from "@/views/AuthView.vue";
import PlaylistsView from "@/views/PlaylistsView.vue";
import LobbyView from "@/views/LobbyView.vue";
import GameView from "@/views/GameView.vue";
import PrivacyView from "@/views/PrivacyView.vue";

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
		{
			path: "/lobby/:id",
			name: "lobby",
			component: LobbyView,
		},
		{
			path: "/game/:id",
			name: "game",
			component: GameView,
		},
		{
			path: "/privacy",
			name: "privacy",
			component: PrivacyView,
		},
	],
})

export default router
