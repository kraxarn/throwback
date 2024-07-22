<script setup lang="ts">
import type PlayerAvatar from "@/game/PlayerAvatar";

const props = defineProps<{
	player: PlayerAvatar
}>()

</script>

<template>
    <div class="container">
        <div class="avatar">
            <img v-if="typeof player.avatar === 'string'" :src="player.avatar" :alt="player.name"/>
            <component v-if="typeof player.avatar === 'object'" :is="player.avatar"></component>
        </div>
        <span>{{ player.name }}</span>
    </div>
</template>

<style scoped>

.container {
    display: flex;
    flex-direction: column;
    width: 7em;
    align-items: center;
    row-gap: 0.5em;
}

.avatar {
    width: 80px;
    height: 80px;
    background-color: var(--color-blue-darker);
    border: 4px solid var(--color-blue-dark);
    border-radius: 50%;

    img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 50%;
    }

    svg {
        width: 90%;
        height: 90%;
        border-radius: 50%;
        transform: translate(5%, 5%);
    }
}

input {
    width: 100%;
}

</style>