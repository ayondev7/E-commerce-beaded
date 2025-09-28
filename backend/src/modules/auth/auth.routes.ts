import { Router } from "express";
import { asyncHandler } from "@/utils/httpError";
import { me, signin, signup, googleSignin } from "./auth.controller";
import { authMiddleware } from "@/middleware/auth";

const router = Router();

router.post("/credential/signup", asyncHandler(signup));
router.post("/credential/signin", asyncHandler(signin));
router.post("/google/signin", asyncHandler(googleSignin));
router.get("/me", asyncHandler(me));
router.get("/protected", authMiddleware, (_req, res) => res.json({ ok: true }));

export default router;
