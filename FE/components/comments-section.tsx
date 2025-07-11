"use client"

import { useState } from "react"
import { MessageCircle, ThumbsUp, Reply, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
}

const comments: Comment[] = [
  {
    id: 1,
    user: {
      name: "Minh Anh",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Phim hay quá! Diễn xuất của các diễn viên rất tự nhiên và cảm động. Mình đã khóc ở nhiều cảnh 😭",
    timestamp: "2 giờ trước",
    likes: 15,
    replies: [
      {
        id: 2,
        user: {
          name: "Thanh Hoa",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Mình cũng vậy! Đặc biệt là cảnh cuối, quá cảm động",
        timestamp: "1 giờ trước",
        likes: 8,
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Quang Minh",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Cốt truyện phim rất hay, không có chỗ nào nhàm chán. Đang chờ tập tiếp theo",
    timestamp: "3 giờ trước",
    likes: 23,
  },
  {
    id: 4,
    user: {
      name: "Lan Anh",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "OST của phim cũng rất hay, ai biết tên bài hát không?",
    timestamp: "4 giờ trước",
    likes: 12,
  },
  {
    id: 5,
    user: {
      name: "Đức Anh",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Phim Hàn Quốc lúc nào cũng làm tốt phần tâm lý nhân vật. Rất đáng xem!",
    timestamp: "5 giờ trước",
    likes: 18,
  },
]

interface CommentsSectionProps {
  movieId: number
}

export function CommentsSection({ movieId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Handle comment submission
      setNewComment("")
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-white">Bình luận ({comments.length})</h3>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmitComment}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!newComment.trim()}
              >
                Gửi bình luận
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm">{comment.user.name}</h4>
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                </div>

                <div className="flex items-center space-x-4 mt-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 p-0">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                    <Reply className="w-4 h-4 mr-1" />
                    Trả lời
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={reply.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{reply.user.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">{reply.user.name}</h4>
                          <span className="text-xs text-gray-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
                      </div>

                      <div className="flex items-center space-x-4 mt-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500 p-0">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {reply.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                          <Reply className="w-4 h-4 mr-1" />
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
      <div className="text-center mt-6">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
          Xem thêm bình luận
        </Button>
      </div>
    </div>
  )
}
