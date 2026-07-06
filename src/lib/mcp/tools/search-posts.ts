import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_posts",
  title: "Search posts",
  description: "Search public posts on SocialHub by keyword. Returns id, content, category, and engagement counts.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Keyword to search post content for."),
    limit: z.number().int().min(1).max(50).default(10).describe("Max results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, category, likes_count, comments_count, shares_count, created_at")
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
