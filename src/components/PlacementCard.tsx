import { FileText, Download, User, Building2, GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                {studentName}
              </h3>
              <p className="text-sm text-muted-foreground font-body">{rollNumber}</p>
            </div>
          </div>
          <Badge variant="secondary" className="font-body">
            <Calendar className="w-3 h-3 mr-1" />
            {formattedDate}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-body">
          <GraduationCap className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">{programme} - {branch}</span>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-accent" />
            <span className="font-display font-semibold text-foreground">
              {selectedCompany}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body pl-7">
            {selectedProfile}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50">
        {pdfUrl ? (
          <Button
            asChild
            className="w-full bg-primary hover:bg-navy-light text-primary-foreground font-body gap-2"
          >
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
          <Button disabled className="w-full font-body gap-2">
            <FileText className="w-4 h-4" />
            PDF Not Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlacementCard;
