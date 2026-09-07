import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateProfile,history,conversation } from "../controllers/userController.js";
const router=Router();
router.put("/profile",authMiddleware,updateProfile);
router.get("/history",authMiddleware,history);
router.get("/history/:id",authMiddleware,conversation);
export default router;
