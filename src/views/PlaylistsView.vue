<script setup lang="ts">
import PlaylistTitle from "@/components/PlaylistTitle.vue"
import PlaylistTile from "@/components/PlaylistTile.vue";
</script>

<template>
    <PlaylistTitle title="Featured" description="Playlists to get started"/>

    <PlaylistTile/>

    <PlaylistTitle title="Suggested" description="Playlists created by Spotify"/>

    <PlaylistTitle title="For you" description="Playlists created for you"/>

    <PlaylistTitle title="Your playlists" description="Your own playlists"/>

    <PlaylistTitle title="Custom" description="Search for a custom playlist"/>
</template>

<style scoped>


</style>