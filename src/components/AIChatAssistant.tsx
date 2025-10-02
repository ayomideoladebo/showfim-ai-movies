import { useState } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MovieCard from "./MovieCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  movies?: any[];
}

interface AIChatAssistantProps {
  weather: any;
  location: string;
}

const AIChatAssistant = ({ weather, location }: AIChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI movie assistant powered by Gemini. Ask me anything about movies - I can suggest films based on your mood, find movies by actors or themes, or help you discover something perfect for right now!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message: userMessage,
          weather,
          location
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message,
        movies: data.movies || []
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 btn-hero p-4 rounded-full shadow-lg glow-cyan hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-96 h-[500px] glass-card rounded-xl border border-primary/20 flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-border/30 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-semibold text-gradient">AI Movie Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "glass-card border border-border/30"
                }`}>
                  <p 
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                  
                  {/* Display movie cards if present */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {msg.movies.slice(0, 3).map((movie) => (
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
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card border border-border/30 rounded-xl p-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me about movies..."
                className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-hero px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
