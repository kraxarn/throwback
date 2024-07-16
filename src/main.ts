import "./assets/main.css"
import "./assets/fonts.css"

import {createApp} from "vue"
import App from "./App.vue"
import router from "./router"
import {AUTO} from "phaser"

const gameConfig: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	width: 1280,
	height: 800,
	scene: [],
}

const app = createApp(App)

app.use(router)

app.mount("#app")

export const StartGame = (parent: string) => {
	return new Phaser.Game({
		...gameConfig,
		parent,
	})
}