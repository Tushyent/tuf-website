import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const clubCategories = [
  { id: "all", label: "All Clubs" },
  { id: "IEEE", label: "IEEE" },
  { id: "ACM", label: "ACM" },
  { id: "Dept", label: "Departmental" },
  { id: "Cultural", label: "Cultural" },
];

export default function Clubs() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: clubs = [], isLoading: clubsLoading, error } = useQuery({
    queryKey: ["/api/clubs", { category: selectedCategory !== "all" ? selectedCategory : undefined }],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Sample data since we don't have seeded data
  const sampleClubs = clubs.length === 0 ? [
    {
      id: "1",
      name: "TechClub SSN",
      category: "Technical",
      description: "Fostering innovation and technical excellence through workshops, hackathons, and project development.",
      instagram: "https://instagram.com/techclub_ssn",
      email: "techclub@ssn.edu.in",
      meetingTime: "Every Friday, 4:00 PM",
    },
    {
      id: "2",
      name: "SSN IEEE Computer Society",
      category: "IEEE",
      description: "Advancing technology for humanity through computer science and engineering initiatives.",
      instagram: "https://instagram.com/ssn_ieee_cs",
      email: "ieee.cs@ssn.edu.in",
      meetingTime: "Bi-weekly Wednesdays, 3:30 PM",
    },
    {
      id: "3",
      name: "SSN ACM Student Chapter",
      category: "ACM",
      description: "Promoting computing education and research through programming contests and technical events.",
      instagram: "https://instagram.com/ssn_acm",
      email: "acm@ssn.edu.in",
      meetingTime: "Monthly meetings",
    },
    {
      id: "4",
      name: "BuildClub SSN",
      category: "Technical",
      description: "Building tomorrow's innovations today through hands-on projects and collaborative learning.",
      instagram: "https://instagram.com/buildclub_ssn",
      email: "buildclub@ssn.edu.in",
      meetingTime: "Saturdays, 10:00 AM",
    },
    {
      id: "5",
      name: "SSN Coding Club",
      category: "Technical",
      description: "Enhancing programming skills through competitive programming and code challenges.",
      instagram: "https://instagram.com/ssn_coding",
      email: "coding@ssn.edu.in",
      meetingTime: "Tuesday & Thursday, 5:00 PM",
    },
    {
      id: "6",
      name: "SSN Photo Club",
      category: "Cultural",
      description: "Capturing moments and telling stories through the lens of creativity and artistry.",
      instagram: "https://instagram.com/ssn_photoclub",
      email: "photography@ssn.edu.in",
      meetingTime: "Weekends, flexible timings",
    },
    {
      id: "7",
      name: "SSN Gradient Club",
      category: "Cultural",
      description: "Exploring the spectrum of arts, design, and creative expression across various mediums.",
      instagram: "https://instagram.com/ssn_gradient",
      email: "gradient@ssn.edu.in",
      meetingTime: "Friday evenings",
    },
    {
      id: "8",
      name: "SSN Lakshya",
      category: "Cultural",
      description: "Aiming for excellence in cultural activities, events, and artistic performances.",
      instagram: "https://instagram.com/ssn_lakshya",
      email: "lakshya@ssn.edu.in",
      meetingTime: "Mondays, 4:30 PM",
    },
  ] : clubs;

  const filteredClubs = selectedCategory === "all" 
    ? sampleClubs 
    : sampleClubs.filter((club: any) => club.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "IEEE": return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "ACM": return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "Technical": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Cultural": return "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200";
      default: return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Clubs in SSN</h2>
          <p className="text-muted-foreground">Discover and connect with student organizations and societies</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {clubCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`button-filter-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {clubsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club: any) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{club.name}</CardTitle>
                  <Badge className={getCategoryColor(club.category)}>
                    {club.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {club.description}
                </p>
                
                {club.meetingTime && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <i className="fas fa-clock"></i>
                    <span>{club.meetingTime}</span>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {club.instagram && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(club.instagram, '_blank')}
                      data-testid={`button-instagram-${club.id}`}
                    >
                      <i className="fab fa-instagram mr-2"></i>
                      Instagram
                    </Button>
                  )}
                  {club.email && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${club.email}`}
                      data-testid={`button-email-${club.id}`}
                    >
                      <i className="fas fa-envelope"></i>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-users text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">No Clubs Found</h3>
            <p className="text-muted-foreground text-center">
              {selectedCategory === "all" 
                ? "No clubs are currently registered in the system."
                : `No clubs found in the ${selectedCategory} category.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
