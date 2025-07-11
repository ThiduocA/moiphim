import { Button } from "@/components/ui/button"

const categories = [
  { name: "Marvel", count: "Xem thêm 8", color: "bg-blue-600" },
  { name: "4K", count: "Xem thêm 4", color: "bg-gray-600" },
  { name: "Sitcom", count: "Xem thêm 4", color: "bg-green-600" },
  { name: "Long Tiếng Các Mạnh", count: "Xem thêm 4", color: "bg-purple-600" },
  { name: "Xuyên Không", count: "Xem thêm 4", color: "bg-orange-600" },
  { name: "Cổ Trang", count: "Xem thêm 4", color: "bg-red-600" },
]

export function CategoryTabs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-4">
        {categories.map((category, index) => (
          <Button key={index} className={`${category.color} hover:opacity-90 text-white border-0 px-6 py-3 rounded-lg`}>
            <div className="text-center">
              <div className="font-bold">{category.name}</div>
              <div className="text-xs opacity-90">{category.count}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
