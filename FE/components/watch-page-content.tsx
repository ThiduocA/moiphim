"use client"

import { VideoPlayerSection } from "@/components/video-player-section"
import { MovieDetailsSection } from "@/components/movie-details-section"
import { CommentsSection } from "@/components/comments-section"
import { SidebarContent } from "@/components/sidebar-content"
import { PromoBanner } from "@/components/promo-banner"
import { RelatedMoviesGrid } from "@/components/related-movies-grid"
import { Movie, Episode } from "@/types/movie"
import { useSearchParams } from "next/navigation"

interface WatchPageContentProps {
  movieId: string
  movie: Movie
  episodes: Episode[]
}

export function WatchPageContent({ movieId, movie, episodes }: WatchPageContentProps) {
  const searchParams = useSearchParams()
  const episodeParam = searchParams.get('episode')
  const serverParam = searchParams.get('server') || 'vietsub' // default to vietsub
  
  // Filter episodes theo server
  const availableServers = [...new Set(episodes.map(ep => ep.serverName))]
  const currentServerEpisodes = episodes.filter(ep => 
    serverParam === 'vietsub' 
      ? ep.serverName.includes('Vietsub')
      : ep.serverName.includes('Lồng Tiếng')
  )
  
  // Tìm episode hiện tại
  const currentEpisodeId = episodeParam ? parseInt(episodeParam) : 1
  const currentEpisode = currentServerEpisodes.find(ep => {
    // Extract episode number from episodeName (e.g., "Tập 01" -> 1)
    const epNum = parseInt(ep.episodeName.replace('Tập ', ''))
    return epNum === currentEpisodeId
  }) || currentServerEpisodes[0]

  // Transform data for video player
  const movieDataForVideoPlayer = {
    id: currentEpisode?.id || 1,
    movieId: movieId,
    episodeName: currentEpisode?.episodeName || movie.name,
    serverName: currentEpisode?.serverName || "",
    slug: currentEpisode?.slug || movie.slug,
    filename: currentEpisode?.filename || "",
    linkEmbed: currentEpisode?.linkEmbed || "",
    linkM3u8: currentEpisode?.linkM3u8 || ""
  }

  const movieDataForDetails = {
    title: movie.name,
    originalTitle: movie.origin_name || movie.name,
    category: movie.category,
    rating: movie.rating,
    year: movie.year,
    country: movie.country,
    duration: movie.duration,
    episodes_total: movie.episodes_total,
    description: movie.description,
    director: movie.director,
    actor: movie.actor
  }

  console.log('Available servers:', availableServers)
  console.log('Current server episodes:', currentServerEpisodes)
  console.log('Current Episode Data:', currentEpisode)
  console.log('Video Player Data:', movieDataForVideoPlayer)

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
          {/* <CommentsSection movieId={Number.parseInt(movieId)} /> */}

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