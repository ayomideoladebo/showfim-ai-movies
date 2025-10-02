import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import MovieSection from "@/components/MovieSection";
import MovieCard from "@/components/MovieCard";
import WeatherWidget from "@/components/WeatherWidget";
import StatsWidget from "@/components/StatsWidget";
import AIRecommendations from "@/components/AIRecommendations";
import AIChatAssistant from "@/components/AIChatAssistant";
import FeaturedCollections from "@/components/FeaturedCollections";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collectionMovies, setCollectionMovies] = useState<Movie[]>([]);
  const [isViewingCollection, setIsViewingCollection] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    const collection = params.get("collection");
    
    if (query) {
      setIsSearching(true);
      setIsViewingCollection(false);
      searchMovies(query);
    } else if (collection) {
      setIsSearching(false);
      setIsViewingCollection(true);
      fetchCollection(collection);
    } else {
      setIsSearching(false);
      setIsViewingCollection(false);
      setSearchResults([]);
      setCollectionMovies([]);
    }
  }, [location.search]);

  const fetchCollection = async (endpoint: string) => {
    try {
      // Extract collection title from endpoint
      const titleMap: { [key: string]: string } = {
        'action': 'Action Packed',
        'romance': 'Romantic Tales',
        'sci-fi': 'Sci-Fi Universe',
        'award': 'Award Winners',
        'cult': 'Cult Classics',
        'hidden': 'Hidden Gems'
      };
      
      const key = Object.keys(titleMap).find(k => endpoint.toLowerCase().includes(k));
      setCollectionTitle(key ? titleMap[key] : 'Featured Collection');
      
      const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}&api_key=f5707e33d829c09755f8b9ca50da00bd`
      );
      const data = await response.json();
      setCollectionMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  const searchMovies = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=f5707e33d829c09755f8b9ca50da00bd&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  useEffect(() => {
    // Fetch trending movies for AI recommendations
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/trending/movie/week?api_key=f5707e33d829c09755f8b9ca50da00bd'
        );
        const data = await response.json();
        setTrendingMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {isSearching ? (
          // Search Results
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gradient mb-8">Search Results</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  rating={movie.vote_average}
                  releaseDate={movie.release_date}
                />
              ))}
            </div>
            {searchResults.length === 0 && (
              <p className="text-center text-muted-foreground text-xl mt-12">
                No movies found. Try a different search term.
              </p>
            )}
          </div>
        ) : isViewingCollection ? (
          // Collection Results
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gradient">{collectionTitle}</h1>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                ← Back to Home
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {collectionMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  rating={movie.vote_average}
                  releaseDate={movie.release_date}
                />
              ))}
            </div>
          </div>
        ) : (
          // Homepage
          <>
            {/* Hero Slider */}
            <HeroSlider />

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 space-y-16 py-16">
              
              {/* Widgets Section - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <WeatherWidget 
                    onWeatherUpdate={(weatherData) => {
                      setWeather(weatherData);
                      setUserLocation(weatherData.location);
                    }} 
                  />
                  <StatsWidget />
                </div>
                
                {/* AI Recommendations - Takes 2 columns */}
                <div className="lg:col-span-2">
                  {weather && trendingMovies.length > 0 && (
                    <AIRecommendations 
                      weather={weather}
                      location={userLocation}
                      movies={trendingMovies}
                    />
                  )}
                </div>
              </div>

              {/* Featured Collections - Replaces Genres */}
              <FeaturedCollections />

              {/* Divider with Glow */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="glass-card px-6 py-2 text-sm text-muted-foreground rounded-full">
                    Browse Movies
                  </span>
                </div>
              </div>

              {/* Movie Sections - Staggered Grid */}
              <div className="space-y-16">
                <MovieSection title="Trending Now" endpoint="trending/movie/week" />
                <MovieSection title="Top Rated" endpoint="movie/top_rated" />
                
                {/* Two Column Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                  <MovieSection title="Popular Movies" endpoint="movie/popular" />
                  <MovieSection title="Now Playing" endpoint="movie/now_playing" />
                </div>
                
                <MovieSection title="Upcoming" endpoint="movie/upcoming" />
              </div>
            </div>
          </>
        )}
      </main>

      {/* AI Chat Assistant */}
      <AIChatAssistant weather={weather} location={userLocation} />

      {/* Footer */}
      <footer className="glass border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Developed by{" "}
            <span className="text-primary font-semibold">Ayomide Oladebo</span>
            {" "}& <span className="text-accent font-semibold">Showfim</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
