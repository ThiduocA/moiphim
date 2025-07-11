import { TrendingUp, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

const trendingMovies = [
  {
    id: 1,
    title: "The Outlaws: Vua Đường Phố",
    genre: "Hành Động, Tội Phạm",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.9,
    year: 2024,
    rank: 1,
  },
  {
    id: 2,
    title: "Nữ Quái Của Tôi",
    genre: "Tình Cảm, Hài Hước",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.7,
    year: 2024,
    rank: 2,
  },
  {
    id: 3,
    title: "Kiều Nương",
    genre: "Cổ Trang, Tình Cảm",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.5,
    year: 2024,
    rank: 3,
  },
  {
    id: 4,
    title: "Bác Sĩ Kỳ Lạ Giang Sơn",
    genre: "Y Khoa, Tâm Lý",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.3,
    year: 2024,
    rank: 4,
  },
  {
    id: 5,
    title: "Nguyên Thủ Quốc Gia",
    genre: "Chính Trị, Hành Động",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.1,
    year: 2024,
    rank: 5,
  },
  {
    id: 6,
    title: "Chị Đại Hee Dương",
    genre: "Tình Cảm, Tâm Lý",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.2,
    year: 2024,
    rank: 6,
  },
  {
    id: 7,
    title: "Cảm Tử Phương Hoa",
    genre: "Cổ Trang, Võ Thuật",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.9,
    year: 2024,
    rank: 7,
  },
  {
    id: 8,
    title: "Nữ Thần Kpop",
    genre: "Âm Nhạc, Thần Tượng",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.8,
    year: 2024,
    rank: 8,
  },
  {
    id: 9,
    title: "Nữ Lưu Vong Thời Hiện Đại",
    genre: "Xuyên Không, Tình Cảm",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.7,
    year: 2024,
    rank: 9,
  },
  {
    id: 10,
    title: "Nữa Đêm Thành Phố",
    genre: "Tâm Lý, Bí Ẩn",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.6,
    year: 2024,
    rank: 10,
  },
]

export function TrendingMoviesSidebar() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-bold text-white">Top phim thịnh hành</h3>
      </div>

      <div className="space-y-4">
        {trendingMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
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
                      movie.rank <= 3
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {movie.rank}
                  </div>
                </div>
                {movie.rank <= 3 && (
                  <div className="absolute -top-1 -left-1">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-1">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1 mb-2">{movie.genre}</p>
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
          <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">Xem tất cả top phim →</button>
        </Link>
      </div>
    </div>
  )
}
