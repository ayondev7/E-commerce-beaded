import { Router } from "express";
import authController from "./authController.js";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/google/signin", authController.googleSignin);

router.post("/credential/signup", upload.single("image"), authController.credentialSignup);
router.post("/credential/signin", authController.credentialSignin);
router.post("/guest/signin", authController.guestSignin);

router.post("/verify", authController.verifyAuth);

router.get("/get-my-info", autMiddleware, authController.getMyInfo);
router.patch("/update-my-info", autMiddleware, authController.updateMyInfo);

export default router;
