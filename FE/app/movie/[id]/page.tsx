'use client'

import {use} from 'react';
import { Header } from "@/components/header"
import { MovieDetailContent } from "@/components/movie-detail-content"
import { Footer } from "@/components/footer"
import { useMovieDetail } from "@/hooks/use-movieDetail"
import { Button } from "@/components/ui/button"


export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id : movieId} = use(params)
  const { movie, episodes, loading, error } = useMovieDetail(movieId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-96 bg-gray-800 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-64"></div>
                <div className="h-20 bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
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
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy phim</h1>
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
      <MovieDetailContent movieId={movieId} movie={movie} episodes={episodes} />
      {/* <MovieDetailContent movieId={movieId} movie={movie} /> */}
      <Footer />
    </div>
  )
}