"use client"

import { VideoPlayerSection } from "@/components/video-player-section"
import { MovieDetailsSection } from "@/components/movie-details-section"
import { CommentsSection } from "@/components/comments-section"
import { SidebarContent } from "@/components/sidebar-content"
import { PromoBanner } from "@/components/promo-banner"
import { RelatedMoviesGrid } from "@/components/related-movies-grid"
import { Movie, Episode, formatGenre } from "@/types/movie"

interface WatchPageContentProps {
  movieId: string
  movie: Movie
  episodes: Episode[]
}

export function WatchPageContent({ movieId, movie, episodes }: WatchPageContentProps) {
  // Transform data for existing components that expect different format
  const movieDataForVideoPlayer = {
    // id: movie._id,
    // title: movie.name,
    // currentEpisode: 1,
    // episodes: movie.episodesCount, // Use episodesCount from API
    // videoUrl: movie.videoUrl || "https://example.com/video.mp4"
      id: episodes.;
      movieId: movieId;
      episodeName: movie.name;
      linkEmbed: string;
      linkM3u8: string;
  }

  const movieDataForDetails = {
    title: movie.name,
    originalTitle: movie.origin_name || movie.name,
    category: movie.category, // Convert array to string
    rating: movie.rating,
    year: movie.year,
    country: movie.country,
    duration: movie.duration,
    episodesCount: movie.episodesCount, // Make sure this property exists
    description: movie.description,
    director: movie.director,
    actor: movie.actor // string array
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <VideoPlayerSection movie={movieDataForVideoPlayer} />

          {/* Movie Details */}
          <MovieDetailsSection movie={movieDataForDetails} />

          {/* Promo Banner */}
          <PromoBanner />

          {/* Comments Section */}
          <CommentsSection movieId={Number.parseInt(movieId)} />

          {/* Related Movies */}
          <RelatedMoviesGrid />
        </div>

        {/* Sidebar - Right Side */}
        <div className="lg:col-span-1">
          <SidebarContent />
        </div>
      </div>
    </div>
  )
}