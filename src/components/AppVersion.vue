<script setup lang="ts">
import {name, version} from "@/../package.json"

const appName: string = name
const appVersion: string = version
</script>

<template>
    <span id="app-version">
        {{ appName }} v{{ appVersion }}
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