import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, weather, location } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const TMDB_API_KEY = 'f5707e33d829c09755f8b9ca50da00bd';

    // Create context-aware system prompt
    const systemPrompt = `You are a concise AI movie expert for Showfim. Keep responses SHORT (2-3 sentences max).

Context: ${location || 'Unknown'}, ${weather ? `${weather.condition}, ${weather.temp_c}°C` : ''}

Instructions:
- Use **bold text** for movie titles and key phrases
- Be enthusiastic but brief
- Suggest 1-3 movies max per response
- Format: "**Movie Title** (Year) - brief reason"

Example: "Perfect for this weather! **The Shawshank Redemption** (1994) - uplifting drama, or **Inception** (2010) - mind-bending action."`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI chat response generated');

    // Try to extract movie titles and search for them in TMDB
    const movieTitles = extractMovieTitles(aiResponse);
    let movieData = [];

    if (movieTitles.length > 0) {
      // Search for mentioned movies in TMDB
      for (const title of movieTitles.slice(0, 5)) {
        try {
          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
          );
          const searchData = await searchResponse.json();
          if (searchData.results && searchData.results.length > 0) {
            movieData.push(searchData.results[0]);
          }
        } catch (e) {
          console.error('Error searching movie:', title, e);
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: aiResponse,
        movies: movieData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to extract movie titles from AI response
function extractMovieTitles(text: string): string[] {
  const titles: string[] = [];
  
  // Look for quoted movie titles
  const quotedMatches = text.match(/"([^"]+)"/g);
  if (quotedMatches) {
    titles.push(...quotedMatches.map(m => m.replace(/"/g, '')));
  }
  
  // Look for common patterns like "Movie Name (Year)"
  const moviePatterns = text.match(/([A-Z][a-z\s&:]+(?:\s[A-Z][a-z]+)*)\s*\(\d{4}\)/g);
  if (moviePatterns) {
    titles.push(...moviePatterns.map(m => m.replace(/\s*\(\d{4}\)/, '')));
  }
  
  return [...new Set(titles)]; // Remove duplicates
}
