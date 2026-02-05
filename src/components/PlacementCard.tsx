import {
  FileText,
  Download,
  User,
  Building2,
  GraduationCap,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlacementCardProps {
  id: string;
  studentName: string;
  rollNumber: string;
  branch: string;
  programme: string;
  selectedCompany: string;
  selectedProfile: string;
  pdfUrl?: string | null;
  createdAt: string;
}

const PlacementCard = ({
  studentName,
  rollNumber,
  branch,
  programme,
  selectedCompany,
  selectedProfile,
  pdfUrl,
  createdAt,
}: PlacementCardProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  /* ✅ STRICT CHECK: ONLY CLOUDINARY / ABSOLUTE URL */
  const isValidPdf =
    typeof pdfUrl === "string" &&
    pdfUrl.startsWith("https://res.cloudinary.com");

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300">
      {/* HEADER */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{studentName}</h3>
              <p className="text-sm text-muted-foreground">{rollNumber}</p>
            </div>
          </div>

          <Badge variant="secondary">
            <Calendar className="w-3 h-3 mr-1" />
            {formattedDate}
          </Badge>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            {programme} – {branch}
          </span>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-semibold">{selectedCompany}</span>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            {selectedProfile}
          </p>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="pt-3 border-t">
        {isValidPdf ? (
          <Button asChild className="w-full gap-2">
            {/* 🔥 KEY FIX: NO download ATTRIBUTE */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="w-4 h-4" />
              View Experience PDF
              <Download className="w-4 h-4 ml-auto" />
            </a>
          </Button>
        ) : (
          <Button disabled className="w-full gap-2 opacity-60">
            <FileText className="w-4 h-4" />
            PDF Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlacementCard;
