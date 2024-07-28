<script setup lang="ts">

import {type Component, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {type Playlist, SpotifyApi} from "@/spotify/SpotifyApi";
import {supabase} from "@/supabaseClient";
import Player from "@/components/Player.vue";
import type PlayerAvatar from "@/game/PlayerAvatar";
import BenderIcon from "@/components/icons/avatars/BenderIcon.vue";
import BmoIcon from "@/components/icons/avatars/BmoIcon.vue";
import EggmanIcon from "@/components/icons/avatars/EggmanIcon.vue";
import FinnIcon from "@/components/icons/avatars/FinnIcon.vue";
import FryIcon from "@/components/icons/avatars/FryIcon.vue";
import GunterIcon from "@/components/icons/avatars/GunterIcon.vue";
import JakeIcon from "@/components/icons/avatars/JakeIcon.vue";
import KermitIcon from "@/components/icons/avatars/KermitIcon.vue";
import LeelaIcon from "@/components/icons/avatars/LeelaIcon.vue";
import LlamaIcon from "@/components/icons/avatars/LlamaIcon.vue";
import MarcelineIcon from "@/components/icons/avatars/MarcelineIcon.vue";
import MortyIcon from "@/components/icons/avatars/MortyIcon.vue";
import RickIcon from "@/components/icons/avatars/RickIcon.vue";
import ShaggyIcon from "@/components/icons/avatars/ShaggyIcon.vue";
import SonicIcon from "@/components/icons/avatars/SonicIcon.vue";
import SpyroIcon from "@/components/icons/avatars/SpyroIcon.vue";
import TailsIcon from "@/components/icons/avatars/TailsIcon.vue";
import TotoroIcon from "@/components/icons/avatars/TotoroIcon.vue";

const errorMessage = ref<string>()

const playlist = ref<Playlist>()
const players = ref<PlayerAvatar[]>([])

const loadingTracks = ref<boolean>(true)
const totalTime = ref<string>("0m")
const fromYear = ref<number>(0)
const toYear = ref<number>(0)

const avatars: Component[] = [
	BenderIcon,
	BmoIcon,
	EggmanIcon,
	FinnIcon,
	FryIcon,
	GunterIcon,
	JakeIcon,
	KermitIcon,
	LeelaIcon,
	LlamaIcon,
	MarcelineIcon,
	MortyIcon,
	RickIcon,
	ShaggyIcon,
	SonicIcon,
	SpyroIcon,
	TailsIcon,
	TotoroIcon,
]

const router = useRouter()

const formatTime = (ms: number): string => {
	const minutes = Math.floor(ms / 1000 / 60)
	const hours = Math.floor(minutes / 60)

	return hours > 0
		? `${hours}h ${minutes % 60}m`
		: `${minutes}m`
}

const formatDescription = (): string => {
	// Remove HTML formatting
	const div = document.createElement("div")
	div.innerHTML = playlist.value?.description || ""
	return div.innerText
}

onMounted(async () => {
	const route = useRoute()

	const sessionResponse = await supabase.auth.getSession()
	const session = sessionResponse?.data.session
	if (!session) {
		errorMessage.value = sessionResponse.error?.message
		return
	}

	supabase.auth.getUser().then(response => {
		const user = response.data.user
		if (user) {
			const identity = user.identities ? user.identities[0].identity_data : undefined
			if (identity) {
				players.value.push({
					id: user.id,
					name: identity.full_name,
					avatar: identity.avatar_url,
				})
			}
		}
	})

	const api = new SpotifyApi(session)
	playlist.value = await api.getPlaylist(<string>route.params.id)

	let durationMs = 0
	let dateStart: Date | null = null
	let dateEnd: Date | null = null

	for await (const track of api.playlistTracks(playlist.value)) {
		durationMs += track.duration_ms

		const albumDate = new Date(track.album.release_date)
		if (!dateStart || albumDate < dateStart) {
			dateStart = albumDate
		}
		if (!dateEnd || albumDate > dateEnd) {
			dateEnd = albumDate
		}

		totalTime.value = formatTime(durationMs)
		fromYear.value = dateStart?.getFullYear()
		toYear.value = dateEnd?.getFullYear()
	}

	loadingTracks.value = false
})

const onCancel = () => {
	router.go(-1)
}

const onContinue = () => {
	router.push({
		name: "game",
		params: {
			id: playlist.value?.id,
		},
	})
}

const onAddPlayer = () => {
	players.value.push({
		id: `guest${players.value.length}`,
		name: `Guest ${players.value.length}`,
		avatar: avatars[Math.floor(Math.random() * avatars.length)],
	})
}

</script>

<template>
    <h1 v-if="!playlist">Loading playlist...</h1>
    <h3 id="error" v-if="errorMessage">{{ errorMessage }}</h3>

    <div id="container" v-if="playlist">
        <img :src="playlist.images[0].url" :alt="playlist.name"/>

        <p>Name:</p>
        <p>{{ playlist.name }}</p>

        <p>Owner:</p>
        <p>{{ playlist.owner.display_name }}</p>

        <p>Description:</p>
        <p>{{ formatDescription() }}</p>

        <p>Track count:</p>
        <p :class="{warning: playlist.tracks.total < 100}">{{ playlist.tracks.total }}</p>

        <p>Total time:</p>
        <p :class="{loading: loadingTracks}">
            {{ totalTime }}
        </p>

        <p>Year span:</p>
        <p :class="{loading: loadingTracks, warning: (toYear - fromYear) <= 50}">
            {{ fromYear }} - {{ toYear }}
        </p>
    </div>

    <h2>Game settings</h2>

    <h3>Players</h3>
    <div id="player-container" v-if="players.length > 0">
        <Player v-for="player in players" :player="player"/>
        <div id="add-player" v-if="players.length < 4" @click="onAddPlayer">
            <span>+</span>
        </div>
    </div>

    <h2 v-if="playlist">Sounds good?</h2>

    <div id="button-container" v-if="playlist">
        <button @click="onCancel">
            Nah, go back
        </button>

        <button :disabled="loadingTracks" @click="onContinue">
            Yeah!
        </button>
    </div>
</template>

<style scoped>

h2 {
    margin-top: 4rem;
}

h3 {
    margin-top: 2rem;
}

#error {
    color: var(--color-red-lighter);
}

p.warning:not(.loading):after {
    content: "(not recommended!)";
    font-size: 0.9em;
    font-style: italic;
    margin-left: 0.5rem;
    color: var(--color-red-lightest);
}

.loading {
    opacity: 0.9;
    font-style: italic;
}

#container {
    display: grid;
    grid-template-columns: repeat(2, auto) 1fr;
    grid-template-rows: repeat(5, auto) 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;

    img {
        border-radius: 8px;
        grid-row-start: 1;
        grid-row-end: 7;
        width: 200px;
        height: 200px;
    }

    p {
        margin: 0;
    }
}

#player-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    column-gap: 1.5rem;
}

#add-player {
    height: 88px;
    font-size: 4em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
}

#button-container {
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
}

</style>