import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: String,
    profile: String,
  },
  { _id: false }
);

const placementSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    branch: { type: String, required: true },
    programme: { type: String, required: true },

    personalNote: String,

    companiesShortlisted: [companySchema],

    selectedCompany: { type: String, required: true },
    selectedProfile: { type: String, required: true },

    selectionProcess: { type: String, required: true },
    technicalQuestions: String,
    hrQuestions: String,

    preparationResources: String,
    adviceDos: String,
    adviceDonts: String,
    pdfUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
