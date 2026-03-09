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

// Spam rate limits
const SPAM_LIMITS = {
  posts_per_minute: 3,
  posts_per_hour: 15,
  comments_per_minute: 10,
  messages_per_minute: 20,
};

// Explicit keyword lists
const EXPLICIT_KEYWORDS = [
  "porn", "pornography", "xxx", "nsfw", "nude", "nudes", "nudity",
  "sex tape", "onlyfans", "escort", "prostitut", "strip club",
  "adult content", "18+", "x-rated", "xrated", "hentai",
  "explicit", "erotic", "fetish", "bdsm", "orgasm",
  "masturbat", "genital", "penis", "vagina", "anal sex",
  "blowjob", "handjob", "threesome", "gangbang", "milf",
  "camgirl", "sexting", "dick pic", "booty call",
];

// Scam/fraud keywords
const SCAM_KEYWORDS = [
  "send money first", "wire transfer", "western union", "moneygram",
  "bitcoin investment", "crypto investment", "guaranteed returns",
  "double your money", "100% profit", "risk-free investment",
  "make money fast", "get rich quick", "mlm", "pyramid scheme",
  "nigerian prince", "inheritance claim", "lottery winner",
  "free iphone", "free gift card", "click here to claim",
  "urgent action required", "account suspended", "verify your identity",
  "limited time offer", "act now", "don't miss out",
  "work from home", "earn $1000/day", "passive income secret",
  "dm for details", "whatsapp me", "telegram me",
];

// Hate speech keywords
const HATE_SPEECH_KEYWORDS = [
  "kill yourself", "kys", "go die", "hope you die",
  "retard", "faggot", "nigger", "chink", "spic",
  "white trash", "sand nigger", "towelhead",
];

// Suspicious link patterns
const SUSPICIOUS_LINK_PATTERNS = [
  /bit\.ly/i, /tinyurl/i, /t\.co/i,
  /\.(ru|cn|tk|ml|ga|cf)$/i,
  /free.*gift/i, /claim.*prize/i,
  /login.*verify/i, /account.*suspended/i,
];

// Known malicious domains (sample)
const MALICIOUS_DOMAINS = [
  "phishing-site.com", "malware-download.net",
  // Add more known malicious domains
];

function hashContent(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function containsExplicitText(text: string): { isExplicit: boolean; matchedTerms: string[] } {
  const lowerText = text.toLowerCase();
  const matched = EXPLICIT_KEYWORDS.filter((kw) => lowerText.includes(kw));
  return { isExplicit: matched.length > 0, matchedTerms: matched };
}

function containsScamContent(text: string): { isScam: boolean; matchedTerms: string[] } {
  const lowerText = text.toLowerCase();
  const matched = SCAM_KEYWORDS.filter((kw) => lowerText.includes(kw));
  return { isScam: matched.length >= 2 || (matched.length >= 1 && lowerText.includes("http")), matchedTerms: matched };
}

function containsHateSpeech(text: string): { isHate: boolean; matchedTerms: string[] } {
  const lowerText = text.toLowerCase();
  const matched = HATE_SPEECH_KEYWORDS.filter((kw) => lowerText.includes(kw));
  return { isHate: matched.length > 0, matchedTerms: matched };
}

function extractLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  return text.match(urlRegex) || [];
}

function checkSuspiciousLinks(links: string[]): { isSuspicious: boolean; flaggedLinks: string[] } {
  const flagged: string[] = [];
  
  for (const link of links) {
    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_LINK_PATTERNS) {
      if (pattern.test(link)) {
        flagged.push(link);
        break;
      }
    }
    
    // Check for known malicious domains
    for (const domain of MALICIOUS_DOMAINS) {
      if (link.includes(domain)) {
        flagged.push(link);
        break;
      }
    }
  }
  
  return { isSuspicious: flagged.length > 0, flaggedLinks: flagged };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { content_type, text_content, image_base64, check_spam } = await req.json();

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
          message: `🚫 Your account is temporarily restricted until ${new Date(activeBan.ends_at).toLocaleString()}. You cannot post, upload media, or comment during this period.`,
          ban_ends_at: activeBan.ends_at,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check trust score and restrictions
    const { data: trustData } = await adminClient
      .from("user_trust_scores")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (trustData?.is_restricted) {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "account_restricted",
          message: `⚠️ Your account is restricted: ${trustData.restriction_reason || "Suspicious activity detected"}. Please verify your account to continue.`,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Spam rate limiting check
    if (check_spam) {
      const actionType = content_type === "comment" ? "comment" : content_type === "message" ? "message" : "post";
      const limit = actionType === "comment" ? SPAM_LIMITS.comments_per_minute : 
                    actionType === "message" ? SPAM_LIMITS.messages_per_minute : 
                    SPAM_LIMITS.posts_per_minute;
      
      // Check rate
      const { data: rateCount } = await adminClient.rpc("check_spam_rate", {
        check_user_id: user.id,
        action: actionType,
        minutes: 1,
      });

      if (rateCount && rateCount >= limit) {
        // Update spam score
        await adminClient.from("user_trust_scores").upsert({
          user_id: user.id,
          spam_score: (trustData?.spam_score || 0) + 1,
        }, { onConflict: "user_id" });

        return new Response(
          JSON.stringify({
            allowed: false,
            reason: "rate_limited",
            violation_type: "spam",
            message: `🚫 Slow down! You're posting too fast. Please wait a moment before trying again.`,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check for duplicate content
      if (text_content) {
        const contentHash = hashContent(text_content.toLowerCase().trim());
        const { data: duplicates } = await adminClient
          .from("spam_tracking")
          .select("id")
          .eq("user_id", user.id)
          .eq("content_hash", contentHash)
          .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .limit(1);

        if (duplicates && duplicates.length > 0) {
          return new Response(
            JSON.stringify({
              allowed: false,
              reason: "duplicate_content",
              violation_type: "spam",
              message: `⚠️ You've already posted similar content recently. Please share something new!`,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Track this action
        await adminClient.from("spam_tracking").insert({
          user_id: user.id,
          action_type: actionType,
          content_hash: contentHash,
        });
      }
    }

    let isViolation = false;
    let violationType = "other";
    let aiConfidence = 0;
    let contentPreview = "";
    let warningMessage = "";

    // 4. Text moderation
    if (text_content) {
      contentPreview = text_content.substring(0, 200);

      // Check for explicit content
      const explicitCheck = containsExplicitText(text_content);
      if (explicitCheck.isExplicit) {
        isViolation = true;
        violationType = "explicit_text";
        aiConfidence = 0.95;
        warningMessage = "⚠️ Your content contains explicit or adult material that violates our community guidelines.";
      }

      // Check for scam content
      if (!isViolation) {
        const scamCheck = containsScamContent(text_content);
        if (scamCheck.isScam) {
          isViolation = true;
          violationType = "scam";
          aiConfidence = 0.9;
          warningMessage = "🚨 Your post appears to contain scam or fraudulent content. This type of content is not allowed on this platform.";
        }
      }

      // Check for hate speech
      if (!isViolation) {
        const hateCheck = containsHateSpeech(text_content);
        if (hateCheck.isHate) {
          isViolation = true;
          violationType = "hate_speech";
          aiConfidence = 0.95;
          warningMessage = "🚫 Your content contains hate speech or abusive language. This is strictly prohibited.";
        }
      }

      // Check for suspicious links
      if (!isViolation) {
        const links = extractLinks(text_content);
        if (links.length > 0) {
          const linkCheck = checkSuspiciousLinks(links);
          if (linkCheck.isSuspicious) {
            isViolation = true;
            violationType = "unsafe_link";
            aiConfidence = 0.85;
            warningMessage = "⚠️ Your post contains potentially unsafe or suspicious links. For security reasons, this content has been blocked.";
          }
        }
      }

      // Use AI for deeper analysis if no violation found yet
      if (!isViolation && LOVABLE_API_KEY) {
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
                  content: `You are a content moderation AI for a family-friendly social platform. Analyze the text for:
1. Sexual content, innuendo, adult services
2. Scam patterns: fake investments, crypto scams, phishing, "send money first"
3. Hate speech, harassment, bullying, racism
4. Spam patterns: repetitive content, excessive self-promotion
5. Threats or violence

Respond with ONLY JSON: {"is_violation": boolean, "violation_type": "nudity"|"sexual_content"|"scam"|"phishing"|"hate_speech"|"harassment"|"spam"|"violence"|"other"|"none", "confidence": 0.0-1.0, "reason": "brief explanation"}`,
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
                if (parsed.is_violation && parsed.confidence > 0.75) {
                  isViolation = true;
                  violationType = parsed.violation_type || "other";
                  aiConfidence = parsed.confidence;
                  warningMessage = getViolationMessage(violationType, parsed.reason);
                }
              }
            } catch {
              // AI response parsing failed
            }
          }
        } catch {
          // AI call failed
        }
      }
    }

    // 5. Image moderation
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
                content: `You are a content moderation AI. Analyze this image for:
1. Nudity (full or partial)
2. Sexual content or poses
3. Pornographic material
4. Violence or gore
5. Hate symbols or offensive imagery
6. Scam/fraud indicators (fake giveaways, phishing screens)

Respond with ONLY JSON: {"is_violation": boolean, "violation_type": "nudity"|"sexual_content"|"pornographic"|"violence"|"hate_speech"|"scam"|"other"|"none", "confidence": 0.0-1.0}`,
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
                warningMessage = getViolationMessage(violationType);
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

    // 6. If violation detected, record it and apply consequences
    if (isViolation) {
      const { data: existingStats } = await adminClient
        .from("user_moderation_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const currentViolations = existingStats?.total_violations || 0;
      const newViolationCount = currentViolations + 1;

      const { data: violation } = await adminClient.from("content_violations").insert({
        user_id: user.id,
        violation_type: violationType,
        content_type: content_type || "text",
        content_preview: contentPreview,
        ai_confidence: aiConfidence,
        warning_number: newViolationCount,
      }).select().single();

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

      await adminClient.from("user_moderation_stats").upsert({
        user_id: user.id,
        total_violations: newViolationCount,
        total_warnings: newViolationCount,
        is_currently_banned: banHours > 0,
        current_ban_ends_at: banEndsAt,
      }, { onConflict: "user_id" });

      // Update trust score negatively
      await adminClient.from("user_trust_scores").upsert({
        user_id: user.id,
        negative_interactions: (trustData?.negative_interactions || 0) + 1,
      }, { onConflict: "user_id" });

      // Build final message
      if (!warningMessage) {
        warningMessage = getViolationMessage(violationType);
      }
      
      if (newViolationCount <= 2) {
        warningMessage = `⚠️ Warning (${newViolationCount}/5): ${warningMessage}`;
      } else if (banHours > 0) {
        warningMessage = `🚫 Your account has been restricted for ${banHours} hours due to repeated violations (${newViolationCount}/5). ${warningMessage}`;
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

function getViolationMessage(type: string, reason?: string): string {
  const messages: Record<string, string> = {
    nudity: "This content contains nudity which is not allowed.",
    sexual_content: "This content contains sexual material which violates our guidelines.",
    explicit_text: "This content contains explicit language that is not allowed.",
    pornographic: "Pornographic content is strictly prohibited.",
    scam: "This appears to be scam or fraudulent content. Posting scams is illegal and will result in account termination.",
    phishing: "This content contains phishing attempts which are illegal.",
    hate_speech: "Hate speech and discriminatory content is not tolerated.",
    harassment: "Harassment and bullying is not allowed on this platform.",
    spam: "This appears to be spam content.",
    unsafe_link: "This content contains potentially unsafe or malicious links.",
    violence: "Violent content is not allowed.",
    bot_activity: "Automated or bot-like activity detected.",
    other: reason || "This content violates our community guidelines.",
  };
  return messages[type] || messages.other;
}
