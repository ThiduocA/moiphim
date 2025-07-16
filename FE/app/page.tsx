'use client'

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { PromoBanner } from "@/components/promo-banner"
import { MovieSection } from "@/components/movie-section"
import { CategoryTabs } from "@/components/category-tabs"
import { Footer } from "@/components/footer"
import { movieService } from "@/services/movieService"
import { Movie } from "@/types/movie"

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [koreanMovies, setKoreanMovies] = useState<Movie[]>([])
  const [chineseMovies, setChineseMovies] = useState<Movie[]>([])
  const [usMovies, setUsMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true)
        
        // Fetch featured movie
        // const featuredResponse = await movieService.getFeaturedMovies()
        // if (featuredResponse.success && featuredResponse.data.length > 0) {
        //   setFeaturedMovie(featuredResponse.data[0])
        // }

        // Fetch movies by categories
        const [koreanRes, chineseRes, usRes] = await Promise.all([
          movieService.getMoviesByCountry('han-quoc', 8),
          movieService.getMoviesByCountry('uc', 8),
          movieService.getMoviesByCountry('au-my', 8)
        ])

        if (koreanRes.success) setKoreanMovies(koreanRes.data)
        if (chineseRes.success) setChineseMovies(chineseRes.data)
        if (usRes.success) setUsMovies(usRes.data)

      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="animate-pulse">
          <div className="h-96 bg-gray-800 mb-8"></div>
          <div className="container mx-auto px-4 space-y-8">
            <div className="h-8 bg-gray-800 w-64"></div>
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section
      {featuredMovie && <HeroBanner movie={featuredMovie} />} */}

      {/* Promo Banner */}
      <PromoBanner />

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Movie Sections */}
      <div className="container mx-auto px-4 space-y-12">
        <MovieSection 
          title="Phim Hàn Quốc mới" 
          subtitle="Những bộ phim Hàn Quốc hot nhất" 
          movies={koreanMovies} 
        />

        <MovieSection
          title="Phim Trung Quốc mới"
          subtitle="Phim cổ trang và hiện đại từ Trung Quốc"
          movies={chineseMovies}
        />

        <MovieSection 
          title="Phim US - UK mới" 
          subtitle="Blockbuster Hollywood mới nhất" 
          movies={usMovies} 
        />
      </div>

      {/* Bottom Promo Banner */}
      <div className="mt-16">
        <PromoBanner />
      </div>

      <Footer />
    </div>
  )
}