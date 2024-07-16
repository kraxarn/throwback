<script setup lang="ts">
import {cipher} from "@/cipher";
import client from "@/spotify/client.json"

const signIn = () => {
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
		// "user-read-email",
	]

	const url = new URL("https://accounts.spotify.com/authorize")
	url.searchParams.set("response_type", "code")
	url.searchParams.set("scope", scopes.join(" "))
	url.searchParams.set("redirect_uri", `${location.origin}/auth`)

	url.searchParams.set("client_id", cipher(client.slice(0, client.length / 2))
		.reduce((value, current) => value + String.fromCharCode(current), ""))

	location.href = url.href
}

</script>

<template>
    <main>
        <h1>Welcome!</h1>

        <p>
            Before continuing, please sign in to Spotify
        </p>

        <button @click="signIn">
            Sign in to Spotify
        </button>
    </main>
</template>
