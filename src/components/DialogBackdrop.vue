<script setup lang="ts">

defineEmits<{
	dismissed: [];
}>()

</script>

<template>
    <div class="backdrop" @click="$emit('dismissed')"></div>
</template>

<style scoped>

.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px) brightness(50%);
    -webkit-backdrop-filter: blur(2px) brightness(50%);
}

</style>