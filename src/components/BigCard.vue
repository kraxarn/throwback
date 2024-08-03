<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faMusic, faUser} from "@fortawesome/free-solid-svg-icons";

defineProps<{
	year: number
	artist: string
	track: string
}>()

</script>

<template>
    <div class="big-card-container">
        <span class="year">{{ year }}</span>
        <FontAwesomeIcon :icon="faMusic"/>
        <span class="track">{{ track }}</span>
        <FontAwesomeIcon :icon="faUser"/>
        <span class="artist">{{ artist }}</span>
    </div>
</template>

<style scoped>

.big-card-container {
    background-color: var(--color-purple-darker);
    border: 4px solid var(--color-purple-light);
    color: var(--color-purple-lightest);

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 3fr repeat(2, 2fr);
    align-items: center;
    padding: 0.6rem;
    row-gap: 0.5rem;

    overflow: hidden;
    width: 7rem;
    height: 10rem;
    border-radius: 8px;

    div {
        flex: 1;
    }

    span {
        padding: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    span.year {
        font-size: 1.8em;
        grid-column-start: 1;
        grid-column-end: 3;
        justify-self: center;
    }
}

</style>