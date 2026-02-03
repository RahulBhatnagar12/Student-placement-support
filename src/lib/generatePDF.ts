import jsPDF from "jspdf";

/* -------------------- TYPES -------------------- */
const HBTU_LOGO_BASE64="data:image/jpeg;base64,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";
export interface CompanyShortlisted {
  companyName: string;
  profile: string;
}

export interface PlacementFormData {
  studentName: string;
  rollNumber: string;
  branch: string;
  programme: string;

  personalNote?: string;
  companiesShortlisted?: CompanyShortlisted[];

  selectedCompany: string;
  selectedProfile: string;
  selectionProcess: string;

  technicalQuestions?: string;
  hrQuestions?: string;
  preparationResources?: string;
  adviceDos?: string;
  adviceDonts?: string;

  photoBase64?: string; // ✅ optional
}

/* -------------------- MAIN FUNCTION -------------------- */

export const generatePlacementPDF = async (
  data: PlacementFormData
): Promise<Blob> => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = 40;

  /* -------------------- HELPERS -------------------- */

  const checkPageBreak = (extra = 20) => {
    if (y + extra > pageHeight - 60) {
      doc.addPage();
      y = 60;
    }
  };

  const addText = (
    text: string,
    size = 11,
    bold = false,
    indent = 0
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line) => {
      checkPageBreak(size * 1.6);
      doc.text(line, margin + indent, y);
      y += size * 1.6;
    });
  };

  const addSectionHeader = (title: string) => {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margin, y);
    y += 6;
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
  };

  const addBullet = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth - 20);
    lines.forEach((line, i) => {
      checkPageBreak(16);
      doc.text(i === 0 ? `• ${line}` : `  ${line}`, margin + 10, y);
      y += 16;
    });
  };

  /* -------------------- HEADER -------------------- */

 const logoSize = 42;

doc.addImage(
  HBTU_LOGO_BASE64,
  "JPEG",
  margin,
  y,
  logoSize,
  logoSize
);

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text(
  "Training and Placement Cell, HBTU Kanpur",
  margin + logoSize + 12,
  y + 16
);

doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.text(
  "Placement Insights",
  margin + logoSize + 12,
  y + 34
);

y += logoSize + 10;
doc.line(margin, y, pageWidth - margin, y);
y += 24;


  /* -------------------- PHOTO (OPTIONAL, SAFE) -------------------- */

  if (data.photoBase64) {
  const imgSize = 80;

  doc.addImage(
    data.photoBase64,
    "JPEG",
    pageWidth - margin - imgSize,
    50,
    imgSize,
    imgSize
  );

  doc.rect(
    pageWidth - margin - imgSize,
    50,
    imgSize,
    imgSize
  );
}
  y += 50;
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  /* -------------------- PERSONAL INFO -------------------- */

  addSectionHeader("Personal Information");
  addText(`Name: ${data.studentName}`);
  addText(`Roll Number: ${data.rollNumber}`);
  addText(`Branch: ${data.branch}`);
  addText(`Programme: ${data.programme}`);
 

  if (data.personalNote) {
    y += 8;
    addText(
      "Any other things you will like to tell us about yourself (Optional)",
      11,
      true
    );
    addText(data.personalNote, 11, false, 10);
  }

  /* -------------------- COMPANIES SHORTLISTED -------------------- */

  if (data.companiesShortlisted?.length) {
    y += 10;
    addSectionHeader("Companies & Profiles that you were shortlisted for");
    data.companiesShortlisted.forEach((c, i) =>
      addText(`${i + 1}) ${c.companyName} – ${c.profile}`)
    );
  }

  /* -------------------- PLACEMENT DETAILS -------------------- */

  y += 10;
  addSectionHeader("Short-Listed Placement Details");
  addText(`Company: ${data.selectedCompany}`);
  addText(`Placement Profile: ${data.selectedProfile}`);

  y += 8;
  addText("Selection Process and Insights", 11, true);
  data.selectionProcess
    .split(/\n+/)
    .filter(Boolean)
    .forEach(addBullet);

  /* -------------------- PREPARATION -------------------- */

  if (data.preparationResources) {
    y += 12;
    addSectionHeader("Preparation Strategy");
    data.preparationResources
      .split(/\n+/)
      .filter(Boolean)
      .forEach(addBullet);
  }

  /* -------------------- ADVICE -------------------- */

  if (data.adviceDos || data.adviceDonts) {
    y += 12;
    addSectionHeader("Advice for Juniors");

    if (data.adviceDos) {
      addText("Do:", 11, true);
      data.adviceDos.split(/\n+/).filter(Boolean).forEach(addBullet);
    }

    if (data.adviceDonts) {
      y += 6;
      addText("Don’t:", 11, true);
      data.adviceDonts.split(/\n+/).filter(Boolean).forEach(addBullet);
    }
  }

  /* -------------------- CONSENT -------------------- */

  y += 14;
  addText("Note:", 11, true);
  addText(
    "I, the undersigned, give my consent for publication of my placement experience.",
    10,
    false,
    10
  );

  y += 8;
  addText(`Name: ${data.studentName}`);
  addText(`Roll Number: ${data.rollNumber}`);

  /* -------------------- FOOTER -------------------- */

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      `Placement Insights | Page ${i} of ${pages}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" }
    );
  }

  return doc.output("blob");
};
