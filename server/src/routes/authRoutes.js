import { Router } from "express";
import passport from "passport";
import { registerController,loginController,guestController,meController,googleCallbackController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();
router.post("/register",authLimiter,registerController);
router.post("/login",authLimiter,loginController);
router.post("/guest",guestController);
router.get("/me",authMiddleware,meController);

router.get("/google",
  (req,res,next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({success:false,message:"Google OAuth is not configured"});
    }
    next();
  },
  passport.authenticate("google",{scope:["profile","email"],session:false})
);

router.get("/google/callback",
  passport.authenticate("google",{session:false,failureRedirect:"/api/auth/google/failure"}),
  googleCallbackController
);

router.get("/google/failure",(req,res)=>res.status(401).json({success:false,message:"Google login failed"}));
export default router;
