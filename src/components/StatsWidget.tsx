import { Film, Star, TrendingUp } from "lucide-react";

const StatsWidget = () => {
  return (
    <div className="glass-card p-6 rounded-xl border border-primary/20 space-y-4">
      <h3 className="text-lg font-semibold text-neon mb-4">Platform Stats</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 glass rounded-lg">
            <Film className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">150K+</div>
            <div className="text-xs text-muted-foreground">Movies Available</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 glass rounded-lg">
            <Star className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">8.5/10</div>
            <div className="text-xs text-muted-foreground">Average Rating</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 glass rounded-lg">
            <TrendingUp className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">99.9%</div>
            <div className="text-xs text-muted-foreground"> Stable Stream</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
