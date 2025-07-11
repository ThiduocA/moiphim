import { Crown, TrendingUp, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const topUsers = [
  { name: "Minh Anh", avatar: "/placeholder.svg?height=40&width=40", level: "VIP", isOnline: true },
  { name: "Thanh Hoa", avatar: "/placeholder.svg?height=40&width=40", level: "Gold", isOnline: true },
  { name: "Quang Minh", avatar: "/placeholder.svg?height=40&width=40", level: "Silver", isOnline: false },
  { name: "Lan Anh", avatar: "/placeholder.svg?height=40&width=40", level: "Bronze", isOnline: true },
  { name: "Đức Anh", avatar: "/placeholder.svg?height=40&width=40", level: "Bronze", isOnline: false },
  { name: "Thu Hà", avatar: "/placeholder.svg?height=40&width=40", level: "Bronze", isOnline: true },
  { name: "Văn Nam", avatar: "/placeholder.svg?height=40&width=40", level: "Bronze", isOnline: true },
  { name: "Hải Yến", avatar: "/placeholder.svg?height=40&width=40", level: "Bronze", isOnline: false },
]

const trendingMovies = [
  {
    id: 1,
    title: "Squid Game Season 2",
    genre: "Tâm Lý, Kinh Dị",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 9.1,
    year: 2024,
  },
  {
    id: 2,
    title: "Kingdom: Ashin of the North",
    genre: "Kinh Dị, Lịch Sử",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.7,
    year: 2023,
  },
  {
    id: 3,
    title: "Hometown's Embrace",
    genre: "Tình Cảm, Gia Đình",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.3,
    year: 2023,
  },
  {
    id: 4,
    title: "The Silent Sea",
    genre: "Sci-Fi, Bí Ẩn",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 8.0,
    year: 2023,
  },
  {
    id: 5,
    title: "My Name",
    genre: "Hành Động, Tâm Lý",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.9,
    year: 2023,
  },
  {
    id: 6,
    title: "Hellbound",
    genre: "Kinh Dị, Siêu Nhiên",
    poster: "/placeholder.svg?height=120&width=80",
    rating: 7.8,
    year: 2023,
  },
]

export function SidebarContent() {
  return (
    <div className="space-y-6">
      {/* Online Users */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-white">Đang xem</h3>
          <Badge className="bg-green-500 text-white text-xs">
            {topUsers.filter((user) => user.isOnline).length} online
          </Badge>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {topUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400">{user.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Movies */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-white">Phim thịnh hành</h3>
        </div>

        <div className="space-y-3">
          {trendingMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex items-start space-x-3 group cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors"
            >
              <div className="relative w-12 h-16 flex-shrink-0">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute -top-1 -left-1">
                  <Badge className="bg-orange-500 text-white border-0 text-xs w-5 h-5 p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-1">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1 mb-1">{movie.genre}</p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-500 text-black text-xs">⭐ {movie.rating}</Badge>
                  <span className="text-xs text-gray-500">{movie.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Promotion */}
      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-4 text-center">
        <Crown className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
        <h4 className="text-white font-bold mb-2">Nâng cấp VIP</h4>
        <p className="text-white/90 text-sm mb-3">
          • Xem phim không quảng cáo
          <br />• Chất lượng 4K
          <br />• Tải phim offline
        </p>
        <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors w-full">
          Đăng ký ngay - 99K/tháng
        </button>
      </div>
    </div>
  )
}
