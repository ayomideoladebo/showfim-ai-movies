import { Film, Heart, Zap, Star, Globe, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Collection {
  id: string;
  title: string;
  description: string;
  icon: any;
  endpoint: string;
  gradient: string;
}

const collections: Collection[] = [
  {
    id: "action-packed",
    title: "Action Packed",
    description: "High-octane thrills and explosive entertainment",
    icon: Zap,
    endpoint: "discover/movie?with_genres=28&sort_by=popularity.desc",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "romantic-tales",
    title: "Romantic Tales",
    description: "Love stories that touch the heart",
    icon: Heart,
    endpoint: "discover/movie?with_genres=10749&sort_by=vote_average.desc",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "sci-fi-universe",
    title: "Sci-Fi Universe",
    description: "Explore worlds beyond imagination",
    icon: Globe,
    endpoint: "discover/movie?with_genres=878&sort_by=popularity.desc",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: "award-winners",
    title: "Award Winners",
    description: "Critically acclaimed masterpieces",
    icon: Trophy,
    endpoint: "movie/top_rated",
    gradient: "from-yellow-500/20 to-amber-500/20",
  },
  {
    id: "cult-classics",
    title: "Cult Classics",
    description: "Timeless films that defined cinema",
    icon: Star,
    endpoint: "discover/movie?vote_average.gte=8&vote_count.gte=1000",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  {
    id: "hidden-gems",
    title: "Hidden Gems",
    description: "Underrated films worth discovering",
    icon: Film,
    endpoint: "discover/movie?vote_average.gte=7&vote_count.gte=100&vote_count.lte=500",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
];

const FeaturedCollections = () => {
  const navigate = useNavigate();

  const handleCollectionClick = (endpoint: string) => {
    // Navigate with collection endpoint as query param
    navigate(`/?collection=${encodeURIComponent(endpoint)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gradient mb-2">Featured Collections</h2>
          <p className="text-muted-foreground">Curated selections for every mood</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => {
          const Icon = collection.icon;
          return (
            <button
              key={collection.id}
              onClick={() => handleCollectionClick(collection.endpoint)}
              className="group relative glass-card p-6 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 text-left"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 glass rounded-xl group-hover:glow-cyan transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Collection
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-neon transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Collection</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCollections;
