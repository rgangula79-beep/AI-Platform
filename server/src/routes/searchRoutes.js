import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { searchController } from "../controllers/searchController.js";
const router=Router();
router.get("/",authMiddleware,searchController);
router.post("/",authMiddleware,searchController);
export default router;
