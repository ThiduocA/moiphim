import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { PromoBanner } from "@/components/promo-banner"
import { MovieSection } from "@/components/movie-section"
import { CategoryTabs } from "@/components/category-tabs"
import { Footer } from "@/components/footer"

const featuredMovies = [
  {
    id: 1,
    title: "Nguyên Thủ Quốc Gia",
    genre: "Hành Động, Chính Trị",
    rating: 7.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
    backdrop: "/placeholder.svg?height=600&width=1200",
    description: "Một bộ phim hành động chính trị đầy kịch tính về cuộc đấu tranh quyền lực.",
  },
]

const koreanMovies = [
  {
    id: 2,
    title: "Chị Đại Hee Dương",
    genre: "Hành Động, Tâm Lý",
    rating: 8.2,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Nữ Thần Kpop",
    genre: "Âm Nhạc, Tình Cảm",
    rating: 7.9,
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
    title: "Thế Giới Hôn Nhân",
    genre: "Tâm Lý, Gia Đình",
    rating: 8.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
]

const chineseMovies = [
  {
    id: 6,
    title: "Phượng Vũ Cửu Thiên",
    genre: "Cổ Trang, Tình Cảm",
    rating: 8.1,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    title: "Thư Quân Mặt Nạ",
    genre: "Cổ Trang, Hành Động",
    rating: 7.7,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 8,
    title: "Đại Hoa Giang Sơn",
    genre: "Cổ Trang, Chính Kịch",
    rating: 8.3,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 9,
    title: "Phù Dao Hoàng Hậu",
    genre: "Cổ Trang, Tình Cảm",
    rating: 8.0,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
]

const usMovies = [
  {
    id: 10,
    title: "Yêu Chồng Quý Tộc",
    genre: "Tình Cảm, Hài Hước",
    rating: 7.5,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 11,
    title: "Golf Thủ Tỷ Phú",
    genre: "Thể Thao, Tình Cảm",
    rating: 7.2,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 12,
    title: "Hell Motel",
    genre: "Kinh Dị, Bí Ẩn",
    rating: 6.8,
    year: 2023,
    poster: "/placeholder.svg?height=400&width=300",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section */}
      <HeroBanner movie={featuredMovies[0]} />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Movie Sections */}
      <div className="container mx-auto px-4 space-y-12">
        <MovieSection title="Phim Hàn Quốc mới" subtitle="Những bộ phim Hàn Quốc hot nhất" movies={koreanMovies} />

        <MovieSection
          title="Phim Trung Quốc mới"
          subtitle="Phim cổ trang và hiện đại từ Trung Quốc"
          movies={chineseMovies}
        />

        <MovieSection title="Phim US - UK mới" subtitle="Blockbuster Hollywood mới nhất" movies={usMovies} />
      </div>

      {/* Bottom Promo Banner */}
      <div className="mt-16">
        <PromoBanner />
      </div>

      <Footer />
    </div>
  )
}
