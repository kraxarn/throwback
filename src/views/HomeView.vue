<script setup lang="ts">
import {supabase} from "@/supabaseClient";
import SpotifyIcon from "@/components/icons/SpotifyIcon.vue";

const signInSpotify = async () => {
	const scopes = [
		// For showing currently playing music
		"user-read-currently-playing",
		"user-read-playback-state",
		// Playing new music
		"user-modify-playback-state",
		// Reading user's playlists
		"playlist-read-collaborative",
		"playlist-read-private",
		// Playing in browser without a client
		"streaming",
		// Check for Spotify Premium
		"user-read-private",
		"user-read-email",
	]

	const response = await supabase.auth.signInWithOAuth({
		provider: "spotify",
		options: {
			scopes: scopes.join(" "),
			redirectTo: `${location.origin}/auth`,
		},
	})

	if (response.error) {
		alert(response.error.message)
	}
}

</script>

<template>
    <main>
        <h1>Welcome!</h1>
        <p>Before continuing, please sign in to Spotify</p>

        <button @click="signInSpotify">
            <SpotifyIcon/>
            Sign in with Spotify
        </button>
    </main>
</template>

<style scoped>

button {
    display: flex;
    flex-direction: row;
    align-items: center;
}

</style>