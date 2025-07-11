import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const relatedMovies = [
  {
    id: 2,
    title: "Nữ Thần Kpop",
    genre: "Âm Nhạc, Tình Cảm",
    rating: 7.9,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Thế Giới Hôn Nhân",
    genre: "Tâm Lý, Gia Đình",
    rating: 8.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    title: "Nữ Hoàng Cờ Bạc",
    genre: "Tâm Lý, Chính Kịch",
    rating: 8.5,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    title: "Penthouse",
    genre: "Tâm Lý, Chính Kịch",
    rating: 8.3,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    title: "Vincenzo",
    genre: "Hành Động, Hài Hước",
    rating: 8.7,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    title: "Hospital Playlist",
    genre: "Y Khoa, Tình Cảm",
    rating: 9.0,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
]

export function RelatedMoviesGrid() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">Phim liên quan</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {relatedMovies.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl"
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

              {/* Quality Badge */}
              <div className="absolute top-2 right-2">
                <Badge className="bg-orange-500 text-white border-0 text-xs">HD</Badge>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link href={`/watch/${movie.id}`}>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Xem
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-3">
              <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
                {movie.title}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-1 mb-1">{movie.genre}</p>
              <p className="text-xs text-gray-500">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
