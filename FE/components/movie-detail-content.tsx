"use client"

import { useState } from "react"
import { MovieHeroSection } from "@/components/movie-hero-section"
import { MovieTabs } from "@/components/movie-tabs"
import { EpisodeList } from "@/components/episode-grid"
import { CastGrid } from "@/components/cast-grid"
import { MovieComments } from "@/components/movie-comments"
import { TrendingMoviesSidebar } from "@/components/trending-movies-sidebar"
import { Movie, Episode } from "@/types/movie"

interface MovieDetailContentProps {
  movieId: string
  movie: Movie
  episodes: Episode[]
}

export function MovieDetailContent({ movieId, movie, episodes }: MovieDetailContentProps) {
  const [activeTab, setActiveTab] = useState("episodes")

  // Transform cast from string[] to object array for CastGrid component only
  const transformedCast = movie.actor.map((castName, index) => ({
    id: index + 1,
    name: castName,
    character: "Diễn viên", // Default character since API only returns names
    avatar: "/placeholder.svg?height=150&width=150"
  }))

  // Pass the original movie object with cast as string[] to MovieHeroSection
  // The movie object from API already has the correct format

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero Section - Pass original movie object */}
          <MovieHeroSection movie={movie} />

          {/* Tabs Navigation */}
          <MovieTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            {activeTab === "episodes" && <EpisodeList movieId={movieId} episodes={episodes} />}
            {activeTab === "gallery" && (
              <div className="text-center py-12">
                <p className="text-gray-400">Thư viện ảnh đang được cập nhật...</p>
              </div>
            )}
            {/* Cast tab - Use transformed cast data */}
            {activeTab === "cast" && <CastGrid cast={transformedCast} />}
            {activeTab === "info" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Thông tin chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Đạo diễn:</span>
                    <span className="text-white ml-2">{movie.director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white ml-2">{movie.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Năm sản xuất:</span>
                    <span className="text-white ml-2">{movie.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Trạng thái:</span>
                    <span className="text-white ml-2">{movie.status}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Nội dung:</h4>
                  <p className="text-gray-400 leading-relaxed">{movie.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          {/* <MovieComments movieId={movieId} /> */}
        </div>

        {/* Sidebar */}
        {/* <div className="lg:col-span-1">
          <TrendingMoviesSidebar />
        </div> */}
      </div>
    </div>
  )
}