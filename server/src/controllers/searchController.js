import { runSearch } from "../services/searchService.js";
import { ok, fail } from "../utils/response.js";

export async function searchController(req,res) {
  const q = String(req.body.q || req.query.q || "").trim();
  if (!q) return fail(res,"Search query is required");
  if (q.length > 500) return fail(res,"Search query is too long");
  try { return ok(res, await runSearch({userId:req.user.id,q})); }
  catch(e) { return fail(res,e.message || "Search failed",500); }
}
