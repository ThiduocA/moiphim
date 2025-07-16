'use client'

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MovieGrid } from "@/components/movie-grid"
import { PromoBanner } from "@/components/promo-banner"
import { Footer } from "@/components/footer"
import { useMovies } from "@/hooks/use-movie"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    page: 1,
    limit: 24,
    genre: '',
    country: '',
    year: undefined as number | undefined,
    search: ''
  })

  const { movies, loading, error, pagination } = useMovies(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value === 'all' ? (key === 'year' ? undefined : '') : value,
      page: 1 
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lỗi tải dữ liệu</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex gap-2">
              <Select onValueChange={(value) => handleFilterChange('genre', value)}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="action">Hành Động</SelectItem>
                  <SelectItem value="drama">Tâm Lý</SelectItem>
                  <SelectItem value="comedy">Hài Hước</SelectItem>
                  <SelectItem value="horror">Kinh Dị</SelectItem>
                  <SelectItem value="romance">Tình Cảm</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                  <SelectValue placeholder="Quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="korea">Hàn Quốc</SelectItem>
                  <SelectItem value="china">Trung Quốc</SelectItem>
                  <SelectItem value="usa">Hoa Kỳ</SelectItem>
                  <SelectItem value="japan">Nhật Bản</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('year', value)}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Page Title and Results Count */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {filters.search ? `Kết quả tìm kiếm: "${filters.search}"` : "Phim lẻ"}
          </h1>
          {pagination && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Tìm thấy {pagination.total} kết quả</span>
              <span>•</span>
              <span>Trang {pagination.page} / {pagination.totalPages}</span>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-12">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded mb-1"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy phim nào</h2>
            <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <Button
              variant="ghost"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="text-gray-400 hover:text-white"
            >
              ← Trước
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-white">Trang</span>
              <span className="px-3 py-2 bg-orange-500 text-white rounded">{pagination.page}</span>
              <span className="text-gray-400">/ {pagination.totalPages}</span>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="text-gray-400 hover:text-white"
            >
              Tiếp →
            </Button>
          </div>
        )}
      </div>

      <PromoBanner />
      <Footer />
    </div>
  )
}