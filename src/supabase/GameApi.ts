import {supabase} from "@/supabaseClient";
import type {PostgrestSingleResponse} from "@supabase/supabase-js";

export class GameApi {
	private parse<T>(response: PostgrestSingleResponse<T>) {
		if (response.error) {
			throw response.error.message
		}
		return response.data
	}

	public async createMatch(playlistId: string, playerCount: number): Promise<string> {
		const match = await supabase
			.from("matches")
			.insert({
				playlist_id: playlistId,
				player_count: playerCount,
			})
			.select("id")

		return this.parse(match)[0].id
	}

	public async getPlaylistId(matchId: string): Promise<string> {
		const match = await supabase
			.from("matches")
			.select("playlist_id")
			.eq("id", matchId)

		return this.parse(match)[0].playlist_id
	}

	public async getPlayerCount(matchId: string): Promise<number> {
		const match = await supabase
			.from("matches")
			.select("player_count")
			.eq("id", matchId)

		return this.parse(match)[0].player_count
	}

	public async isTrackIndexUsed(matchId: string, trackIndex: number): Promise<boolean> {
		const response = await supabase
			.from("rounds")
			.select("*", {
				count: "exact",
				head: true,
			})
			.eq("match_id", matchId)
			.eq("track_index", trackIndex)

		this.parse(response)
		return !!response.count && response.count > 0
	}
}