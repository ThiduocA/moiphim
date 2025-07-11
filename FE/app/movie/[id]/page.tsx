import { Header } from "@/components/header"
import { MovieDetailContent } from "@/components/movie-detail-content"
import { Footer } from "@/components/footer"

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <MovieDetailContent movieId={params.id} />
      <Footer />
    </div>
  )
}
