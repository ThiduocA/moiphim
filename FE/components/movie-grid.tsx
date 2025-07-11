import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  year: number
  poster: string
}

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
          {/* Movie Poster */}
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

            {/* Quality Badges */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
              <Badge className="bg-orange-500 text-white border-0 text-xs">HD</Badge>
              <Badge className="bg-green-500 text-white border-0 text-xs">Vietsub</Badge>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link href={`/movie/${movie.id}`}>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Xem
                </Button>
              </Link>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-3">
            <Link href={`/movie/${movie.id}`}>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors cursor-pointer">
                {movie.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-400 line-clamp-1 mb-1">{movie.genre}</p>
            <p className="text-xs text-gray-500">{movie.year}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
