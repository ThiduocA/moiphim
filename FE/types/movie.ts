export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name?: string;
  category: Category[];  // Array of genres from API
  rating: number;
  year: number;
  country: string;
  duration: string;
  episodesCount: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  backdrop?: string;
  description: string;
  director: string;
  actor: string[];  // API returns array of cast names
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Episode {
  id: number;
  movieId: string;
  episodeName: string;
  slug: string;
  filename: string;
  linkEmbed: string;
  linkM3u8: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  avatar: string;
}

export interface Comment {
  id: number;
  movieId: number;
  userId: number;
  content: string;
  likes: number;
  timestamp: string;
  user: {
    id: number;
    name: string;
    avatar: string;
    level: string;
    isVip: boolean;
  };
  replies?: Comment[];
  isLiked?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper function to format genre for display
export const formatGenre = (genre: string | string[]): string => {
  if (Array.isArray(genre)) {
    return genre.join(', ');
  }
  return genre;
};

// Helper function to ensure genre is array
// export const ensureGenreArray = (genre: string | string[]): string[] => {
//   if (Array.isArray(genre)) {
//     return genre;
//   }
//   return genre.split(',').map(g => g.trim());
// };

// Helper function to transform cast for components
export const transformCastForDisplay = (cast: string[]): CastMember[] => {
  return cast.map((castName, index) => ({
    id: index + 1,
    name: castName,
    character: "Diễn viên",
    avatar: "/placeholder.svg?height=150&width=150"
  }));
};