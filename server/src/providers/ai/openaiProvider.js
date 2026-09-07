import OpenAI from "openai";
import { env } from "../../config/env.js";

const instructions = `
You are the AI assistant inside a production web application.
Be accurate, useful, concise and transparent.
Never claim a fact is current unless you have reliable current data.
If web-search context is supplied, use it for current claims and include source URLs.
If you are uncertain, say so and explain what should be verified.
Do not invent citations, URLs, people, statistics or quotations.
Format answers with readable Markdown.
`;

export async function generateAnswer({ messages, useWeb = false }) {
  if (!env.openaiKey) {
    return {
      text: "AI is not configured yet. Add OPENAI_API_KEY to server/.env and restart the server.",
      sources: []
    };
  }

  const client = new OpenAI({ apiKey: env.openaiKey });

  const input = messages.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content
  }));

  const response = await client.responses.create({
    model: env.openaiModel,
    instructions,
    input,
    tools: useWeb ? [{ type: "web_search" }] : undefined,
    store: false
  });

  const sources = [];
  for (const item of response.output || []) {
    if (item.type === "message") {
      for (const part of item.content || []) {
        for (const ann of part.annotations || []) {
          if (ann.type === "url_citation" && ann.url) {
            sources.push({ title: ann.title || ann.url, url: ann.url });
          }
        }
      }
    }
  }

  return {
    text: response.output_text || "I could not generate an answer.",
    sources: [...new Map(sources.map(s => [s.url, s])).values()]
  };
}
