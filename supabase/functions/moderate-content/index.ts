import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Ban duration mapping based on violation count
const BAN_DURATIONS: Record<number, number> = {
  1: 0,    // Warning only
  2: 0,    // Warning only
  3: 24,   // 24 hours
  4: 48,   // 48 hours
  5: 72,   // 3 days
};

// Explicit keyword lists for quick text filtering
const EXPLICIT_KEYWORDS = [
  "porn", "pornography", "xxx", "nsfw", "nude", "nudes", "nudity",
  "sex tape", "onlyfans", "escort", "prostitut", "strip club",
  "adult content", "18+", "x-rated", "xrated", "hentai",
  "explicit", "erotic", "fetish", "bdsm", "orgasm",
  "masturbat", "genital", "penis", "vagina", "anal sex",
  "blowjob", "handjob", "threesome", "gangbang", "milf",
  "camgirl", "sexting", "dick pic", "booty call",
];

function containsExplicitText(text: string): { isExplicit: boolean; matchedTerms: string[] } {
  const lowerText = text.toLowerCase();
  const matched = EXPLICIT_KEYWORDS.filter((kw) => lowerText.includes(kw));
  return { isExplicit: matched.length > 0, matchedTerms: matched };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Create user-context client to get the authenticated user
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create admin client for DB operations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { content_type, text_content, image_base64 } = await req.json();

    // 1. Check if user is currently banned
    const { data: activeBan } = await adminClient
      .from("user_bans")
      .select("*")
      .eq("user_id", user.id)
      .eq("ban_status", "active")
      .gt("ends_at", new Date().toISOString())
      .order("ends_at", { ascending: false })
      .limit(1)
      .single();

    if (activeBan) {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "account_banned",
          message: `Your account is temporarily restricted until ${new Date(activeBan.ends_at).toLocaleString()}. You cannot post, upload media, or comment during this period.`,
          ban_ends_at: activeBan.ends_at,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let isViolation = false;
    let violationType = "other";
    let aiConfidence = 0;
    let contentPreview = "";

    // 2. Text moderation
    if (text_content) {
      contentPreview = text_content.substring(0, 200);
      const keywordCheck = containsExplicitText(text_content);

      if (keywordCheck.isExplicit) {
        isViolation = true;
        violationType = "explicit_text";
        aiConfidence = 0.95;
      } else if (LOVABLE_API_KEY) {
        // Use AI for deeper text analysis
        try {
          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [
                {
                  role: "system",
                  content: `You are a content moderation AI. Analyze the following text and determine if it contains any of these violations:
- Sexual content or innuendo
- Adult services promotion
- Pornographic references or links
- Vulgar sexual language
- Nudity descriptions
- Explicit adult content

Respond with ONLY a JSON object: {"is_violation": boolean, "violation_type": "nudity"|"sexual_content"|"explicit_text"|"pornographic"|"adult_services"|"vulgar_content"|"other"|"none", "confidence": 0.0-1.0}
Do NOT include any other text.`,
                },
                { role: "user", content: text_content },
              ],
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const aiText = aiData.choices?.[0]?.message?.content || "";
            try {
              const jsonMatch = aiText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.is_violation && parsed.confidence > 0.7) {
                  isViolation = true;
                  violationType = parsed.violation_type || "other";
                  aiConfidence = parsed.confidence;
                }
              }
            } catch {
              // AI response parsing failed, rely on keyword check
            }
          }
        } catch {
          // AI call failed, rely on keyword check only
        }
      }
    }

    // 3. Image moderation (base64 image analysis)
    if (image_base64 && !isViolation && LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are a content moderation AI for a family-friendly platform. Analyze this image and determine if it contains:
- Nudity (full or partial)
- Sexual content or poses
- Pornographic material
- Explicit adult content
- Vulgar or sexual dance content
- Inappropriate 18+ material

Respond with ONLY a JSON object: {"is_violation": boolean, "violation_type": "nudity"|"sexual_content"|"pornographic"|"vulgar_content"|"other"|"none", "confidence": 0.0-1.0}
Do NOT include any other text. Be strict - this is a family-friendly platform.`,
              },
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: { url: `data:image/jpeg;base64,${image_base64}` },
                  },
                ],
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const aiText = aiData.choices?.[0]?.message?.content || "";
          try {
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.is_violation && parsed.confidence > 0.6) {
                isViolation = true;
                violationType = parsed.violation_type || "nudity";
                aiConfidence = parsed.confidence;
                contentPreview = "[Image flagged by AI]";
              }
            }
          } catch {
            // parsing failed
          }
        }
      } catch {
        // AI image check failed
      }
    }

    // 4. If violation detected, record it and apply consequences
    if (isViolation) {
      // Get or create moderation stats
      const { data: existingStats } = await adminClient
        .from("user_moderation_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const currentViolations = existingStats?.total_violations || 0;
      const newViolationCount = currentViolations + 1;

      // Record the violation
      const { data: violation } = await adminClient.from("content_violations").insert({
        user_id: user.id,
        violation_type: violationType,
        content_type: content_type || "text",
        content_preview: contentPreview,
        ai_confidence: aiConfidence,
        warning_number: newViolationCount,
      }).select().single();

      // Determine ban duration
      const banHours = newViolationCount >= 5
        ? 72
        : BAN_DURATIONS[newViolationCount] || 0;

      let banEndsAt: string | null = null;

      if (banHours > 0 && violation) {
        const endsAt = new Date();
        endsAt.setHours(endsAt.getHours() + banHours);
        banEndsAt = endsAt.toISOString();

        await adminClient.from("user_bans").insert({
          user_id: user.id,
          reason: `Violation #${newViolationCount}: ${violationType}`,
          violation_id: violation.id,
          ban_duration_hours: banHours,
          starts_at: new Date().toISOString(),
          ends_at: banEndsAt,
        });
      }

      // Upsert moderation stats
      await adminClient.from("user_moderation_stats").upsert({
        user_id: user.id,
        total_violations: newViolationCount,
        total_warnings: newViolationCount,
        is_currently_banned: banHours > 0,
        current_ban_ends_at: banEndsAt,
      }, { onConflict: "user_id" });

      // Build response message
      let warningMessage = "";
      if (newViolationCount <= 2) {
        warningMessage = `⚠️ Warning (${newViolationCount}/5): Your upload contains content that violates our community guidelines. Adult or explicit content is not allowed on this platform.`;
      } else if (banHours > 0) {
        warningMessage = `🚫 Your account has been temporarily restricted for ${banHours} hours due to repeated violations (${newViolationCount}/5). You cannot post, upload media, or comment during this period.`;
      }

      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "content_violation",
          violation_type: violationType,
          warning_number: newViolationCount,
          is_banned: banHours > 0,
          ban_duration_hours: banHours,
          ban_ends_at: banEndsAt,
          message: warningMessage,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Content is clean
    return new Response(
      JSON.stringify({ allowed: true, message: "Content approved" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Moderation error:", error);
    return new Response(
      JSON.stringify({ error: "Moderation service error", allowed: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
