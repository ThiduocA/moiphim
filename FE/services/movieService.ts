import { api } from '@/lib/api';
import { Movie, ApiResponse, Episode, Category } from '@/types/movie';
import { get } from 'http';

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

  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>>{
  try {
    const url = `/Movie/categories`
    console.log(`[getAllCategories] Fetching: ${url}`)

    const response = await api.get<any>(url)

    console.log("[getAllCategories] Raw response:", response)

    // Sửa lại parsing theo structure thật của API
    const items = response?.value ?? []
    const success = response?.isSuccess === true && Array.isArray(items)

    console.log("[getAllCategories] Parsed items:", items)
    console.log("[getAllCategories] Success:", success)

    // Đảm bảo return đúng structure mà component expect
    return {
      success,
      data: items,
      message: response?.error?.description || ''
    }

  } catch (err) {
    console.error("[getAllCategories] Error:", err)
    return {
      success: false,
      data: [],
      message: 'Failed to fetch categories'
    }
  }
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
    try {
      const url = `/Movie/${movieId}/episodes`
      console.log(`[getMovieEpisodes] Fetching: ${url}`)

      const response = await api.get<any>(url)
      console.log("[getMovieEpisodes] Raw response:", response)

      // Xử lý response theo cấu trúc thực tế từ API
      let episodes: Episode[] = []
      
      if (response?.value && Array.isArray(response.value)) {
        episodes = response.value
      } else if (response?.data && Array.isArray(response.data)) {
        episodes = response.data
      } else if (Array.isArray(response)) {
        episodes = response
      } else {
        console.warn("[getMovieEpisodes] Unknown response structure")
        episodes = []
      }

      const success = response?.isSuccess === true && Array.isArray(episodes)
      
      console.log("[getMovieEpisodes] Parsed episodes:", episodes)
      console.log("[getMovieEpisodes] Success:", success)

      return {
        success,
        data: episodes
      }

    } catch (err) {
      console.error("[getMovieEpisodes] Error:", err)
      return {
        success: false,
        data: []
      }
    }
  },

  // Get episode by ID
async getEpisodeById(movieId: string, episodeId: number): Promise<ApiResponse<Episode>> {
    try {
      const url = `/Movie/${movieId}/episodes/${episodeId}`
      console.log(`[getEpisodeById] Fetching: ${url}`)

      const response = await api.get<any>(url)
      console.log("[getEpisodeById] Raw response:", response)

      let episode: Episode | null = null
      
      if (response?.value) {
        episode = response.value
      } else if (response?.data) {
        episode = response.data
      } else {
        episode = response
      }

      const success = episode !== null

      return {
        success,
        data: episode as Episode
      }

    } catch (err) {
      console.error("[getEpisodeById] Error:", err)
      return {
        success: false,
        data: {} as Episode
      }
    }
  }
};