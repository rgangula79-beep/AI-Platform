import { chat } from "../services/chatService.js";
import { ok, fail } from "../utils/response.js";

export async function chatController(req,res) {
  const message = String(req.body.message || "").trim();
  if (!message) return fail(res,"Message is required",400);
  if (message.length > 12000) return fail(res,"Message is too long",400);

  try {
    return ok(res, await chat({
      userId: req.user.id,
      conversationId: req.body.conversationId || null,
      message,
      useWeb: req.body.useWeb
    }));
  } catch(e) {
    return fail(res,e.message || "Chat failed",500);
  }
}
