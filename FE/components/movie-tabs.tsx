"use client"

import { Button } from "@/components/ui/button"

interface MovieTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MovieTabs({ activeTab, onTabChange }: MovieTabsProps) {
  const tabs = [
    { id: "episodes", label: "Tập phim", icon: "📺" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
    { id: "cast", label: "Diễn viên", icon: "👥" },
    { id: "info", label: "Có thể", icon: "ℹ️" },
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`${
              activeTab === tab.id
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
