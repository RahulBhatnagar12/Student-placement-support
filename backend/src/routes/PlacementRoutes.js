import express from "express";
import Placement from "../models/Placement.js";
import upload from "../utils/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * POST – submit placement + PDF + PHOTO (CLOUDINARY)
 */
router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files?.pdf) {
        return res.status(400).json({ message: "PDF not uploaded" });
      }

      /* 🔥 Upload PDF to Cloudinary */
      const pdfUpload = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${req.files.pdf[0].buffer.toString("base64")}`,
        {
          resource_type: "raw",
          folder: "placement_pdfs",
        }
      );

      /* 🔥 Upload Photo (optional) */
      let photoUrl = null;
      if (req.files.photo) {
        const photoUpload = await cloudinary.uploader.upload(
          `data:${req.files.photo[0].mimetype};base64,${req.files.photo[0].buffer.toString("base64")}`,
          {
            folder: "placement_photos",
          }
        );
        photoUrl = photoUpload.secure_url;
      }

      /* 🔥 Save in MongoDB */
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

        pdfUrl: pdfUpload.secure_url, // ✅ CLOUDINARY URL
        photoUrl,
      });

      res.status(201).json(placement);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save placement" });
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
