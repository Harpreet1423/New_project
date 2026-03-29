import { Router } from "express";
import { refineResume } from "../services/aiService.js";

const router = Router();

// POST /api/resume/refine
router.post("/refine", async (req, res) => {
  // Always set JSON content type so the client never sees an empty/HTML body
  res.setHeader("Content-Type", "application/json");

  const { resumeText } = req.body;

  if (!resumeText || !resumeText.trim()) {
    return res.status(400).json({ error: "Resume text is required" });
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({ error: "Resume text is too short. Please paste your full resume." });
  }

  try {
    const result = await refineResume(resumeText);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Resume refinement error:", error.message);
    return res.status(500).json({ error: "Failed to refine resume. Please try again." });
  }
});

export default router;
