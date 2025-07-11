"use client"

import { useState } from "react"
import { MessageCircle, ThumbsUp, Reply, MoreHorizontal, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Comment {
  id: number
  user: {
    name: string
    avatar: string
    level: string
    isVip: boolean
  }
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
  isLiked?: boolean
}

const comments: Comment[] = [
  {
    id: 1,
    user: {
      name: "Bình luận (597)",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "VIP",
      isVip: true,
    },
    content: "Phim hay quá! Diễn xuất của các diễn viên rất tự nhiên và cảm động. Mình đã khóc ở nhiều cảnh 😭",
    timestamp: "2 giờ trước",
    likes: 45,
    isLiked: false,
  },
  {
    id: 2,
    user: {
      name: "Minh Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "Gold",
      isVip: false,
    },
    content: "Cốt truyện phim rất hay, không có chỗ nào nhàm chán. Đang chờ season 2 nè!",
    timestamp: "3 giờ trước",
    likes: 32,
    isLiked: true,
    replies: [
      {
        id: 3,
        user: {
          name: "Thanh Hoa",
          avatar: "/placeholder.svg?height=40&width=40",
          level: "Silver",
          isVip: false,
        },
        content: "Mình cũng đang chờ season 2, hy vọng sẽ ra sớm!",
        timestamp: "2 giờ trước",
        likes: 12,
      },
    ],
  },
  {
    id: 4,
    user: {
      name: "Quang Minh",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "Bronze",
      isVip: false,
    },
    content: "OST của phim cũng rất hay, ai biết tên bài hát chủ đề không? Mình muốn tải về nghe",
    timestamp: "4 giờ trước",
    likes: 28,
  },
  {
    id: 5,
    user: {
      name: "Lan Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "VIP",
      isVip: true,
    },
    content: "Phim Hàn Quốc lúc nào cũng làm tốt phần tâm lý nhân vật. Rất đáng xem! Recommend cho mọi người",
    timestamp: "5 giờ trước",
    likes: 67,
  },
  {
    id: 6,
    user: {
      name: "Đức Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "Gold",
      isVip: false,
    },
    content: "Mình xem đi xem lại mấy lần rồi mà vẫn không chán. Chemistry giữa 2 main lead quá tuyệt!",
    timestamp: "6 giờ trước",
    likes: 41,
  },
]

interface MovieCommentsProps {
  movieId: number
}

export function MovieComments({ movieId }: MovieCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)

  const displayedComments = showAllComments ? comments : comments.slice(0, 3)

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("")
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-bold text-white">Bình luận ({comments.length})</h3>
        <Badge className="bg-orange-500 text-white">Mới nhất</Badge>
      </div>

      {/* Comment Input */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none min-h-[100px]"
              rows={4}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>💡 Hãy bình luận có văn hóa và tích cực</span>
              </div>
              <Button
                onClick={handleSubmitComment}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!newComment.trim()}
              >
                Đăng bình luận
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* Main Comment */}
            <div className="flex space-x-4">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                {comment.user.isVip && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">V</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-white">{comment.user.name}</span>
                      <Badge
                        className={`text-xs ${
                          comment.user.level === "VIP"
                            ? "bg-yellow-500 text-black"
                            : comment.user.level === "Gold"
                              ? "bg-yellow-600 text-white"
                              : comment.user.level === "Silver"
                                ? "bg-gray-400 text-black"
                                : "bg-orange-600 text-white"
                        }`}
                      >
                        {comment.user.level}
                      </Badge>
                      <span className="text-sm text-gray-400">{comment.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                </div>

                <div className="flex items-center space-x-6 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-400 hover:text-orange-500 p-0 ${comment.isLiked ? "text-orange-500" : ""}`}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-2 ${comment.isLiked ? "fill-current" : ""}`} />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                    <Reply className="w-4 h-4 mr-2" />
                    Trả lời
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-0">
                    <Heart className="w-4 h-4 mr-2" />
                    Thích
                  </Button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-16 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={reply.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-sm">{reply.user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-white text-sm">{reply.user.name}</span>
                          <Badge className="bg-gray-500 text-white text-xs">{reply.user.level}</Badge>
                          <span className="text-xs text-gray-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
                      </div>

                      <div className="flex items-center space-x-4 mt-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 p-0 text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {reply.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0 text-xs">
                          <Reply className="w-3 h-3 mr-1" />
                          Trả lời
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      {!showAllComments && comments.length > 3 && (
        <div className="text-center mt-8">
          <Button
            onClick={() => setShowAllComments(true)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            Xem thêm {comments.length - 3} bình luận
          </Button>
        </div>
      )}
    </div>
  )
}
