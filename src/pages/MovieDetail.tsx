import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Star, Calendar, Clock, Download, Play } from "lucide-react";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { name: string; logo_path: string }[];
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=f5707e33d829c09755f8b9ca50da00bd`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleDownload = () => {
    window.open(`https://dl.vidsrc.vip/movie/${id}`, "_blank");
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-neon animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isWatching ? (
        // Video Player
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => setIsWatching(false)}
              className="btn-hero-secondary px-6 py-3 rounded-lg mb-4"
            >
              ← Back to Details
            </button>
            <div className="aspect-video w-full glass-card rounded-xl overflow-hidden">
              <iframe
                src={`https://vidfast.pro/movie/${id}?autoPlay=true`}
                className="w-full h-full"
                allowFullScreen
                title={movie.title}
              />
            </div>
          </div>
        </div>
      ) : (
        // Movie Details
        <>
          {/* Hero Section with Backdrop */}
          <div className="relative pt-20">
            <div className="absolute inset-0 h-[70vh]">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative container mx-auto px-4 py-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Poster */}
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-80 rounded-xl glass-card shadow-2xl flex-shrink-0"
                />

                {/* Movie Info */}
                <div className="flex-1 space-y-6 pt-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-gradient">
                    {movie.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span>{movie.runtime} min</span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="glass px-4 py-2 rounded-full text-sm font-medium border border-primary/30"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => setIsWatching(true)}
                      className="btn-hero px-8 py-4 rounded-xl flex items-center gap-2 font-semibold text-lg"
                    >
                      <Play className="w-6 h-6" />
                      Watch Now
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn-hero-secondary px-8 py-4 rounded-xl flex items-center gap-2 font-semibold text-lg"
                    >
                      <Download className="w-6 h-6" />
                      Download
                    </button>
                  </div>

                  {/* Overview */}
                  <div className="glass-card p-6 rounded-xl max-w-3xl">
                    <h2 className="text-2xl font-bold text-neon mb-4">Overview</h2>
                    <p className="text-foreground/90 leading-relaxed text-lg">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Production Companies */}
          {movie.production_companies.length > 0 && (
            <div className="container mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold text-neon mb-6">Production</h2>
              <div className="flex flex-wrap gap-8">
                {movie.production_companies.map((company) => (
                  company.logo_path && (
                    <div key={company.name} className="glass-card p-4 rounded-xl">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="h-12 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetail;
