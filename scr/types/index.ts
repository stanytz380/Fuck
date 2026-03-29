export interface Movie {
  id: string;
  title: string;
  poster_url?: string;
  backdrop_url?: string;
  rating?: number;
  release_year?: string;
  runtime?: string;
  genres?: string[];
  categories?: string[];
  storyline?: string;
  cast?: CastMember[];
  trailer_url?: string;
  movie_links?: Record<string, string>;
  created_at?: number;
  logo_url?: string;
  language?: string[];
}

export interface CastMember {
  name: string;
  character?: string;
  profile_image?: string;
}

export interface Comment {
  user_id: string;
  username: string;
  user_photo: string;
  comment_text: string;
  timestamp: number;
}