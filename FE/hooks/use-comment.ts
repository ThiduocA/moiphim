import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import { Comment } from '@/types/movie';

export function useComments(movieId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await commentService.getMovieComments(movieId);
      
      if (response.success) {
        setComments(response.data);
      } else {
        setError(response.message || 'Failed to fetch comments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const response = await commentService.addComment(movieId, content);
      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add comment:', err);
      return false;
    }
  };

  const toggleLike = async (commentId: number) => {
    try {
      const response = await commentService.toggleCommentLike(commentId);
      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { 
                  ...comment, 
                  isLiked: !comment.isLiked,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                }
              : comment
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to toggle like:', err);
      return false;
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchComments();
    }
  }, [movieId]);

  return { comments, loading, error, addComment, toggleLike, refetch: fetchComments };
}