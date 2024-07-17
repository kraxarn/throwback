<script setup lang="ts">

import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {supabase} from "@/supabaseClient";

onMounted(async () => {
	const route = useRoute()
	const router = useRouter()

	const userResponse = await supabase.auth.getUser()
	if (userResponse.data.user && !userResponse.error) {
		await router.push({
			name: "playlists",
		})
	}

	const code = route.query.code
	if (!code || typeof code !== "string") {
		return
	}

	const response = await supabase.auth.exchangeCodeForSession(code);

	if (response.error) {
		const text = document.querySelector("h3")
		if (text) {
			const error = response.error
			text.innerText = `Error: ${error.message} (${error.code})`
		}
	} else {
		await router.push({
			name: "playlists",
		})
	}
})

</script>

<template>
    <h1>Logging you in...</h1>
    <h3></h3>
</template>

<style scoped>
h3 {
    color: red;
}
</style>