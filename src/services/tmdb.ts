import axios, { type AxiosError } from 'axios'
import type { Movie, TVShow, TMDBResponse, SearchResult, MovieDetail, TVShowDetail, TVSeasonDetail } from '../types/types'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined
if (!apiKey) {
    console.error('[tmdb] VITE_TMDB_API_KEY is not set. API calls will fail.')
}

export class TMDBError extends Error {
    readonly status: number
    readonly endpoint: string
    constructor(message: string, status: number, endpoint: string) {
        super(message)
        this.name = 'TMDBError'
        this.status = status
        this.endpoint = endpoint
    }
}

const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: apiKey,
        language: 'tr-TR',
    },
})

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    try {
        const response = await tmdbClient.get<T>(endpoint, { params })
        return response.data
    } catch (err) {
        const axiosErr = err as AxiosError<{ status_message?: string }>
        const status = axiosErr.response?.status ?? 0
        const message = axiosErr.response?.data?.status_message ?? axiosErr.message ?? 'Unknown TMDB error'
        throw new TMDBError(message, status, endpoint)
    }
}

export const getImageUrl = (
    path: string | null,
    size: 'w300' | 'w500' | 'original' = 'w500'
): string => {
    if (!path) return 'https://placehold.co/500x750?text=No+Image'
    return `${IMAGE_BASE_URL}/${size}${path}`
}

export const tmdbApi = {
    getPopularMovies: (page = 1): Promise<TMDBResponse<Movie>> =>
        tmdbFetch<TMDBResponse<Movie>>('/movie/popular', { page }),

    getPopularTVShows: (page = 1): Promise<TMDBResponse<TVShow>> =>
        tmdbFetch<TMDBResponse<TVShow>>('/tv/popular', { page }),

    search: (query: string, page = 1): Promise<TMDBResponse<SearchResult>> =>
        tmdbFetch<TMDBResponse<SearchResult>>('/search/multi', { query, page }),

    getMovieDetail: (id: number): Promise<MovieDetail> =>
        tmdbFetch<MovieDetail>(`/movie/${id}`, { append_to_response: 'credits' }),

    getTVShowDetail: (id: number): Promise<TVShowDetail> =>
        tmdbFetch<TVShowDetail>(`/tv/${id}`, { append_to_response: 'credits' }),

    getSimilarMovies: (id: number): Promise<TMDBResponse<Movie>> =>
        tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/similar`),

    getSimilarTVShows: (id: number): Promise<TMDBResponse<TVShow>> =>
        tmdbFetch<TMDBResponse<TVShow>>(`/tv/${id}/similar`),

    getTVSeasonDetails: (tvId: number, seasonNumber: number): Promise<TVSeasonDetail> =>
        tmdbFetch<TVSeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`),

    getTopRatedMovies: (page = 1): Promise<TMDBResponse<Movie>> =>
        tmdbFetch<TMDBResponse<Movie>>('/movie/top_rated', { page }),

    getMoviesByGenre: (genreId: number | string, page = 1): Promise<TMDBResponse<Movie>> =>
        tmdbFetch<TMDBResponse<Movie>>('/discover/movie', { with_genres: genreId, page }),
}
