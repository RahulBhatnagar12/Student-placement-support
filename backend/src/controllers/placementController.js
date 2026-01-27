import Placement from "../models/Placement.js";

export const getPlacements = async (req, res) => {
  const placements = await Placement.find();
  res.json(placements);
};

export const createPlacement = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF is required" });
    }

    const placement = await Placement.create({
      studentName: req.body.studentName,
      rollNumber: req.body.rollNumber,
      branch: req.body.branch,
      programme: req.body.programme,

      personalNote: req.body.personalNote,
      companiesShortlisted: JSON.parse(req.body.companiesShortlisted || "[]"),

      selectedCompany: req.body.selectedCompany,
      selectedProfile: req.body.selectedProfile,

      selectionProcess: req.body.selectionProcess,
      technicalQuestions: req.body.technicalQuestions,
      hrQuestions: req.body.hrQuestions,

      preparationResources: req.body.preparationResources,
      adviceDos: req.body.adviceDos,
      adviceDonts: req.body.adviceDonts,

      pdfUrl: `/uploads/pdfs/${req.file.filename}`,
    });

    res.status(201).json(placement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save placement" });
  }
};
