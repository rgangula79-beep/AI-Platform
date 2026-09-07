import { query as dbQuery } from "../config/database.js";
import { searchWeb } from "../providers/search/webSearchProvider.js";

export async function runSearch({ userId, q }) {
  const data = await searchWeb(q);
  await dbQuery(
    "INSERT INTO searches (user_id,query,results) VALUES ($1,$2,$3)",
    [userId, q, JSON.stringify(data.results)]
  );
  await dbQuery(
    "INSERT INTO usage (user_id,feature,units) VALUES ($1,'search',1)",
    [userId]
  );
  return data;
}
