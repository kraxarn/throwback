<script setup lang="ts">

defineProps<{
	year: number
	artist: string
	track: string
}>()

</script>

<template>
    <div class="big-card-container">
        <div></div>
        <span class="year">{{ year }}</span>
        <div></div>
        <span class="track">{{ track }}</span>
        <span class="artist">{{ artist }}</span>
        <div></div>
    </div>
</template>

<style scoped>

.big-card-container {
    background-color: var(--color-purple-darker);
    border: 4px solid var(--color-purple-light);
    color: var(--color-purple-lightest);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    overflow: hidden;

    width: 7rem;
    height: 10rem;
    border-radius: 8px;

    div {
        flex: 1;
    }

    span.year {
        font-size: 1.8em;
    }
}

</style>