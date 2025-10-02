import { useEffect, useState } from "react";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
}

const HeroSlider = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=f5707e33d829c09755f8b9ca50da00bd`
      );
      const data = await response.json();
      setMovies(data.results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;

  return (
    <div className="relative h-[85vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold text-gradient animate-fade-in">
            {currentMovie.title}
          </h1>
          
          <p className="text-lg text-foreground/90 line-clamp-3 animate-fade-in">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4 animate-fade-in">
            <button
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="btn-hero px-8 py-4 rounded-xl flex items-center gap-2 font-semibold text-lg"
            >
              <Play className="w-6 h-6" />
              Watch Now
            </button>
            <button
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              className="btn-hero-secondary px-8 py-4 rounded-xl flex items-center gap-2 font-semibold text-lg"
            >
              <Info className="w-6 h-6" />
              More Info
            </button>
          </div>

          {/* Slider Indicators */}
          <div className="flex gap-2 pt-4">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-12 bg-primary glow-cyan"
                    : "w-8 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 glass p-3 rounded-full hover:scale-110 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 glass p-3 rounded-full hover:scale-110 transition-transform"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HeroSlider;
