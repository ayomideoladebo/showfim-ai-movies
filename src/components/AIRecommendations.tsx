import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MovieCard from "./MovieCard";

interface AIRecommendationsProps {
  weather: any;
  location: string;
  movies: any[];
}

interface Recommendation {
  movieId: number;
  title: string;
  reason: string;
}

const AIRecommendations = ({ weather, location, movies }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);

  useEffect(() => {
    if (weather && movies.length > 0) {
      fetchRecommendations();
    }
  }, [weather, location]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    if (hour < 22) return "evening";
    return "night";
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-movie-recommendations', {
        body: {
          weather,
          location,
          timeOfDay: getTimeOfDay(),
          movies
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations || []);
      setExplanation(data.explanation || "");

      // Match recommendations with movie data
      const matched = data.recommendations?.map((rec: Recommendation) => {
        const movie = movies.find(m => m.id === rec.movieId || m.title === rec.title);
        return movie ? { ...movie, aiReason: rec.reason } : null;
      }).filter(Boolean);

      setRecommendedMovies(matched || []);
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!weather || movies.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-accent" />
          <div>
            <h2 className="text-3xl font-bold text-gradient">AI Recommendations</h2>
            <p className="text-sm text-muted-foreground">Powered by Gemini AI</p>
          </div>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="btn-hero-secondary px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {explanation && (
        <div className="glass-card p-6 rounded-xl border border-accent/20">
          <p className="text-foreground/90 leading-relaxed">{explanation}</p>
        </div>
      )}

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-96 glass-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-64">
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
                releaseDate={movie.release_date}
              />
              {movie.aiReason && (
                <p className="mt-2 text-sm text-muted-foreground italic px-2">
                  {movie.aiReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
