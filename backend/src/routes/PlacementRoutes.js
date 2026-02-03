import express from "express";
import Placement from "../models/Placement.js";
import upload from "../utils/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* =====================================================
   POST – Submit Placement Experience (PDF + Photo)
   ===================================================== */
router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      /* ------------------ PDF VALIDATION ------------------ */
      if (!req.files?.pdf?.[0]?.buffer) {
        return res.status(400).json({ message: "PDF not uploaded properly" });
      }

      /* ------------------ UPLOAD PDF ------------------ */
      const pdfBase64 = req.files.pdf[0].buffer.toString("base64");

      const pdfUpload = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${pdfBase64}`,
        {
          resource_type: "raw",
          folder: "placement_pdfs",
        }
      );

      /* ------------------ UPLOAD PHOTO (OPTIONAL) ------------------ */
      let photoUrl = null;

      if (req.files?.photo?.[0]?.buffer) {
        const photoBase64 =
          req.files.photo[0].buffer.toString("base64");

        const photoUpload = await cloudinary.uploader.upload(
          `data:${req.files.photo[0].mimetype};base64,${photoBase64}`,
          {
            folder: "placement_photos",
          }
        );

        photoUrl = photoUpload.secure_url;
      }

      /* ------------------ SAVE TO MONGODB ------------------ */
      const placement = await Placement.create({
        studentName: req.body.studentName,
        rollNumber: req.body.rollNumber,
        branch: req.body.branch,
        programme: req.body.programme,
        personalNote: req.body.personalNote || "",

        companiesShortlisted: req.body.companiesShortlisted
          ? JSON.parse(req.body.companiesShortlisted)
          : [],

        selectedCompany: req.body.selectedCompany,
        selectedProfile: req.body.selectedProfile,
        selectionProcess: req.body.selectionProcess,

        technicalQuestions: req.body.technicalQuestions || "",
        hrQuestions: req.body.hrQuestions || "",
        preparationResources: req.body.preparationResources || "",
        adviceDos: req.body.adviceDos || "",
        adviceDonts: req.body.adviceDonts || "",

        pdfUrl: pdfUpload.secure_url, // ✅ Cloudinary URL
        photoUrl, // ✅ Cloudinary URL or null
      });

      res.status(201).json(placement);
    } catch (err) {
      console.error("PLACEMENT UPLOAD ERROR:", err);
      res.status(500).json({ message: "Failed to save placement" });
    }
  }
);

/* =====================================================
   GET – Fetch All Placements
   ===================================================== */
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch placements" });
  }
});

export default router;
