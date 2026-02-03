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

    const pdfBlob = await generatePlacementPDF({
      studentName: data.studentName,
      rollNumber: data.rollNumber,
      branch: data.branch,
      programme: data.programme,
      
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

    if (!pdfBlob) {
      throw new Error("PDF generation failed");
    }

    const pdfFile = new File(
      [pdfBlob],
      `${data.rollNumber}_${data.studentName}.pdf`,
      { type: "application/pdf" }
    );

    const fd = new FormData();
    fd.append("pdf", pdfFile);
    if (photoFile) {
      fd.append("photo", photoFile);
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

    console.log(res);

    if (!res.ok) {
      const errText = await res.text();
      console.error(errText);
      throw new Error("Upload failed");
    }

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
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Share Your Interview Experience
            </h1>
            <p className="font-body text-muted-foreground">
              Help your juniors by sharing your placement journey. Your
              experience can make a difference!
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
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
                          <FormLabel className="font-body">Roll Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2021CSE001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Branch *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="programme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Programme *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select programme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programmes.map((prog) => (
                                <SelectItem key={prog} value={prog}>
                                  {prog}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
             
          <Card>
  <CardHeader>
    <CardTitle className="font-display text-xl">
      Upload Photograph (Optional)
    </CardTitle>
  </CardHeader>

  <CardContent>
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setPhotoFile(file); // ✅ REAL FILE
        }
      }}
    />
  </CardContent>
</Card>


                  <FormField
                    control={form.control}
                    name="personalNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Personal Note (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any personal message or introduction..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Companies Shortlisted */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Companies & Profiles Shortlisted
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`companiesShortlisted.${index}.companyName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-body">Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Google" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`companiesShortlisted.${index}.profile`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-body">Role / Profile</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., SDE" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ companyName: "", profile: "" })}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </CardContent>
              </Card>

              {/* Selected Placement Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Selected Placement Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="selectedCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Company you joined" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="selectedProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Placement Profile *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your role" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="selectionProcess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Selection Process & Insights *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the complete selection process, rounds, criteria, etc."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Interview Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Interview / Test Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="technicalQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Round 1 - Technical
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List technical questions asked..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hrQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Round 2 - HR / Analytical
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List HR or analytical questions asked..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Preparation Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Preparation Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="preparationResources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Resources Used (courses, platforms, certifications)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List resources, courses, websites you used for preparation..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Advice for Juniors */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Advice for Juniors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="adviceDos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Do's</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What should juniors definitely do..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adviceDonts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Don'ts</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What should juniors avoid..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Consent Section */}
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    Consent for Publication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="consentGiven"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-body">
                            I give my consent for publication of my placement
                            details on the HBTU Placement Insights website. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <FormField
                      control={form.control}
                      name="consentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Confirm your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consentRollNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-body">Roll Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Confirm your roll number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-navy-light text-primary-foreground font-body gap-2 py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
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
