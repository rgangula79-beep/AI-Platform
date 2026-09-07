import { env } from "../../config/env.js";

export async function searchWeb(query) {
  if (!env.tavilyKey) {
    return {
      results: [],
      configured: false,
      message: "Web search is not configured. Add TAVILY_API_KEY to server/.env."
    };
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_key: env.tavilyKey,
      query,
      search_depth: "advanced",
      max_results: 8,
      include_answer: false
    })
  });

  if (!response.ok) {
    throw new Error(`Search provider error: ${response.status}`);
  }

  const data = await response.json();
  return {
    results: (data.results || []).map(item => ({
      title: item.title,
      url: item.url,
      content: item.content,
      score: item.score
    })),
    configured: true
  };
}
