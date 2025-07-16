'use client'

import { use } from 'react';
import { Header } from "@/components/header"
import { WatchPageContent } from "@/components/watch-page-content"
import { Footer } from "@/components/footer"
import { useMovieDetail } from "@/hooks/use-movieDetail"
import { Button } from "@/components/ui/button"

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const {id : movieId} = use(params)
    const { movie, episodes, loading, error } = useMovieDetail(movieId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-800 rounded mb-6"></div>
            <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
            <div className="h-20 bg-gray-800 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không thể xem phim</h1>
            <p className="text-gray-400 mb-4">{error || "Phim không tồn tại hoặc đã bị xóa"}</p>
            <Button onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <WatchPageContent movieId={movieId} movie={movie} episodes={episodes} />
      <Footer />
    </div>
  )
}