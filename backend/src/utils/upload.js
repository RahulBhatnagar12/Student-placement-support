import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // photo ke liye alag folder
    if (file.fieldname === "photo") {
      cb(null, "uploads/photos");
    } 
    // pdf ke liye existing folder
    else if (file.fieldname === "pdf") {
      cb(null, "uploads/pdfs");
    } 
    else {
      cb(new Error("Invalid field name"), false);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// file filter (PDF + Image)
const fileFilter = (req, file, cb) => {
  // PDF validation
  if (file.fieldname === "pdf") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  }

  // Image validation
  else if (file.fieldname === "photo") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  }

  else {
    cb(new Error("Invalid upload field"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
