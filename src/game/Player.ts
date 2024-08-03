import type {Track} from "@/spotify/SpotifyApi";
import type {Position} from "@/game/Position";

export interface Player {
	position: Position
	cards: Track[]
}