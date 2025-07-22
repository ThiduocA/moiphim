import { Star, Calendar, Globe, Clock, Film, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Category } from "@/types/movie"

interface Movie {
  title: string
  originalTitle: string
  category: Category[]
  rating: number
  year: number
  country: string
  duration: string
  description: string
  director: string
  actor: string[]
  episodes_total: string
}

interface MovieDetailsSectionProps {
  movie: Movie
}

export function MovieDetailsSection({ movie }: MovieDetailsSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="space-y-6">
        {/* Movie Title and Basic Info */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-gray-400 text-lg mb-4">{movie.originalTitle}</p>

          {/* Rating and Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold text-lg">{movie.rating}</span>
              <span className="text-gray-400">/10</span>
            </div>
            <Badge className="bg-orange-500 text-white">HD</Badge>
            <Badge className="bg-green-500 text-white">Vietsub</Badge>
            <Badge className="bg-blue-500 text-white">Thuyết Minh</Badge>
            <Badge className="bg-purple-500 text-white">Hoàn Thành</Badge>
          </div>
        </div>

        {/* Movie Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Năm: {movie.year}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Globe className="w-4 h-4 text-gray-400" />
            <span>Quốc gia: {movie.country}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Thời lượng: {movie.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Film className="w-4 h-4 text-gray-400" />
            <span>Số tập: {movie.episodes_total}</span>
          </div>
        </div>

        {/* Genre Tags */}
        <div>
          <h3 className="text-white font-semibold mb-2">Thể loại:</h3>
          <div className="flex flex-wrap gap-2">
            {movie.category.map((g) => (
                    <Badge
                      key={g.id}
                      variant="outline"
                      className="border-gray-500 text-gray-300"
                    >
                      {g.name}
                    </Badge>
                  ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-white font-semibold mb-3">Nội dung phim:</h3>
          <p className="text-gray-400 leading-relaxed">{movie.description}</p>
        </div>

        {/* Director and Cast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Film className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-white">Đạo diễn:</span>
            </div>
            <p className="text-gray-400">{movie.director}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-white">Diễn viên:</span>
            </div>
            <p className="text-gray-400">{movie.actor.join(", ")}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm vào danh sách yêu thích</Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
            Chia sẻ phim
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
            Báo lỗi
          </Button>
        </div>
      </div>
    </div>
  )
}