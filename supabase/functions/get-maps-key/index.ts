import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve((req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const key = Deno.env.get('GOOGLE_API_KEY');
  if (!key) {
    return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ key }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
