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
    const { ingredients } = await req.json();
    
    if (!ingredients || typeof ingredients !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Ingrediënten zijn verplicht' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API configuratie probleem' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Je bent een vriendelijke kok voor kinderen. Maak leuke, simpele recepten die kinderen op school of thuis kunnen maken met hulp van een volwassene.

BELANGRIJKE REGELS:
- Gebruik ALLEEN de ingrediënten die de gebruiker heeft opgegeven
- Maak het recept simpel en geschikt voor kinderen (6-12 jaar)
- Gebruik duidelijke stappen met eenvoudige taal
- Voeg veiligheidswaarschuwingen toe waar nodig (bijv. bij snijden of warm water)
- Maak het leuk en enthousiast!
- Geef het recept een leuke naam
- Gebruik emoji's om het vrolijk te maken

FORMAT:
🍽️ [Leuke Receptnaam]

📝 Ingrediënten:
- [lijst met ingrediënten]

👨‍🍳 Stappen:
1. [Stap 1]
2. [Stap 2]
etc.

⚠️ Veiligheidstip: [Waar je op moet letten]

😋 Geniet ervan!`;

    console.log('Generating recipe for ingredients:', ingredients);

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
          { role: 'user', content: `Maak een leuk en simpel recept met deze ingrediënten: ${ingredients}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Te veel verzoeken, probeer het later nog eens' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service niet beschikbaar' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const recipe = data.choices?.[0]?.message?.content;

    if (!recipe) {
      throw new Error('Geen recept ontvangen van AI');
    }

    console.log('Recipe generated successfully');

    return new Response(
      JSON.stringify({ recipe }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Er ging iets mis'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
