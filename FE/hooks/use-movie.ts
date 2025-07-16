import { useState, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { Movie } from '@/types/movie';

export function useMovies(params?: {
  page?: number;
  limit?: number;
  genre?: string;
  country?: string;
  year?: number;
  search?: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await movieService.getMovies(params);
        
        if (response.success) {
          setMovies(response.data);
          setPagination(response.pagination);
        } else {
          setError(response.message || 'Failed to fetch movies');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [params?.page, params?.limit, params?.genre, params?.country, params?.year, params?.search]);

  return { movies, loading, error, pagination };
}