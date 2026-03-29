import "dotenv/config";
import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(cors());
app.use(express.json());

// AI Resume routes
app.use("/api/resume", resumeRoutes);

app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
