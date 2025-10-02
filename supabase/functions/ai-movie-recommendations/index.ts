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
    const { weather, location, timeOfDay, movies } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create context-aware prompt
    const systemPrompt = `You are an AI movie expert that recommends movies based on weather, location, time of day, and user context. 
Provide personalized, thoughtful recommendations that match the mood and atmosphere. 
Always explain your reasoning in a natural, friendly way.`;

    const userPrompt = `Based on the following context, recommend 3-5 movies from the provided list and explain why they're perfect for right now:

Weather: ${weather.condition}, ${weather.temp_c}°C
Location: ${location}
Time: ${timeOfDay}
Available movies: ${movies.slice(0, 20).map((m: any) => m.title).join(', ')}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "movieId": number,
      "title": "string",
      "reason": "why this movie fits the current mood/weather/time"
    }
  ],
  "explanation": "A friendly 2-3 sentence overview of why these movies are perfect right now"
}`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI recommendations generated:', aiResponse);

    // Parse the JSON response from AI
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      parsedResponse = {
        recommendations: [],
        explanation: aiResponse
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-movie-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
