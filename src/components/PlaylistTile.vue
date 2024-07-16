<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
</script>

<template>
    <div class="tile">
        <FontAwesomeIcon :icon="faUser"/>
    </div>
</template>

<style scoped>

.tile {
    width: 100px;
    height: 200px;
    border: 1px solid var(--color-blue-dark);
    border-radius: 32px;
}

</style>