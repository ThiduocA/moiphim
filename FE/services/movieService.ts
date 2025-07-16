import { api } from '@/lib/api';
import { Movie, ApiResponse, Episode } from '@/types/movie';

export const movieService = {
  // Get all movies with pagination and filters
  async getMovies(params?: {
    page?: number;
    limit?: number;
    genre?: string;
    country?: string;
    year?: number;
    search?: string;
  }): Promise<ApiResponse<Movie[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/Movie${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ApiResponse<Movie[]>>(endpoint);
  },

  // Get movie by ID
async getMovieById(id: string): Promise<ApiResponse<Movie[]>> {
      const params = new URLSearchParams()
    params.append('Id', id)

    try {
      const url = `/Movie?${params.toString()}`
      console.log(`[getMoviesById] Fetching: ${url}`)

      const response = await api.get<any>(url)

      console.log("[getMoviesById] Raw response:", response)

      const items = response?.value?.items ?? []

      const success = response?.isSuccess === true && Array.isArray(items)

      console.log("[getMoviesById] Parsed items:", items)
      console.log("[getMoviesById] Success:", success)

      return {
        success,
        data: items
      }

    } catch (err) {
      console.error("[getMoviesById] Error:", err)
      return {
        success: false,
        data: []
      }
    }
  },

  // Get featured movies
  //chua co
  async getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
    return api.get<ApiResponse<Movie[]>>('/Movie/featured');
  },

  // Get movies by category
  async getMoviesByCategory(category: string, limit?: number): Promise<ApiResponse<Movie[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return api.get<ApiResponse<Movie[]>>(`/Movie/category/${category}${params}`);
  },
  // Get movies by countries
  async getMoviesByCountry(country: string, limit?: number): Promise<ApiResponse<Movie[]>> {
      const params = new URLSearchParams()
    params.append('Country', country)
    if (limit !== undefined) {
      params.append('limit', limit.toString())
    }

    try {
      const url = `/Movie?${params.toString()}`
      console.log(`[getMoviesByCountry] Fetching: ${url}`)

      const response = await api.get<any>(url)

      console.log("[getMoviesByCountry] Raw response:", response)

      const items = response?.value?.items ?? []

      const success = response?.isSuccess === true && Array.isArray(items)

      console.log("[getMoviesByCountry] Parsed items:", items)
      console.log("[getMoviesByCountry] Success:", success)

      return {
        success,
        data: items
      }

    } catch (err) {
      console.error("[getMoviesByCountry] Error:", err)
      return {
        success: false,
        data: []
      }
    }
  },
  // Get trending movies
  // chua co
  async getTrendingMovies(): Promise<ApiResponse<Movie[]>> {
    return api.get<ApiResponse<Movie[]>>('/Movie/trending');
  },

  // Search movies
  async searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
    return api.get<ApiResponse<Movie[]>>(`/Movie/search?q=${encodeURIComponent(query)}`);
  },

  // Get movie episodes
  async getMovieEpisodes(movieId: string): Promise<ApiResponse<Episode[]>> {
    return api.get<ApiResponse<Episode[]>>(`/Movie/${movieId}/episodes`);
  },

  // Get episode by ID
  async getEpisodeById(movieId: string, episodeId: number): Promise<ApiResponse<Episode>> {
    return api.get<ApiResponse<Episode>>(`/Movie/${movieId}/episodes/${episodeId}`);
  }
};