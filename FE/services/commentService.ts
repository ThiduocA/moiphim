import { api } from '@/lib/api';
import { Comment, ApiResponse } from '@/types/movie';

export const commentService = {
  // Get comments for a movie
  async getMovieComments(movieId: number, page?: number): Promise<ApiResponse<Comment[]>> {
    const params = page ? `?page=${page}` : '';
    return api.get<ApiResponse<Comment[]>>(`/movies/${movieId}/comments${params}`);
  },

  // Add comment
  async addComment(movieId: number, content: string): Promise<ApiResponse<Comment>> {
    return api.post<ApiResponse<Comment>>(`/movies/${movieId}/comments`, { content });
  },

  // Like/Unlike comment
  async toggleCommentLike(commentId: number): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/comments/${commentId}/like`);
  },

  // Reply to comment
  async replyToComment(commentId: number, content: string): Promise<ApiResponse<Comment>> {
    return api.post<ApiResponse<Comment>>(`/comments/${commentId}/reply`, { content });
  }
};