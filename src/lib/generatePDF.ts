import jsPDF from "jspdf";

interface CompanyShortlisted {
  companyName: string;
  profile: string;
}

interface FormData {
  studentName: string;
  rollNumber: string;
  branch: string;
  programme: string;
  personalNote?: string;
  companiesShortlisted: CompanyShortlisted[];
  selectedCompany: string;
  selectedProfile: string;
  selectionProcess: string;
  technicalQuestions?: string;
  hrQuestions?: string;
  preparationResources?: string;
  adviceDos?: string;
  adviceDonts?: string;
}

export const generatePlacementPDF = (formData: FormData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 4;
  };

  const addSectionHeader = (title: string) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    yPos += 8;
    doc.setFillColor(26, 43, 71); // Navy color
    doc.rect(margin, yPos - 5, contentWidth, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 4, yPos + 2);
    doc.setTextColor(0, 0, 0);
    yPos += 14;
  };

  const addField = (label: string, value: string) => {
    if (!value) return;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}: `, margin, yPos);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const valueLines = doc.splitTextToSize(value, contentWidth - labelWidth);
    doc.text(valueLines[0] || "", margin + labelWidth, yPos);
    yPos += 6;
    for (let i = 1; i < valueLines.length; i++) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(valueLines[i], margin, yPos);
      yPos += 6;
    }
  };

  // Header with HBTU branding
  doc.setFillColor(26, 43, 71);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("HBTU PLACEMENT INSIGHTS", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Interview Experience Report", pageWidth / 2, 24, { align: "center" });

  // Gold accent line
  doc.setFillColor(218, 165, 32); // Gold color
  doc.rect(0, 35, pageWidth, 3, "F");

  yPos = 50;
  doc.setTextColor(0, 0, 0);

  // Personal Information Section
  addSectionHeader("PERSONAL INFORMATION");
  addField("Name", formData.studentName);
  addField("Roll Number", formData.rollNumber);
  addField("Branch", formData.branch);
  addField("Programme", formData.programme);
  if (formData.personalNote) {
    yPos += 4;
    addField("Personal Note", formData.personalNote);
  }

  // Companies Shortlisted Section
  if (formData.companiesShortlisted && formData.companiesShortlisted.length > 0) {
    addSectionHeader("COMPANIES & PROFILES SHORTLISTED");
    formData.companiesShortlisted.forEach((company, index) => {
      if (company.companyName) {
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${company.companyName}`, margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        doc.text(`   Profile: ${company.profile || "N/A"}`, margin, yPos);
        yPos += 8;
      }
    });
  }

  // Selected Placement Details
  addSectionHeader("SELECTED PLACEMENT DETAILS");
  addField("Company", formData.selectedCompany);
  addField("Profile", formData.selectedProfile);
  yPos += 4;
  addWrappedText("Selection Process & Insights:", 11, true);
  addWrappedText(formData.selectionProcess);

  // Interview Questions
  addSectionHeader("INTERVIEW / TEST QUESTIONS");
  if (formData.technicalQuestions) {
    addWrappedText("Round 1 - Technical:", 11, true);
    addWrappedText(formData.technicalQuestions);
  }
  if (formData.hrQuestions) {
    addWrappedText("Round 2 - HR / Analytical:", 11, true);
    addWrappedText(formData.hrQuestions);
  }

  // Preparation Strategy
  if (formData.preparationResources) {
    addSectionHeader("PREPARATION STRATEGY");
    addWrappedText("Resources Used:", 11, true);
    addWrappedText(formData.preparationResources);
  }

  // Advice for Juniors
  if (formData.adviceDos || formData.adviceDonts) {
    addSectionHeader("ADVICE FOR JUNIORS");
    if (formData.adviceDos) {
      addWrappedText("Do's:", 11, true);
      addWrappedText(formData.adviceDos);
    }
    if (formData.adviceDonts) {
      yPos += 4;
      addWrappedText("Don'ts:", 11, true);
      addWrappedText(formData.adviceDonts);
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `HBTU Placement Insights | Generated on ${new Date().toLocaleDateString("en-IN")} | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return doc.output("blob");
};
