import { useState, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { Movie, Episode } from '@/types/movie';

export function useMovieDetail(movieId: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!movieId) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log(`[useMovieDetail] Fetching movie and episodes for ID: ${movieId}`);
        
        // Fetch movie details
        const movieResponse = await movieService.getMovieById(movieId);
        console.log('[useMovieDetail] Movie response:', movieResponse);

        if (movieResponse.success && movieResponse.data.length > 0) {
          let movieData = movieResponse.data[0];
          
          // Transform cast if API returns objects instead of strings
          if (movieData.actor && movieData.actor.length > 0 && typeof movieData.actor[0] === 'object') {
            movieData = {
              ...movieData,
              actor: movieData.actor.map((castMember: any) => 
                typeof castMember === 'string' ? castMember : castMember.name
              )
            };
          }
          
          setMovie(movieData);
          console.log('[useMovieDetail] Movie set successfully:', movieData);
        } else {
          setError(movieResponse.message || 'Failed to fetch movie');
          console.error('[useMovieDetail] Movie fetch failed:', movieResponse);
        }

        // Fetch episodes
        try {
          const episodesResponse = await movieService.getMovieEpisodes(movieId);
          console.log('[useMovieDetail] Episodes response:', episodesResponse);
          
          if (episodesResponse.success) {
            setEpisodes(episodesResponse.data);
            console.log('[useMovieDetail] Episodes set successfully:', episodesResponse.data);
          } else {
            console.warn('[useMovieDetail] Episodes fetch failed, but continuing:', episodesResponse);
            setEpisodes([]);
          }
        } catch (episodeError) {
          console.warn('[useMovieDetail] Episodes fetch error:', episodeError);
          setEpisodes([]);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('[useMovieDetail] General error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  return { movie, episodes, loading, error };
}