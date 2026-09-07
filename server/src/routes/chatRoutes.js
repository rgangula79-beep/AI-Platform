import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { chatController } from "../controllers/chatController.js";
const router=Router();
router.post("/",authMiddleware,chatController);
export default router;
