import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
    const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TMDB_API_KEY || !DISCORD_WEBHOOK_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch now playing movies from TMDB
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const tmdbData = await tmdbRes.json();
    const movies = tmdbData.results || [];

    // Get already notified movie IDs
    const { data: notified } = await supabase
      .from("notified_movies")
      .select("tmdb_id");

    const notifiedIds = new Set((notified || []).map((n: any) => n.tmdb_id));

    // Filter new movies
    const newMovies = movies.filter((m: any) => !notifiedIds.has(m.id));

    let sentCount = 0;

    for (const movie of newMovies) {
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

      const movieUrl = `https://bloxwave.lovable.app/#/movie/${movie.id}`;

      const embed = {
        title: `🎬 ${movie.title}`,
        description: movie.overview?.slice(0, 200) || "No description available.",
        url: movieUrl,
        color: 0xd4a44a, // gold accent
        thumbnail: posterUrl ? { url: posterUrl } : undefined,
        fields: [
          { name: "⭐ Rating", value: `${movie.vote_average?.toFixed(1) || "N/A"}/10`, inline: true },
          { name: "📅 Release", value: movie.release_date || "TBA", inline: true },
        ],
        footer: { text: "Bloxwave • New Movie Alert" },
        timestamp: new Date().toISOString(),
      };

      const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🍿 **New movie now available!**`,
          embeds: [embed],
        }),
      });

      if (discordRes.ok) {
        await supabase.from("notified_movies").insert({
          tmdb_id: movie.id,
          title: movie.title,
        });
        sentCount++;
      }

      // Rate limit: wait 1s between messages
      if (newMovies.indexOf(movie) < newMovies.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return new Response(
      JSON.stringify({ success: true, newMovies: sentCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
