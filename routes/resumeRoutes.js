import { Router } from "express";
import { refineResume } from "../services/aiService.js";

const router = Router();

// POST /api/resume/refine
router.post("/refine", async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText?.trim()) {
    return res.status(400).json({ error: "Resume text is required" });
  }

  try {
    const result = await refineResume(resumeText);
    res.json(result);
  } catch (error) {
    console.error("Resume refinement error:", error.message);
    res.status(500).json({ error: "Failed to refine resume. Please try again." });
  }
});

export default router;
