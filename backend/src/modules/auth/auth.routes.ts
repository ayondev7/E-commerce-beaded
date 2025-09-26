import { Router } from "express";
import { asyncHandler } from "@/utils/httpError";
import { me, signin, signout, signup } from "./auth.controller";
import { optionalAuth, requireAuth } from "@/middleware/auth";

const router = Router();

router.post("/signup", asyncHandler(signup));
router.post("/signin", asyncHandler(signin));
router.post("/signout", asyncHandler(signout));
router.get("/me", optionalAuth, asyncHandler(me));
router.get("/protected", requireAuth, (_req, res) => res.json({ ok: true }));

export default router;
