import { defineMcp } from "@lovable.dev/mcp-js";
import searchPostsTool from "./tools/search-posts";
import getTrendingPostsTool from "./tools/get-trending-posts";

export default defineMcp({
  name: "socialhub-mcp",
  title: "SocialHub MCP",
  version: "0.1.0",
  instructions:
    "Tools for SocialHub: search public posts and fetch trending posts. Read-only.",
  tools: [searchPostsTool, getTrendingPostsTool],
});
