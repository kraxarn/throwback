export class SpotifyApi {
	constructor(session: {
		provider_token?: string | null
		provider_refresh_token?: string | null
	}) {
		if (session.provider_token && session.provider_refresh_token) {
			this.accessToken = session.provider_token
			this.refreshToken = session.provider_refresh_token
		}
	}

	private get accessToken(): string {
		return localStorage.getItem("spotify_access_token") || ""
	}

	private set accessToken(accessToken: string) {
		localStorage.setItem("spotify_access_token", accessToken)
	}

	private get refreshToken(): string {
		return localStorage.getItem("spotify_refresh_token") || ""
	}

	private set refreshToken(refreshToken: string) {
		localStorage.setItem("spotify_refresh_token", refreshToken)
	}

	private async request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
		const url = new URL(path, "https://api.spotify.com/v1/")

		const headers = new Headers(options?.headers)
		headers.set("Authorization", `Bearer ${this.accessToken}`)

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
		body.set("refresh_token", this.refreshToken)

		const url = "https://accounts.spotify.com/api/token"
		const token = await this.request<Token>("POST", url, {
			headers: [
				["Content-Type", "application/x-www-form-urlencoded"],
			],
			body,
		})

		this.accessToken = token.access_token
		this.refreshToken = token.refresh_token
	}

	public async getPlaylist(playlistId: string): Promise<Playlist> {
		const params = new URLSearchParams()
		params.set("fields", [
			"description",
			"images",
			"id",
			"name",
			"owner(display_name)",
			"tracks(total)",
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
		params.set("limit", "50")

		return this.get<Page<Playlist>>("me/playlists", params)
	}

	public async* playlistTracks(playlist: Playlist): AsyncGenerator<Track> {
		const params = new URLSearchParams()
		params.set("limit", "50")

		for (let i = 0; i < playlist.tracks.total; i += 50) {
			params.set("offset", i.toString())
			const url = `playlists/${playlist.id}/tracks`
			const page = await this.get<Page<PlaylistTrack>>(url, params)

			for (const playlistTrack of page.items) {
				yield playlistTrack.track
			}
		}
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
	id: string;
	name: string;
	owner: {
		id: string;
		display_name: string;
	};
	tracks: {
		total: number;
	};
}

interface PlaylistTrack {
	track: Track
}

export interface Track {
	album: {
		id: string
		name: string
		release_date: string
	}
	artists: [{
		id: string
		name: string
	}]
	id: string
	name: string
	duration_ms: number
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
