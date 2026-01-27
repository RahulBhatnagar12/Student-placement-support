import express from "express";
import Placement from "../models/Placement.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/**
 * POST – submit placement + PDF
 */
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF not uploaded" });
    }

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

      pdfUrl: `/uploads/pdfs/${req.file.filename}`,
    });

    res.status(201).json(placement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save placement" });
  }
});

/**
 * GET – fetch all placements
 */
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch placements" });
  }
});

export default router;
