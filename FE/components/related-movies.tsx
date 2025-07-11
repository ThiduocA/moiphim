import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  year: number
  poster: string
}

interface RelatedMoviesProps {
  movies: Movie[]
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Phim liên quan</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Rating Badge */}
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/70 text-yellow-400 border-0 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {movie.rating}
                </Badge>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Xem
                </Button>
              </div>
            </div>

            <div className="p-3">
              <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
                {movie.title}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1">{movie.genre}</p>
              <p className="text-xs text-gray-500">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
