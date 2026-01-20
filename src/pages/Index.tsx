import { Link } from "react-router-dom";
import { ArrowRight, FileText, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-body text-muted-foreground">
              Official Placement Portal
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            HBTU{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">
              Placement Insights
            </span>
          </h1>

          {/* Description */}
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            A student-driven platform to share real placement and interview
            experiences for the benefit of future batches at Harcourt Butler
            Technical University.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-navy-light text-primary-foreground font-body gap-2 px-8 py-6 text-lg"
            >
              <Link to="/placement-insights">
                <BarChart3 className="w-5 h-5" />
                View Insights
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body gap-2 px-8 py-6 text-lg"
            >
              <Link to="/interview-experience">
                <FileText className="w-5 h-5" />
                Share Your Experience
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Use This Portal?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 gradient-hero rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Authentic Experiences
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Read real interview experiences shared by your seniors who have
                successfully placed in top companies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 gradient-hero rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Detailed Insights
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Access comprehensive details about selection processes,
                interview questions, and preparation strategies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-14 h-14 gradient-hero rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Community Driven
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Contribute to the community by sharing your own placement
                journey to help future batches succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Harcourt Butler Technical University,
            Kanpur. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
