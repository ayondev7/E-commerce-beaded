import { Router } from "express";
import authController from "./authController.js";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/google/signin", authController.googleSignin);

router.post("/credential/signup", upload.single("image"), authController.credentialSignup);
router.post("/credential/signin", authController.credentialSignin);

router.get("/me", autMiddleware, authController.getMyInfo);

export default router;
