<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue"
import {StartGame} from "@/main";
import {EventBus} from "@/game/EventBus";

const scene = ref<Phaser.Scene>()
const game = ref<Phaser.Game>()

const emit = defineEmits([
	"current-active-scene",
])

onMounted(() => {
	game.value = StartGame("game-container")
	EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
		emit("current-active-scene", sceneInstance)
		scene.value = sceneInstance
	})
})

onUnmounted(() => {
	if (!game.value) {
		return
	}

	game.value.destroy(true)
	game.value = undefined
})

defineExpose({
	scene,
	game,
})

</script>

<template>
    <div id="game-container"></div>
</template>

<style scoped>

</style>