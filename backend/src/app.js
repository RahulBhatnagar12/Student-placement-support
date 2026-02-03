import express from "express";
import cors from "cors";
import placementRoutes from "./routes/PlacementRoutes.js";
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

console.log("🔥 BACKEND APP.JS LOADED 🔥");
dotenv.config();
const app = express();

/* 🔥 ES MODULE dirname fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* CORS */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (
        origin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
     credentials: true,
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Placement Backend is running 🚀",
  });
});
/* ✅ THIS LINE FIXES PDF 404 */
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/placements", placementRoutes);

export default app;
