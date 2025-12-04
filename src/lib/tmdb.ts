const TMDB_API_KEY = "5042690d4de878589827cbbc6270caa5";
const BASE_URL = "https://api.themoviedb.org/3";
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

export const getImageUrl = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchPopularMovies = async (page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const fetchTrendingMovies = async (timeWindow: "day" | "week" = "week"): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
  );
  return response.json();
};

export const fetchTopRatedMovies = async (page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const fetchUpcomingMovies = async (page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const fetchNowPlayingMovies = async (page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  return response.json();
};

export const fetchMoviesByGenre = async (genreId: number, page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
  return response.json();
};

export const fetchGenres = async (): Promise<{ genres: Genre[] }> => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
  );
  return response.json();
};

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits`
  );
  return response.json();
};

export const searchMovies = async (query: string, page = 1): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
  );
  return response.json();
};

export const fetchSimilarMovies = async (movieId: number): Promise<MoviesResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US`
  );
  return response.json();
};

export const discoverMovies = async (params: {
  page?: number;
  sortBy?: string;
  year?: number;
  voteAverageGte?: number;
  withGenres?: string;
}): Promise<MoviesResponse> => {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    page: String(params.page || 1),
    sort_by: params.sortBy || "popularity.desc",
  });

  if (params.year) searchParams.append("year", String(params.year));
  if (params.voteAverageGte) searchParams.append("vote_average.gte", String(params.voteAverageGte));
  if (params.withGenres) searchParams.append("with_genres", params.withGenres);

  const response = await fetch(`${BASE_URL}/discover/movie?${searchParams}`);
  return response.json();
};
