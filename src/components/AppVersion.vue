<script setup lang="ts"></script>

<template>
    <span id="app-version">
        {{ name }} v{{ version }}
    </span>
</template>

<style scoped>

#app-version {
    position: fixed;
    bottom: 0;
    left: 0;
    font-size: 2em;
    padding: 1rem;
    opacity: 0.5;
}

</style>