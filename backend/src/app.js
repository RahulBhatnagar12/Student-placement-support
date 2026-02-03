import express from "express";
import cors from "cors";
import placementRoutes from "./routes/PlacementRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

console.log("🔥 BACKEND APP.JS LOADED 🔥");

const app = express();

/* 🔥 ES MODULE dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* CORS */
app.use(
  cors({
    origin: ["http://localhost:8080","https://student-placement-support.netlify.app/"],

    credentials: true,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Placement Backend is running 🚀",
  });
});
/* ✅ THIS LINE FIXES PDF 404 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/placements", placementRoutes);

export default app;
