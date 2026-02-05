import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout";
import { generatePlacementPDF } from "@/lib/generatePDF";
import type { CompanyShortlisted } from "@/lib/generatePDF";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ================= SCHEMA ================= */

const companySchema = z.object({
  companyName: z.string().min(1),
  profile: z.string().min(1),
});

const formSchema = z.object({
  studentName: z.string().min(2),
  rollNumber: z.string().min(1),
  branch: z.string().min(1),
  programme: z.string().min(1),

  photoBase64: z.string().optional(), // ✅ REQUIRED FOR PDF IMAGE

  personalNote: z.string().optional(),
  companiesShortlisted: z.array(companySchema).optional(),

  selectedCompany: z.string().min(1),
  selectedProfile: z.string().min(1),
  selectionProcess: z.string().min(50),

  technicalQuestions: z.string().optional(),
  hrQuestions: z.string().optional(),
  preparationResources: z.string().optional(),
  adviceDos: z.string().optional(),
  adviceDonts: z.string().optional(),

  consentGiven: z.literal(true),
  consentName: z.string().min(2),
  consentRollNumber: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;

const branches = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Leather Technology",
  "Oil Technology",
  "Plastic Technology",
  "Food Technology",
  "Paint Technology",
];

const programmes = ["B.Tech", "M.Tech", "MBA", "MCA", "Ph.D"];

const InterviewExperience = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      rollNumber: "",
      branch: "",
      programme: "",
      photoBase64: undefined,
      personalNote: "",
      companiesShortlisted: [{ companyName: "", profile: "" }],
      selectedCompany: "",
      selectedProfile: "",
      selectionProcess: "",
      technicalQuestions: "",
      hrQuestions: "",
      preparationResources: "",
      adviceDos: "",
      adviceDonts: "",
      consentGiven: undefined,
      consentName: "",
      consentRollNumber: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "companiesShortlisted",
  });

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const validCompanies: CompanyShortlisted[] =
        data.companiesShortlisted?.filter(
          (c): c is CompanyShortlisted =>
            c.companyName.trim() !== "" && c.profile.trim() !== ""
        ) || [];

      /* 🔥 GENERATE PDF (WITH PHOTO) */
      const pdfBlob = await generatePlacementPDF({
        studentName: data.studentName,
        rollNumber: data.rollNumber,
        branch: data.branch,
        programme: data.programme,

        photoBase64: data.photoBase64, // ✅ THIS FIXES PHOTO ISSUE

        personalNote: data.personalNote,
        companiesShortlisted: validCompanies,
        selectedCompany: data.selectedCompany,
        selectedProfile: data.selectedProfile,
        selectionProcess: data.selectionProcess,
        technicalQuestions: data.technicalQuestions,
        hrQuestions: data.hrQuestions,
        preparationResources: data.preparationResources,
        adviceDos: data.adviceDos,
        adviceDonts: data.adviceDonts,
      });

      const pdfFile = new File(
        [pdfBlob],
        `${data.rollNumber}_${data.studentName}.pdf`,
        { type: "application/pdf" }
      );

      const fd = new FormData();
      fd.append("pdf", pdfFile);

      if (photoFile) {
        fd.append("photo", photoFile); // ✅ CLOUDINARY PHOTO
      }

      fd.append("studentName", data.studentName);
      fd.append("rollNumber", data.rollNumber);
      fd.append("branch", data.branch);
      fd.append("programme", data.programme);
      fd.append("selectedCompany", data.selectedCompany);
      fd.append("selectedProfile", data.selectedProfile);
      fd.append("selectionProcess", data.selectionProcess);
      fd.append("consentName", data.consentName);
      fd.append("consentRollNumber", data.consentRollNumber);

      if (data.personalNote) fd.append("personalNote", data.personalNote);
      if (data.technicalQuestions)
        fd.append("technicalQuestions", data.technicalQuestions);
      if (data.hrQuestions) fd.append("hrQuestions", data.hrQuestions);
      if (data.preparationResources)
        fd.append("preparationResources", data.preparationResources);
      if (data.adviceDos) fd.append("adviceDos", data.adviceDos);
      if (data.adviceDonts) fd.append("adviceDonts", data.adviceDonts);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/placements`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Experience submitted successfully!");
      navigate("/placement-insights");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* PERSONAL INFO */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* NAME + ROLL */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rollNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* PHOTO UPLOAD (FINAL FIX) */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Photograph (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setPhotoFile(file);

                          const reader = new FileReader();
                          reader.onload = () => {
                            form.setValue(
                              "photoBase64",
                              reader.result as string
                            );
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </CardContent>
                  </Card>

                </CardContent>
              </Card>

              {/* SUBMIT */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Experience
                  </>
                )}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewExperience;
