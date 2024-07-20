import type {Session} from "@supabase/supabase-js";

export class SpotifyApi {
	private readonly session: Session

	constructor(session: Session) {
		this.session = session
	}

	private async request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
		const url = new URL(path, "https://api.spotify.com/v1/")

		const headers = new Headers(options?.headers)
		headers.set("Authorization", `Bearer ${this.session.provider_token}`)

		const response = await fetch(url, {
			method,
			headers,
			body: options?.body,
		})

		if (response.status === 401) {
			await this.refresh()
			return this.request<T>(method, path, options)
		}

		const json = await response.json()
		if (response.ok) {
			return <T>json;
		}

		const error: {
			status: number;
			message: string;
		} = json.error;

		throw `Error ${error.status}: ${error.message}`
	}

	private get<T>(path: string, params?: URLSearchParams): Promise<T> {
		const fullPath = params ? `${path}?${params.toString()}` : path
		return this.request<T>("GET", fullPath)
	}

	private async refresh(): Promise<void> {
		const body = new URLSearchParams()
		body.set("grant_type", "refresh_token")
		body.set("refresh_token", this.session.provider_refresh_token || "")

		const url = "https://accounts.spotify.com/api/token"
		const token = await this.request<Token>("POST", url, {
			headers: [
				["Content-Type", "application/x-www-form-urlencoded"],
			],
			body,
		})

		this.session.provider_token = token.access_token
		this.session.provider_refresh_token = token.refresh_token
	}

	public async getPlaylist(playlistId: string): Promise<Playlist> {
		const params = new URLSearchParams()
		params.set("fields", [
			"description",
			"images",
			"name",
			"owner(display_name)",
		].join(","))

		return this.get<Playlist>(`playlists/${playlistId}`, params)
	}

	public async search(query: string): Promise<SearchResults> {
		const params = new URLSearchParams()
		params.set("q", query)
		params.set("type", "playlist")
		params.set("limit", "50")

		return this.get<SearchResults>("search", params)
	}

	public async featuredPlaylists(): Promise<FeaturedPlaylists> {
		const params = new URLSearchParams()
		params.set("limit", "20")

		return this.get<FeaturedPlaylists>("browse/featured-playlists", params)
	}

	public async playlists(): Promise<Page<Playlist>> {
		const params = new URLSearchParams()
		params.set("limit", "20")

		return this.get<Page<Playlist>>("me/playlists", params)
	}
}

interface RequestOptions {
	headers?: HeadersInit;
	body?: BodyInit;
}

interface Token {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface Playlist {
	description: string;
	images: {
		url: string;
		height: number;
		width: number;
	}[];
	name: string;
	owner: {
		id: string;
		display_name: string;
	};
}

interface Page<T> {
	items: T[];
}

interface SearchResults {
	playlists: Page<Playlist>;
}

interface FeaturedPlaylists {
	playlists: Page<Playlist>;
}
