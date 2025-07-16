"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { movieService } from "@/services/movieService"
import { Movie } from "@/types/movie"

export function TrendingMoviesSidebar() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await movieService.getTrendingMovies()
        if (response.success) {
          setTrendingMovies(response.data.slice(0, 10)) // Get top 10
        }
      } catch (error) {
        console.error('Failed to fetch trending movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Top phim thịnh hành</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-12 h-16 bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-bold text-white">Top phim thịnh hành</h3>
      </div>

      <div className="space-y-4">
        {trendingMovies.map((movie, index) => (
          <Link key={movie._id} href={`/movie/${movie.id}`}>
            <div className="flex items-start space-x-3 group cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition-colors">
              <div className="relative w-12 h-16 flex-shrink-0">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute -top-2 -left-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                {index < 3 && (
                  <div className="absolute -top-1 -left-1">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-1">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                  {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-500 text-black text-xs">⭐ {movie.rating}</Badge>
                  <span className="text-xs text-gray-500">{movie.year}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <Link href="/trending">
          <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
            Xem tất cả top phim →
          </button>
        </Link>
      </div>
    </div>
  )
}