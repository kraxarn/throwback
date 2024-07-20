<script setup lang="ts">

import type {Playlist} from "@/spotify/SpotifyApi";

const props = defineProps<{
	playlist: Playlist;
}>()

defineEmits<{
	activated: [playlist: Playlist];
	deactivated: [];
}>()

const formatDescription = (): string => {
	// Remove HTML formatting
	const div = document.createElement("div")
	div.innerHTML = props.playlist.description
	return div.innerText
}

</script>

<template>
    <div class="backdrop" @click="$emit('deactivated')">
    </div>

    <div class="container">
        <div class="image-container">
            <img :src="playlist.images[0].url" :alt="playlist.name"/>
        </div>

        <h2>{{ playlist.name }}</h2>
        <h4>{{ formatDescription() }}</h4>

        <div class="button-container">
            <p v-if="playlist.tracks.total > 0">
                {{ playlist.tracks.total }}
                {{ playlist.tracks.total === 1 ? "track" : "tracks" }}
            </p>

            <button @click="$emit('deactivated')">
                Never mind
            </button>

            <button @click="$emit('activated', playlist)">
                Let's go!
            </button>
        </div>
    </div>
</template>

<style scoped>

h2, h4 {
    margin: 0;
}

img {
    border-radius: 6px;
    width: 20rem;
    height: 20rem;
}

h4 {
    max-width: 25rem;
}

.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px) brightness(60%);
}

.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-purple-darker);
    border: 6px solid var(--color-purple-dark);
    color: var(--color-purple-lightest);
    display: flex;
    flex-direction: column;
    border-radius: 32px;
    box-sizing: border-box;
    padding: 2rem;
}

.image-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 1rem;
}

.button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    column-gap: 1rem;
    margin-top: 2rem;

    p {
        flex: 1;
        color: var(--color-purple-lighter);
    }
}

</style>