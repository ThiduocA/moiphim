import { Crown, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const topUsers = [
  { name: "Minh Anh", avatar: "/placeholder.svg?height=40&width=40", points: 2580 },
  { name: "Thanh Hoa", avatar: "/placeholder.svg?height=40&width=40", points: 2340 },
  { name: "Quang Minh", avatar: "/placeholder.svg?height=40&width=40", points: 2120 },
  { name: "Lan Anh", avatar: "/placeholder.svg?height=40&width=40", points: 1980 },
  { name: "Đức Anh", avatar: "/placeholder.svg?height=40&width=40", points: 1850 },
  { name: "Thu Hà", avatar: "/placeholder.svg?height=40&width=40", points: 1720 },
]

const trendingMovies = [
  {
    id: 1,
    title: "Squid Game 2",
    genre: "Tâm Lý, Kinh Dị",
    poster: "/placeholder.svg?height=100&width=70",
    views: "2.5M",
  },
  {
    id: 2,
    title: "Kingdom: Ashin of the North",
    genre: "Kinh Dị, Lịch Sử",
    poster: "/placeholder.svg?height=100&width=70",
    views: "1.8M",
  },
  {
    id: 3,
    title: "Hometown's Embrace",
    genre: "Tình Cảm, Gia Đình",
    poster: "/placeholder.svg?height=100&width=70",
    views: "1.2M",
  },
  {
    id: 4,
    title: "The Silent Sea",
    genre: "Sci-Fi, Bí Ẩn",
    poster: "/placeholder.svg?height=100&width=70",
    views: "980K",
  },
]

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Top Users */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-white">Thành viên</h3>
        </div>

        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">{index + 1}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.points.toLocaleString()} điểm</p>
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
            <div key={movie.id} className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative w-12 h-16 flex-shrink-0">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute top-1 left-1">
                  <Badge className="bg-orange-500 text-white border-0 text-xs px-1">{index + 1}</Badge>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-1">{movie.genre}</p>
                <p className="text-xs text-gray-500">{movie.views} lượt xem</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Banner */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-4 text-center">
        <h4 className="text-white font-semibold mb-2">Nâng cấp VIP</h4>
        <p className="text-white/90 text-sm mb-3">Xem phim không quảng cáo</p>
        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
          Đăng ký ngay
        </button>
      </div>
    </div>
  )
}
