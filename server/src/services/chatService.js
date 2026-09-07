import { query } from "../config/database.js";
import { generateAnswer } from "../providers/ai/openaiProvider.js";

const ownerName = process.env.OWNER_NAME || "Gangula Rajesh Kumar";
const ownerEmail = process.env.OWNER_EMAIL || "rgangula79@gmail.com";

const ownerInstructions = `
You are the AI assistant for AI Platform.

PLATFORM INFORMATION:
- Platform name: AI Platform
- Owner and creator: ${ownerName}
- Owner email: ${ownerEmail}

OWNER IDENTITY:
${ownerName} is the owner, creator, founder, and boss of AI Platform.

If the user asks:
- Who is the boss?
- Who owns this AI?
- Who created AI Platform?
- Who is the owner?
- Who is the founder?
- Who made this platform?
- Who created this application?
- Who developed this AI platform?

Answer clearly:
"${ownerName} is the owner and creator of AI Platform."

Do not claim that another person is the owner or creator of AI Platform.

For normal questions, answer naturally and do not unnecessarily mention the owner.

When fresh/current information is needed, use web search when available and clearly distinguish verified information from uncertain information.
`;

export async function ensureConversation(
  userId,
  conversationId,
  firstText = ""
) {
  if (conversationId) {
    const { rows } = await query(
      `SELECT id, title
       FROM conversations
       WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    if (rows[0]) {
      return rows[0];
    }
  }

  const title =
    (firstText || "New conversation").trim().slice(0, 80) ||
    "New conversation";

  const { rows } = await query(
    `INSERT INTO conversations (user_id, title)
     VALUES ($1, $2)
     RETURNING id, title`,
    [userId, title]
  );

  return rows[0];
}

export async function chat({
  userId,
  conversationId,
  message,
  useWeb
}) {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const conversation = await ensureConversation(
    userId,
    conversationId,
    message
  );

  const previous = await query(
    `SELECT role, content
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at DESC
     LIMIT 30`,
    [conversation.id]
  );

  const history = previous.rows.reverse();

  await query(
    `INSERT INTO messages (conversation_id, role, content)
     VALUES ($1, 'user', $2)`,
    [conversation.id, message.trim()]
  );

  const answer = await generateAnswer({
    messages: [
      {
        role: "system",
        content: ownerInstructions
      },
      ...history,
      {
        role: "user",
        content: message.trim()
      }
    ],
    useWeb: Boolean(useWeb)
  });

  const answerText =
    answer?.text ||
    "I couldn't generate an answer right now. Please try again.";

  const sources = Array.isArray(answer?.sources)
    ? answer.sources
    : [];

  const { rows } = await query(
    `INSERT INTO messages (
       conversation_id,
       role,
       content,
       sources
     )
     VALUES ($1, 'assistant', $2, $3)
     RETURNING id, content, sources, created_at`,
    [
      conversation.id,
      answerText,
      JSON.stringify(sources)
    ]
  );

  await query(
    `UPDATE conversations
     SET updated_at = NOW()
     WHERE id = $1`,
    [conversation.id]
  );

  await query(
    `INSERT INTO usage (user_id, feature, units)
     VALUES ($1, 'chat', 1)`,
    [userId]
  );

  return {
    conversationId: conversation.id,
    message: rows[0],
    sources
  };
}