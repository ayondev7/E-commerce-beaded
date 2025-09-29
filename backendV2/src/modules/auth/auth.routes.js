import { Router } from "express";
import { me, signin, signup, googleSignin, helloWorld } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = Router();

// Create simple asyncHandler replacement
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post("/credential/signup", signup);
router.post("/credential/signin", asyncHandler(signin));
router.post("/google/signin", helloWorld);
router.get("/me", asyncHandler(me));
// Simple dummy route for quick testing
router.get("/dummy", (_req, res) => res.send("Hello from auth dummy route"));
router.get("/protected", authMiddleware, (_req, res) => res.json({ ok: true }));

export default router;
