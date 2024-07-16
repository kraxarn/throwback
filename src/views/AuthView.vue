<script setup lang="ts">

import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {cipher} from "@/cipher";
import client from "@/spotify/client.json"

onMounted(async () => {
	const route = useRoute()
	const code = route.query.code
	if (!code) {
		return
	}

	const headers = new Headers()
	headers.set("Content-Type", "application/x-www-form-urlencoded")
	headers.set("Authorization", "Basic " + btoa(cipher(client)
		.map(code => String.fromCharCode(code))
		.reduce<string[]>((v, c, i) => <string[]>((v[Math.floor(i / 32)] = (v[Math.floor(i / 32)] || "") + c) && v), [])
		.join(":")))

	const request = new Request("https://accounts.spotify.com/api/token", {
		method: "POST",
		body: `grant_type=authorization_code&code=${code}&redirect_uri=${location.origin + location.pathname}`,
		headers,
	})

	const response = await fetch(request)
	const json = await response.json()

	if (response.ok) {
		localStorage.setItem("access_token", json.access_token)
		localStorage.setItem("refresh_token", json.refresh_token)
		localStorage.setItem("expire_token", (Date.now() + json.expires_in * 1000).toString())
	} else {
		const text = document.querySelector("h3")
		if (text) {
			text.innerText = `Error: ${json.error_description} (${json.error})`
		}
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