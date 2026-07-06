import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_trending_posts",
  title: "Get trending posts",
  description: "Fetch currently trending posts on SocialHub, optionally filtered by category.",
  inputSchema: {
    category: z.string().trim().min(1).optional().describe("Optional category filter."),
    limit: z.number().int().min(1).max(50).default(10).describe("Max results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("posts")
      .select("id, content, category, likes_count, comments_count, shares_count, engagement_rate, created_at")
      .order("engagement_rate", { ascending: false, nullsFirst: false })
      .limit(limit);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
