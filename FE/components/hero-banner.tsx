import { Play, Info, Star } from "lucide-react"
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
  backdrop?: string
  description?: string
}

interface HeroBannerProps {
  movie: Movie
}

export function HeroBanner({ movie }: HeroBannerProps) {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop || "/placeholder.svg?height=600&width=1200"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className="bg-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {movie.rating}
            </Badge>
            <Badge variant="outline" className="border-gray-400 text-gray-300">
              {movie.year}
            </Badge>
            <Badge variant="outline" className="border-gray-400 text-gray-300">
              HD
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">{movie.title}</h1>

          <p className="text-lg text-gray-300 mb-2">{movie.genre}</p>

          {movie.description && (
            <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-xl">{movie.description}</p>
          )}

          <div className="flex items-center space-x-4">
            <Link href={`/watch/${movie.id}`}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Xem Ngay
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent px-8"
            >
              <Info className="w-5 h-5 mr-2" />
              Thông Tin
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
