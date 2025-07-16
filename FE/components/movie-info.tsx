import { Star, Calendar, Globe, Clock, Film } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Movie {
  id: string;
  name: string;
  slug: string;
  original_name?: string;
  genre: string[];  // Array of genres from API
  rating: number;
  year: number;
  country: string;
  duration: string;
  episodesCount: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  backdrop?: string;
  description: string;
  director: string;
  cast: string[];  // API returns array of cast names
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MovieInfoProps {
  movie: Movie
}

export function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex flex-col space-y-4">
        {/* Movie Poster */}
        <div className="relative aspect-[3/4] w-full max-w-48 mx-auto">
          <Image src={movie.poster_url || "/placeholder.svg"} alt={movie.original_name || "abc"} fill className="object-cover rounded-lg" />
        </div>

        {/* Movie Details */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{movie.original_name}</h2>
            {movie.original_name && <p className="text-sm text-gray-400">{movie.original_name}</p>}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-500 text-black border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {movie.rating}
            </Badge>
            <span className="text-sm text-gray-400">({movie.year})</span>
          </div>

          {/* Movie Info Grid */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Globe className="w-4 h-4 text-gray-400" />
              <span>{movie.country}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{movie.duration}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-300">
              <Film className="w-4 h-4 text-gray-400" />
              <span>{movie.episodesCount}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{movie.genre}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-white mb-2">Nội dung</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{movie.description}</p>
          </div>

          {/* Director */}
          <div>
            <h4 className="font-semibold text-white mb-1">Đạo diễn</h4>
            <p className="text-sm text-gray-400">{movie.director}</p>
          </div>

          {/* Cast */}
          <div>
            <h4 className="font-semibold text-white mb-2">Diễn viên</h4>
            <div className="flex flex-wrap gap-1">
              {movie.cast.map((actor, index) => (
                <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  {actor}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Thêm vào danh sách</Button>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              Chia sẻ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
