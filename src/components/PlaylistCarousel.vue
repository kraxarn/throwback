<script setup lang="ts">
</script>

<template>
    <div class="container">
        <slot/>
    </div>
</template>

<style scoped>

.container {
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    overflow-x: auto;
    min-height: 200px;

    /* Ignore app padding */
    margin-left: -2rem;
    margin-right: -2rem;
    padding-left: 2rem;
}

</style>