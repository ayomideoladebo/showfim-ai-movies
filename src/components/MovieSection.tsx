import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieSectionProps {
  title: string;
  endpoint: string;
}

const MovieSection = ({ title, endpoint }: MovieSectionProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [endpoint]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?api_key=f5707e33d829c09755f8b9ca50da00bd`
      );
      const data = await response.json();
      // Ensure we only set movies if results exist and is an array
      if (data.results && Array.isArray(data.results)) {
        setMovies(data.results);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Keep movies as empty array on error
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${title}`);
    if (container) {
      const scrollAmount = direction === "left" ? -800 : 800;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-neon">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="glass p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="glass p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Movies Scroll Container */}
      <div
        id={`scroll-${title}`}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-64">
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
                releaseDate={movie.release_date}
              />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">Loading movies...</p>
        )}
      </div>
    </div>
  );
};

export default MovieSection;
