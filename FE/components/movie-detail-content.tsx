"use client"

import { useState } from "react"
import { MovieHeroSection } from "@/components/movie-hero-section"
import { MovieTabs } from "@/components/movie-tabs"
import { EpisodeGrid } from "@/components/episode-grid"
import { CastGrid } from "@/components/cast-grid"
import { MovieComments } from "@/components/movie-comments"
import { TrendingMoviesSidebar } from "@/components/trending-movies-sidebar"

const movieData = {
  id: 1,
  title: "Chị Đại Hee Dương",
  originalTitle: "My Girlfriend is a Gumiho",
  genre: ["Tâm Lý", "Tình Cảm", "Hài Hước"],
  rating: 8.2,
  year: 2023,
  country: "Hàn Quốc",
  duration: "60 phút/tập",
  episodesCount: "16/16",
  status: "Hoàn thành",
  poster: "/placeholder.svg?height=600&width=400",
  backdrop: "/placeholder.svg?height=800&width=1200",
  description:
    "Một bộ phim tâm lý tình cảm Hàn Quốc kể về câu chuyện tình yêu đầy thú vị giữa một cô gái trẻ và chàng trai bí ẩn. Với những tình tiết hấp dẫn và diễn xuất tuyệt vời của dàn diễn viên, bộ phim đã thu hút hàng triệu khán giả trên toàn thế giới.",
  director: "Kim Dong-hwi",
  cast: [
    { name: "Lee Dong-wook", character: "Nam chính", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Jo Bo-ah", character: "Nữ chính", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Kim Bum", character: "Nam phụ", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Kim Yong-ji", character: "Nữ phụ", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Hwang Hee", character: "Bạn thân", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Park Kyung-hye", character: "Mẹ nữ chính", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Jang Won-hyung", character: "Cha nam chính", avatar: "/placeholder.svg?height=150&width=150" },
    { name: "Kim Do-wan", character: "Đồng nghiệp", avatar: "/placeholder.svg?height=150&width=150" },
  ],
  episodeList: Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Tập ${i + 1}`,
    description: `Nội dung tập ${i + 1} - Những diễn biến mới trong mối quan hệ của các nhân vật chính.`,
    duration: "60 phút",
    thumbnail: "/placeholder.svg?height=200&width=300",
    airDate: `2023-${String(Math.floor(i / 4) + 1).padStart(2, "0")}-${String((i % 4) * 7 + 1).padStart(2, "0")}`,
  })),
}

interface MovieDetailContentProps {
  movieId: string
}

export function MovieDetailContent({ movieId }: MovieDetailContentProps) {
  const [activeTab, setActiveTab] = useState("episodes")

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero Section */}
          <MovieHeroSection movie={movieData} />

          {/* Tabs Navigation */}
          <MovieTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            {activeTab === "episodes" && <EpisodeGrid episodes={movieData.episodeList} />}
            {activeTab === "gallery" && (
              <div className="text-center py-12">
                <p className="text-gray-400">Thư viện ảnh đang được cập nhật...</p>
              </div>
            )}
            {activeTab === "cast" && <CastGrid cast={movieData.cast} />}
            {activeTab === "info" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Thông tin chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Đạo diễn:</span>
                    <span className="text-white ml-2">{movieData.director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white ml-2">{movieData.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Năm sản xuất:</span>
                    <span className="text-white ml-2">{movieData.year}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Trạng thái:</span>
                    <span className="text-white ml-2">{movieData.status}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Nội dung:</h4>
                  <p className="text-gray-400 leading-relaxed">{movieData.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <MovieComments movieId={Number.parseInt(movieId)} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TrendingMoviesSidebar />
        </div>
      </div>
    </div>
  )
}
