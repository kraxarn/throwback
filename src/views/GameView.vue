<script setup lang="ts">

import SmallCard from "@/components/SmallCard.vue";
import BigCard from "@/components/BigCard.vue";
import InsertCard from "@/components/InsertCard.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faMedal, faPause, faPlay, faRefresh} from "@fortawesome/free-solid-svg-icons";
import {onMounted, ref} from "vue";
import {type Playlist, SpotifyApi, type Track} from "@/spotify/SpotifyApi";
import {supabase} from "@/supabaseClient";
import {GameApi} from "@/supabase/GameApi";
import {useRoute} from "vue-router";
import type {Player} from "@/game/Player";
import {getPosition, type Position} from "@/game/Position";
import type {RealtimePostgresInsertPayload} from "@supabase/supabase-js";
import type {Round} from "@/game/Round";

const api = new GameApi()
let spotify: SpotifyApi

let trackCount = 0
let matchId = ""
let playlist: Playlist

const players = ref<Player[]>([])
const currentPlayer = ref<number>(0)
const currentTrackIndex = ref<number>()
const currentPosition = ref<Position>("bottom")

const progressMs = ref<number>(0)
const durationMs = ref<number>(0)
const isPlaying = ref<boolean>(false)
const isGuessing = ref<boolean>(false)

onMounted(async () => {
	const route = useRoute()
	matchId = <string>route.params.id

	const sessionResponse = await supabase.auth.getSession()
	const session = sessionResponse?.data.session
	if (!session) {
		return
	}

	spotify = new SpotifyApi(session)
	const playlistId = await api.getPlaylistId(matchId)
	playlist = await spotify.getPlaylist(playlistId)
	trackCount = playlist.tracks.total

	const playerCount = await api.getPlayerCount(matchId)
	for (let i = 0; i < playerCount; i++) {
		players.value?.push({
			position: getPosition(playerCount, i),
			cards: [],
		})
		await drawCard(i)
	}

	await play()
	await refresh()

	supabase
		.channel("supabase_realtime")
		.on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "rounds"
		}, onRoundInsert)
		.subscribe()
})

const nextCardIndex = async (): Promise<number> => {
	let trackIndex = Math.floor(Math.random() * trackCount);
	let ok = false;

	while (!ok) {
		trackIndex = (trackIndex + 1) % trackCount
		ok = !(await api.isTrackIndexUsed(matchId, trackIndex))
	}

	return trackIndex
}

const drawCard = async (playerIndex: number): Promise<void> => {
	const trackIndex = await nextCardIndex()
	const track = await spotify.playlistTrack(playlist, trackIndex)
	players.value[playerIndex].cards.push(track)
}

const getArtistNames = (track: Track): string => {
	return track.artists
		.map(artist => artist.name)
		.join(", ")
}

const getAlbumYear = (track: Track): number => {
	const date = new Date(track.album.release_date)
	return date.getFullYear()
}

const formatTime = (ms: number): string => {
	const seconds = Math.floor(ms / 1000) % 60
	const minutes = Math.floor(ms / 1000 / 60)

	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const refresh = async () => {
	const state = await spotify.playbackState()
	progressMs.value = state.progress_ms
	durationMs.value = state.item.duration_ms
	isPlaying.value = state.is_playing

	setTimeout(() => refresh(), 1000)
}

const play = async () => {
	const contextUri = `spotify:playlist:${playlist.id}`
	const offset = await nextCardIndex()
	const track = await spotify.playlistTrack(playlist, offset)
	await spotify.play(contextUri, `spotify:track:${track.id}`)
	currentTrackIndex.value = offset
}

const guess = async (index: number) => {
	if (!currentTrackIndex.value) {
		console.warn("no current track index")
		return
	}

	const track = await spotify.playlistTrack(playlist, currentTrackIndex.value)
	const trackDate = new Date(track.album.release_date)
	const trackYear = trackDate.getFullYear()

	const playerCards = players.value[currentPlayer.value].cards
	const afterCard = playerCards[index - 1]
	const beforeCard = playerCards[index]

	let correct = true

	if (afterCard) {
		const afterDate = new Date(afterCard.album.release_date)
		const afterYear = afterDate.getFullYear()
		correct = afterYear <= trackYear
	}

	if (correct && beforeCard) {
		const beforeDate = new Date(beforeCard.album.release_date)
		const beforeYear = beforeDate.getFullYear()
		correct = beforeYear >= trackYear
	}

	isGuessing.value = true

	await api.insertRound(matchId,
		currentPlayer.value,
		currentTrackIndex.value,
		correct
	)
}

const onRoundInsert = async (payload: RealtimePostgresInsertPayload<Round>) => {
	const round = payload.new

	if (round.match_id !== matchId) {
		return
	}

	if (round.success) {
		const playerCards = players.value[currentPlayer.value].cards
		const track = await spotify.playlistTrack(playlist, round.track_index)

		playerCards.push(track)
		playerCards.sort((card1, card2) => {
			const date1 = new Date(card1.album.release_date)
			const date2 = new Date(card2.album.release_date)

			if (date1 > date2) {
				return 1
			} else if (date1 < date2) {
				return -1
			} else {
				return 0
			}
		})
	}

	currentPlayer.value = (currentPlayer.value + 1) % players.value.length
	currentPosition.value = getPosition(players.value.length, currentPlayer.value)

	await play()
	isGuessing.value = false
}

const onPlayPause = async () => {
	if (isPlaying.value) {
		await spotify.pause()
	} else {
		await spotify.resume()
	}
	isPlaying.value = !isPlaying.value
}

</script>

<template>
    <div id="container">
        <div id="indicator" :class="currentPosition"></div>
        <div id="dashboard" :class="currentPosition">
            <span>
                {{ formatTime(progressMs) }} / {{ formatTime(durationMs) }}
            </span>
            <FontAwesomeIcon :icon="isPlaying ? faPause : faPlay" @click="onPlayPause"/>
        </div>

        <template v-for="(player, playerIndex) in players">
            <div :id="player.position" class="hand">
                <template v-if="playerIndex === currentPlayer" v-for="(card, cardIndex) in player.cards">
                    <InsertCard :index="cardIndex+1" v-if="cardIndex === 0 && !isGuessing" @click="guess(0)"/>

                    <BigCard :year="getAlbumYear(card)"
                             :artist="getArtistNames(card)"
                             :track="card.name"/>

                    <InsertCard :index="cardIndex+2" v-if="!isGuessing" @click="guess(cardIndex+1)"/>
                </template>
                <template v-else>
                    <div class="card-count">
                        <span>
                            {{ player.cards.length }}
                            {{ player.cards.length === 1 ? "card" : "cards" }}
                        </span>
                        <FontAwesomeIcon :icon="faMedal" v-if="player.cards.length >= 10"/>
                    </div>
                    <SmallCard v-for="card in player.cards" :year="getAlbumYear(card)"/>
                </template>
            </div>
        </template>
    </div>
    <!-- Temporary workaround for buggy playlist API -->
    <div id="try-again" @click="play">
        <FontAwesomeIcon :icon="faRefresh"/>
    </div>
</template>

<style scoped>

#container {
    background: radial-gradient(
            var(--color-brown-darker),
            var(--color-brown-darkest)
    );

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#dashboard {
    position: absolute;
    width: 20rem;
    height: 20rem;
    background-color: var(--color-brown-darker);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 2rem;

    span {
        font-size: 2em;
    }

    svg {
        font-size: 3em;
    }

    &.bottom {
        transform: translate(-50%, -50%);
    }

    &.top {
        transform: translate(-50%, -50%) rotate(180deg);
    }

    &.left {
        transform: translate(-50%, -50%) rotate(90deg);
    }

    &.right {
        transform: translate(-50%, -50%) rotate(270deg);
    }
}

#indicator {
    position: absolute;
    width: 21rem;
    height: 21rem;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    background: linear-gradient(to right, var(--color-blue-light) 50%, transparent 50%);

    &.bottom {
        transform: translate(-50%, -50%) rotate(270deg);
    }

    &.top {
        transform: translate(-50%, -50%) rotate(90deg);
    }

    &.left {
        transform: translate(-50%, -50%);
    }

    &.right {
        transform: translate(-50%, -50%) rotate(180deg);
    }
}

#try-again {
    position: fixed;
    z-index: 20;
    bottom: 0;
    right: 0;
    opacity: 0.25;

    svg {
        font-size: 2em;
        margin: 1rem;
    }
}

.hand {
    position: absolute;
    padding: 1.5rem;

    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    column-gap: 0.5rem;
    overflow-x: auto;
}

.card-count {
    position: absolute;
    top: -1.5rem;
    font-weight: lighter;

    display: flex;
    flex-direction: row;
    column-gap: 0.5rem;
    align-items: center;

    svg {
        height: 2em;
    }
}

#top, #bottom {
    width: 100vw;
}

#left, #right {
    width: 100vh;
}

#bottom {
    bottom: 0;
}

#top {
    top: 0;
    transform: rotate(180deg);
}

#left {
    transform-origin: top left;
    transform: rotate(90deg) translate(0, -100%);
}

#right {
    right: 0;
    transform-origin: top right;
    transform: rotate(-90deg) translate(0, -100%);
}

</style>