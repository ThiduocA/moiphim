import { Header } from "@/components/header"
import { WatchPageContent } from "@/components/watch-page-content"
import { Footer } from "@/components/footer"

export default function WatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <WatchPageContent movieId={params.id} />
      <Footer />
    </div>
  )
}
