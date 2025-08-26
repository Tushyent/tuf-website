import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const departments = [
  { value: "all", label: "All Departments" },
  { value: "Computer Science Engineering", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Electronics & Communication", label: "Electronics & Communication" },
  { value: "Electrical & Electronics", label: "Electrical & Electronics" },
  { value: "Mechanical Engineering", label: "Mechanical" },
  { value: "Civil Engineering", label: "Civil" },
  { value: "Chemical Engineering", label: "Chemical" },
  { value: "Biomedical Engineering", label: "Biomedical" },
];

const specializationAreas = [
  { value: "all", label: "All Specializations" },
  { value: "Embedded IoT", label: "Embedded IoT" },
  { value: "NLP", label: "Natural Language Processing" },
  { value: "Computer Vision", label: "Computer Vision" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Power Systems", label: "Power Systems" },
  { value: "Signal Processing", label: "Signal Processing" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Robotics", label: "Robotics" },
  { value: "Cybersecurity", label: "Cybersecurity" },
];

export default function Projects() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");

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

  const { data: projects = [], isLoading: projectsLoading, error } = useQuery({
    queryKey: ["/api/projects-ifp", { 
      dept: selectedDept === "all" ? undefined : selectedDept,
      area: selectedArea === "all" ? undefined : selectedArea,
    }],
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
        <Skeleton className="h-24 w-full" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const generateContactUrl = (project: any) => {
    if (project.contact.includes('@')) {
      // Email contact
      const subject = `Inquiry about IFP Project: ${project.title}`;
      const body = `Dear ${project.guideName},\n\nI am interested in learning more about the IFP project "${project.title}" in the ${project.area} domain.\n\nCould we schedule a discussion about this project?\n\nBest regards,\n[Your Name]`;
      return `mailto:${project.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      // WhatsApp contact
      const message = `Hi ${project.guideName}, I'm interested in your IFP project "${project.title}" in ${project.area}. Could we discuss this project?`;
      return `https://wa.me/${project.contact}?text=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Projects (IFP)</h2>
        <p className="text-muted-foreground">Discover Internally Funded Projects with areas of specialization and connect with mentors</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department</label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger data-testid="select-department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Specialization Area</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger data-testid="select-area">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specializationAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {projectsLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center space-x-1">
                            <i className="fas fa-university"></i>
                            <span>{project.dept}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="fas fa-calendar"></i>
                            <span>{project.year}</span>
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        {project.area}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {project.brief}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Project Guide</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <i className="fas fa-user-tie"></i>
                          <span>{project.guideName}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <i className={`fas ${project.contact.includes('@') ? 'fa-envelope' : 'fa-phone'}`}></i>
                          <span>{project.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:min-w-[200px]">
                    <Button 
                      onClick={() => window.location.href = generateContactUrl(project)}
                      data-testid={`button-contact-${project.id}`}
                    >
                      <i className={`${project.contact.includes('@') ? 'fas fa-envelope' : 'fab fa-whatsapp'} mr-2`}></i>
                      Talk to Mentor
                    </Button>

                    {project.link && (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(project.link, '_blank')}
                        data-testid={`button-project-link-${project.id}`}
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Project Link
                      </Button>
                    )}

                    <Button 
                      variant="outline"
                      data-testid={`button-proposal-template-${project.id}`}
                    >
                      <i className="fas fa-download mr-2"></i>
                      Proposal Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-project-diagram text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">No Projects Found</h3>
            <p className="text-muted-foreground text-center">
              {selectedDept !== "all" || selectedArea !== "all"
                ? "Try adjusting your filters to find relevant projects."
                : "No IFP projects have been registered yet."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
            <i className="fas fa-info-circle"></i>
            <span>About IFP Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• Internally Funded Projects (IFP) are research projects funded by the institution</p>
            <p>• These projects provide hands-on experience in cutting-edge technologies</p>
            <p>• Students can collaborate with faculty mentors on real-world problems</p>
            <p>• Participation can lead to publications, patents, and industry connections</p>
            <p>• Contact the project guide directly to express your interest and discuss opportunities</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}