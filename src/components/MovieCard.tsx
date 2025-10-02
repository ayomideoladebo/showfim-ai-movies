import { Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  releaseDate: string;
}

const MovieCard = ({ id, title, posterPath, rating, releaseDate }: MovieCardProps) => {
  const navigate = useNavigate();
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div
      onClick={() => navigate(`/movie/${id}`)}
      className="movie-card glass-card rounded-xl overflow-hidden group relative"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="btn-hero px-6 py-3 rounded-lg flex items-center gap-2 font-semibold">
            <Play className="w-5 h-5" />
            Watch Now
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 glass px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(releaseDate).getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
