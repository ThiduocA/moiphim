import { Header } from "@/components/header"
import { MovieGrid } from "@/components/movie-grid"
import { PromoBanner } from "@/components/promo-banner"
import { Footer } from "@/components/footer"

const allMovies = [
  {
    id: 1,
    title: "Zlam",
    genre: "Hành Động",
    rating: 8.0,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "Đức Tướng Bi Án",
    genre: "Tâm Lý",
    rating: 7.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Âm Hồn Đáp Vọng",
    genre: "Kinh Dị",
    rating: 7.5,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    title: "Dora Hay Tìm Kho Báu Của Người Aztec",
    genre: "Phiêu Lưu",
    rating: 7.2,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    title: "Nguyên Thủ Quốc Gia",
    genre: "Hành Động",
    rating: 7.9,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    title: "Những Chiến Binh Tối Tăm 2",
    genre: "Hành Động",
    rating: 8.1,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    title: "Ngoại Tình Truy Kích",
    genre: "Tâm Lý",
    rating: 7.7,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 8,
    title: "Con Đường Băng Giá Tử Thần",
    genre: "Hành Động",
    rating: 8.3,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  // Add more movies to fill the grid like in your images
  {
    id: 9,
    title: "Tay Đua F1",
    genre: "Thể Thao",
    rating: 7.4,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 10,
    title: "M3GAN 2.0",
    genre: "Kinh Dị",
    rating: 7.6,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 11,
    title: "Nữa Ngọt Nữa Đắng",
    genre: "Tình Cảm",
    rating: 8.0,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 12,
    title: "Thế Giới Quý Kpop",
    genre: "Âm Nhạc",
    rating: 7.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 13,
    title: "Alma và Con Sói",
    genre: "Phiêu Lưu",
    rating: 7.3,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 14,
    title: "Diablo: Quỷ Vua Lửa",
    genre: "Hành Động",
    rating: 7.9,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 15,
    title: "Trang Trại Echo Valley",
    genre: "Kinh Dị",
    rating: 6.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 16,
    title: "Bộ Ba Bất Hạnh",
    genre: "Hài Hước",
    rating: 7.5,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
]

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phim lẻ</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Bộ lọc</span>
            <span>•</span>
            <span>Tất cả</span>
          </div>
        </div>

        <MovieGrid movies={allMovies} />

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-12">
          <button className="px-3 py-2 text-gray-400 hover:text-white">←</button>
          <span className="text-white">Trang</span>
          <span className="px-3 py-2 bg-orange-500 text-white rounded">1</span>
          <span className="text-gray-400">/ 452</span>
          <button className="px-3 py-2 text-gray-400 hover:text-white">→</button>
        </div>
      </div>

      <PromoBanner />
      <Footer />
    </div>
  )
}
