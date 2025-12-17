import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for scraped content to avoid excessive API calls
let cachedContent: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async function scrapeSchoolfruitContent(): Promise<string> {
  // Check cache
  const now = Date.now();
  if (cachedContent && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Using cached content');
    return cachedContent;
  }

  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    console.error('FIRECRAWL_API_KEY not configured');
    throw new Error('Firecrawl not configured');
  }

  console.log('Scraping schoolfruit.nl...');

  // Scrape the main pages
  const pagesToScrape = [
    'https://www.schoolfruit.nl',
    'https://www.schoolfruit.nl/nl/pages/over-schoolfruit/',
    'https://www.schoolfruit.nl/nl/pages/faq/',
  ];

  let allContent = '';

  for (const url of pagesToScrape) {
    try {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const markdown = data.data?.markdown || data.markdown || '';
        if (markdown) {
          allContent += `\n\n--- Informatie van ${url} ---\n${markdown}`;
        }
      } else {
        console.error(`Failed to scrape ${url}:`, response.status);
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }

  if (!allContent) {
    // Fallback content if scraping fails
    allContent = `
Schoolfruit is een programma van de Europese Unie dat gratis groenten en fruit verstrekt aan basisscholen.
Het doel is kinderen kennis te laten maken met gezonde voeding.
Scholen ontvangen wekelijks vers fruit en groenten voor de leerlingen.
Het programma loopt van november tot juni.
Meer informatie is beschikbaar op www.schoolfruit.nl.
    `;
  }

  // Update cache
  cachedContent = allContent;
  cacheTimestamp = now;

  console.log('Scraped content length:', allContent.length);
  return allContent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Vraag is verplicht' }),
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

    // Get website content
    let websiteContent: string;
    try {
      websiteContent = await scrapeSchoolfruitContent();
    } catch (error) {
      console.error('Scraping error:', error);
      websiteContent = 'Schoolfruit is een Europees programma dat gratis fruit en groenten aan basisscholen verstrekt.';
    }

    const systemPrompt = `Je bent Annie de Ananas, een vriendelijke en behulpzame fruitvriendin die vragen beantwoordt over Schoolfruit en het EU Schoolfruit programma.

BELANGRIJKE REGELS:
- Stel jezelf voor als Annie de Ananas als dat passend is
- Beantwoord ALLEEN vragen die gerelateerd zijn aan Schoolfruit, het EU Schoolfruit programma, fruit en groenten op scholen, en de producten en dienstverlening
- Als de vraag NIET over Schoolfruit of gerelateerde onderwerpen gaat, zeg dan vriendelijk dat je alleen vragen over Schoolfruit kunt beantwoorden
- Baseer je antwoorden op de informatie van de Schoolfruit website
- Wees vriendelijk, enthousiast en behulpzaam
- Geef korte, duidelijke antwoorden
- Als je iets niet weet, zeg dat eerlijk en verwijs naar www.schoolfruit.nl
- Gebruik af en toe een ananas emoji 🍍 om je karakter te benadrukken

INFORMATIE VAN SCHOOLFRUIT.NL:
${websiteContent}`;

    console.log('Answering question:', question);

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
          { role: 'user', content: question }
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
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error('Geen antwoord ontvangen van AI');
    }

    console.log('Answer generated successfully');

    return new Response(
      JSON.stringify({ answer }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in schoolfruit-chat function:', error);
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
