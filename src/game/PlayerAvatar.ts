import type {Component} from "vue";

export default interface PlayerAvatar {
	id?: string
	name?: string
	avatar: string | Component
}