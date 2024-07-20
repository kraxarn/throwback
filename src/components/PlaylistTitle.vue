<script setup lang="ts">

const props = defineProps([
	"title",
	"description",
])

</script>

<template>
    <h1>{{ props.title }}</h1>
    <h3>{{ props.description }}</h3>
</template>

<style scoped>

h1 {
    margin-top: 2rem;
    margin-left: 1rem;
    margin-bottom: 0;

    &:first-child {
        margin-top: 1rem;
    }
}

h3 {
    margin-top: 0;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
}

</style>