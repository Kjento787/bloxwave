import { supabase } from "@/integrations/supabase/client";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  videos?: { results: Video[] };
  credits?: { cast: Cast[]; crew: Crew[] };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke('tmdb-proxy', {
    body: { endpoint, params },
  });

  if (error) {
    console.error('TMDB proxy error:', error);
    throw new Error('Failed to fetch from TMDB');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as T;
}

export const getImageUrl = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getEmbedUrl = (movieId: number): string => {
  return `https://vidsrc.xyz/embed/movie/${movieId}`;
};

export const fetchPopularMovies = async (page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/movie/popular', { language: 'en-US', page: String(page) });
};

export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week"): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>(`/trending/movie/${timeWindow}`);
};

export const fetchTopRatedMovies = async (page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/movie/top_rated', { language: 'en-US', page: String(page) });
};

export const fetchUpcomingMovies = async (page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/movie/upcoming', { language: 'en-US', page: String(page) });
};

export const fetchNowPlayingMovies = async (page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/movie/now_playing', { language: 'en-US', page: String(page) });
};

export const fetchMoviesByGenre = async (genreId: number, page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/discover/movie', {
    language: 'en-US',
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc'
  });
};

export const fetchGenres = async (): Promise<{ genres: Genre[] }> => {
  return tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', { language: 'en-US' });
};

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}`, { 
    language: 'en-US',
    append_to_response: 'videos,credits'
  });
};

export const searchMovies = async (query: string, page = 1): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>('/search/movie', {
    language: 'en-US',
    query: encodeURIComponent(query),
    page: String(page)
  });
};

export const fetchSimilarMovies = async (movieId: number): Promise<MoviesResponse> => {
  return tmdbFetch<MoviesResponse>(`/movie/${movieId}/similar`, { language: 'en-US' });
};

export const discoverMovies = async (params: {
  page?: number;
  sortBy?: string;
  year?: number;
  voteAverageGte?: number;
  withGenres?: string;
}): Promise<MoviesResponse> => {
  const queryParams: Record<string, string> = {
    language: 'en-US',
    page: String(params.page || 1),
    sort_by: params.sortBy || 'popularity.desc',
  };

  if (params.year) queryParams.year = String(params.year);
  if (params.voteAverageGte) queryParams['vote_average.gte'] = String(params.voteAverageGte);
  if (params.withGenres) queryParams.with_genres = params.withGenres;

  return tmdbFetch<MoviesResponse>('/discover/movie', queryParams);
};
