import { Router } from "express";
import { asyncHandler } from "@/utils/httpError";
import { me, signin, signout, signup } from "./auth.controller";
import { authMiddleware } from "@/middleware/auth";

const router = Router();

router.post("/signup", asyncHandler(signup));
router.post("/signin", asyncHandler(signin));
router.post("/signout", asyncHandler(signout));
router.get("/me", asyncHandler(me));
router.get("/protected", authMiddleware, (_req, res) => res.json({ ok: true }));

export default router;
