<script setup lang="ts">

defineProps<{
	year: number
}>()

</script>

<template>
    <div class="small-card-container">
        <span>{{ year }}</span>
        <span></span>
    </div>
</template>

<style scoped>

.small-card-container {
    background-color: var(--color-purple-darker);
    border: 4px solid var(--color-purple-dark);
    color: var(--color-purple-lightest);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    width: 4rem;
    height: 6rem;
    border-radius: 8px;

    span {
        font-size: 1.4em;
    }
}

</style>