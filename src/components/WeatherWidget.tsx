import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  location: string;
  region: string;
  country: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_kph: number;
  localtime: string;
}

interface WeatherWidgetProps {
  onWeatherUpdate?: (weather: WeatherData) => void;
}

const WeatherWidget = ({ onWeatherUpdate }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(`${lat},${lon}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default location
          fetchWeather("London");
        }
      );
    } else {
      fetchWeather("London");
    }
  };

  const fetchWeather = async (loc: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { location: loc }
      });

      if (error) throw error;

      setWeather(data);
      setLocation(data.location);
      if (onWeatherUpdate) {
        onWeatherUpdate(data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-6 h-6" />;
    
    const condition = weather.condition.toLowerCase();
    if (condition.includes("rain")) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (condition.includes("sun") || condition.includes("clear")) return <Sun className="w-6 h-6 text-yellow-400" />;
    return <Cloud className="w-6 h-6 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="glass-card p-4 rounded-xl animate-pulse">
        <div className="h-20 bg-muted/20 rounded" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card p-6 rounded-xl border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neon">{weather.location}</h3>
          <p className="text-sm text-muted-foreground">{weather.region}, {weather.country}</p>
        </div>
        {getWeatherIcon()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gradient">{Math.round(weather.temp_c)}°C</span>
          <span className="text-sm text-muted-foreground">{weather.condition}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-primary" />
            <span className="text-sm">{Math.round(weather.wind_kph)} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-primary" />
            <span className="text-sm">{weather.humidity}% humidity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
