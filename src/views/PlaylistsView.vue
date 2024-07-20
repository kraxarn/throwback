<script setup lang="ts">
import PlaylistTitle from "@/components/PlaylistTitle.vue"
import PlaylistTile from "@/components/PlaylistTile.vue";
import featured from "@/spotify/featured.json"
import PlaylistCarousel from "@/components/PlaylistCarousel.vue";
import {onMounted, ref} from "vue";
import {supabase} from "@/supabaseClient";
import {type Playlist, SpotifyApi} from "@/spotify/SpotifyApi";
import PlaylistDialog from "@/components/PlaylistDialog.vue";

const spotifyApi = ref<SpotifyApi>()

const featuredPlaylists = ref<Playlist[]>()
const forYouPlaylists = ref<Playlist[]>()
const userPlaylists = ref<Playlist[]>()

const currentPlaylist = ref<Playlist>()

onMounted(async () => {
	const sessionResponse = await supabase.auth.getSession()
	if (sessionResponse.error || !sessionResponse.data.session) {
		alert(sessionResponse.error?.message || "Something went wrong")
		return
	}

	const session = sessionResponse.data.session
	const api = new SpotifyApi(session)
	spotifyApi.value = api

	api.featuredPlaylists().then(value => {
		featuredPlaylists.value = value.playlists.items
	})

	api.search("Mix").then(value => {

		forYouPlaylists.value = value.playlists.items
			.filter(playlist => playlist.owner.id === "spotify")
			.filter(playlist => !playlist.name.startsWith("Daily Mix"))
			.slice(0, 20)
	})

	api.playlists().then(value => {
		userPlaylists.value = value.items
	})
})

const onItemActivated = (playlist: Playlist) => {
	currentPlaylist.value = playlist
}

const onDialogActivated = (playlist: Playlist) => {
	currentPlaylist.value = undefined
}

const onDialogDeactivated = () => {
	currentPlaylist.value = undefined
}

</script>

<template>
    <PlaylistTitle title="Featured" description="Playlists to get started"/>

    <PlaylistCarousel v-if="spotifyApi">
        <PlaylistTile v-for="item in featured" :playlist-id="item" :spotify-api="spotifyApi"
                      @activated="onItemActivated"/>
    </PlaylistCarousel>

    <PlaylistTitle title="Suggested" description="Playlists created by Spotify"/>

    <PlaylistCarousel v-if="spotifyApi">
        <PlaylistTile v-for="playlist in featuredPlaylists" :playlist="playlist" :spotify-api="spotifyApi"
                      @activated="onItemActivated"/>
    </PlaylistCarousel>

    <PlaylistTitle title="For you" description="Playlists created for you"/>

    <PlaylistCarousel v-if="spotifyApi">
        <PlaylistTile v-for="playlist in forYouPlaylists" :playlist="playlist" :spotify-api="spotifyApi"
                      @activated="onItemActivated"/>
    </PlaylistCarousel>

    <PlaylistTitle title="Your playlists" description="Your own playlists"/>

    <PlaylistCarousel v-if="spotifyApi">
        <PlaylistTile v-for="playlist in userPlaylists" :playlist="playlist" :spotify-api="spotifyApi"
                      @activated="onItemActivated"/>
    </PlaylistCarousel>

    <PlaylistDialog v-if="currentPlaylist" :playlist="currentPlaylist"
                    @activated="onDialogActivated" @deactivated="onDialogDeactivated"/>

    <!--    <PlaylistTitle title="Custom" description="Search for a custom playlist"/>-->
</template>