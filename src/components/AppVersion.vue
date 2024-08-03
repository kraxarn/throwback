<script setup lang="ts">
import {homepage, name, version} from "@/../package.json"

const appName: string = name
const appVersion: string = version
const appHomepage: string = homepage
</script>

<template>
    <a id="app-version" :href="appHomepage">
        {{ appName }} v{{ appVersion }}
    </a>
</template>

<style scoped>

#app-version {
    position: fixed;
    bottom: 0;
    left: 0;
    font-size: 1.5em;
    padding: 1rem;
    opacity: 0.5;
}

</style>