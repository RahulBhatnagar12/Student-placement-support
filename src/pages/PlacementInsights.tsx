import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, FileX } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import PlacementCard from "@/components/PlacementCard";
import { Input } from "@/components/ui/input";

interface PlacementSubmission {
  id: string;
  student_name: string;
  roll_number: string;
  branch: string;
  programme: string;
  selected_company: string;
  selected_profile: string;
  pdf_url: string | null;
  created_at: string;
}

const PlacementInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["placementSubmissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("placement_submissions")
        .select("id, student_name, roll_number, branch, programme, selected_company, selected_profile, pdf_url, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PlacementSubmission[];
    },
  });

  const filteredSubmissions = submissions?.filter((submission) => {
    const query = searchQuery.toLowerCase();
    return (
      submission.student_name.toLowerCase().includes(query) ||
      submission.roll_number.toLowerCase().includes(query) ||
      submission.branch.toLowerCase().includes(query) ||
      submission.selected_company.toLowerCase().includes(query) ||
      submission.selected_profile.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Placement Insights
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Browse through interview experiences shared by your seniors. Learn
              from their journey and prepare better for your placements.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, company, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-body"
            />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="font-body text-muted-foreground">
                Loading experiences...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-body text-destructive">
                Error loading data. Please try again later.
              </p>
            </div>
          ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => (
                <PlacementCard
                  key={submission.id}
                  id={submission.id}
                  studentName={submission.student_name}
                  rollNumber={submission.roll_number}
                  branch={submission.branch}
                  programme={submission.programme}
                  selectedCompany={submission.selected_company}
                  selectedProfile={submission.selected_profile}
                  pdfUrl={submission.pdf_url}
                  createdAt={submission.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <FileX className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No Experiences Found
              </h3>
              <p className="font-body text-muted-foreground max-w-md">
                {searchQuery
                  ? "No results match your search. Try different keywords."
                  : "Be the first to share your placement experience and help future batches!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlacementInsights;
