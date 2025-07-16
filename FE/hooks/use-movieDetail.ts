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
        
        const [movieResponse, episodesResponse] = await Promise.all([
          movieService.getMovieById(movieId),
          movieService.getMovieEpisodes(movieId)
        ]);
        // const [movieResponse] = await Promise.all([
        //   movieService.getMovieById(movieId),
        //   movieService.getMovieEpisodes(movieId)
        // ]);

        if (movieResponse.success) {
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
        } else {
          setError(movieResponse.message || 'Failed to fetch movie');
        }

        if (episodesResponse.success) {
          console.log('Episodes fetched:', episodesResponse.data);
          setEpisodes(episodesResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  return { movie, episodes, loading, error };
}