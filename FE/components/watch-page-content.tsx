"use client"

import { VideoPlayerSection } from "@/components/video-player-section"
import { MovieDetailsSection } from "@/components/movie-details-section"
import { CommentsSection } from "@/components/comments-section"
import { SidebarContent } from "@/components/sidebar-content"
import { PromoBanner } from "@/components/promo-banner"
import { RelatedMoviesGrid } from "@/components/related-movies-grid"

const movieData = {
  id: 1,
  title: "Chị Đại Hee Dương",
  originalTitle: "My Girlfriend is a Gumiho",
  genre: "Tâm Lý, Tình Cảm, Hài Hước",
  rating: 8.2,
  year: 2023,
  country: "Hàn Quốc",
  duration: "60 phút/tập",
  episodes: "16/16",
  currentEpisode: 1,
  poster: "/placeholder.svg?height=400&width=300",
  description:
    "Một bộ phim tâm lý tình cảm Hàn Quốc kể về câu chuyện tình yêu đầy thú vị giữa một cô gái trẻ và chàng trai bí ẩn. Với những tình tiết hấp dẫn và diễn xuất tuyệt vời của dàn diễn viên.",
  director: "Kim Dong-hwi",
  cast: ["Lee Dong-wook", "Jo Bo-ah", "Kim Bum", "Kim Yong-ji"],
  videoUrl: "https://example.com/video.mp4",
}

interface WatchPageContentProps {
  movieId: string
}

export function WatchPageContent({ movieId }: WatchPageContentProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <VideoPlayerSection movie={movieData} />

          {/* Movie Details */}
          <MovieDetailsSection movie={movieData} />

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
