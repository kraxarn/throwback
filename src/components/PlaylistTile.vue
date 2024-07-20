<script setup lang="ts">

import {onMounted, ref} from "vue";
import {type Playlist, SpotifyApi} from "@/spotify/SpotifyApi";

const playlist = ref<Playlist>()

const props = defineProps<{
	playlistId?: string,
	playlist?: Playlist,
	spotifyApi: SpotifyApi,
}>()

onMounted(async () => {
	const api = props.spotifyApi
	if (!api || !props.playlistId) {
		return
	}

	try {
		playlist.value = await api.getPlaylist(props.playlistId)
	} catch (error) {
		alert(error)
	}
})

onMounted(() => {
	if (props.playlist) {
		playlist.value = props.playlist
	}
})

</script>

<template>
    <div class="tile" v-if="playlist">
        <img v-if="playlist" :src="playlist.images[0].url" :alt="playlist.name"/>
        <div class="title-container">
            <p>{{ playlist.name }}</p>
        </div>
    </div>
</template>

<style scoped>

.tile {
    width: 150px;
    height: 220px;
    border: 1px solid var(--color-blue-dark);
    cursor: pointer;

    display: flex;
    flex-direction: column;

    --border-radius: 16px;
}

.tile, img {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.tile, .title-container {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
}

.title-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background-color: var(--color-light-brown-lightest);
    color: var(--color-light-brown-darkest);
}

</style>