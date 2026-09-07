import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadController,listFilesController,deleteFileController } from "../controllers/fileController.js";
const router=Router();
router.get("/",authMiddleware,listFilesController);
router.post("/",authMiddleware,upload.single("file"),uploadController);
router.delete("/:id",authMiddleware,deleteFileController);
export default router;
