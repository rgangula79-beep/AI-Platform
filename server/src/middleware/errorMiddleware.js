import { logger } from "../utils/logger.js";

export function errorMiddleware(err, req, res, next) {
  logger.error(err);
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
}
