import express from "express";
import Placement from "../models/Placement.js";
import upload from "../utils/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * POST – submit placement + PDF + PHOTO
 */
router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      /* ---------------- PDF CHECK ---------------- */
      const pdfFile = req.files?.pdf?.[0];

      if (!pdfFile || !pdfFile.buffer) {
        return res.status(400).json({ message: "PDF not uploaded" });
      }

      /* ---------------- UPLOAD PDF ---------------- */
      const pdfUpload = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${pdfFile.buffer.toString("base64")}`,
        {
          resource_type: "raw",
          folder: "placement_pdfs",
          use_filename: true,        // 🔥 important
          unique_filename: false,    // 🔥 important
        }
      );

      /* ---------------- UPLOAD PHOTO (OPTIONAL) ---------------- */
      let photoUrl = null;

      const photoFile = req.files?.photo?.[0];
      if (photoFile && photoFile.buffer) {
        const mime = photoFile.mimetype || "image/jpeg";

        const photoUpload = await cloudinary.uploader.upload(
          `data:${mime};base64,${photoFile.buffer.toString("base64")}`,
          {
            folder: "placement_photos",
            use_filename: true,
            unique_filename: false,
          }
        );

        photoUrl = photoUpload.secure_url;
      }

      /* ---------------- SAVE TO DB ---------------- */
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

        pdfUrl: pdfUpload.secure_url, // 🔥 Cloudinary RAW pdf
        photoUrl,                    // 🔥 Cloudinary image
      });

      return res.status(201).json(placement);
    } catch (err) {
      console.error("PLACEMENT UPLOAD ERROR:", err);
      return res.status(500).json({ message: "Failed to save placement" });
    }
  }
);

/**
 * GET – fetch all placements
 */
router.get("/", async (req, res) => {
  const placements = await Placement.find().sort({ createdAt: -1 });
  res.json(placements);
});

export default router;
