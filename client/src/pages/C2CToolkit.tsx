import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";

const toolkitSections = [
  {
    id: "internships",
    title: "Internship Updates",
    icon: "fas fa-briefcase",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
  },
  {
    id: "vacancies",
    title: "Job Vacancies",
    icon: "fas fa-building",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
  },
  {
    id: "recommendations",
    title: "Recommendations",
    icon: "fas fa-star",
    color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
  },
  {
    id: "events",
    title: "C2C Events",
    icon: "fas fa-calendar",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
  }
];

const recommendations = [
  {
    category: "Resume Building",
    items: [
      {
        title: "Professional Resume Templates",
        description: "ATS-friendly templates for tech roles",
        link: "https://www.overleaf.com/gallery/tagged/cv",
        type: "Template"
      },
      {
        title: "Resume Review Checklist",
        description: "Key points to review before applying",
        link: "#",
        type: "Guide"
      }
    ]
  },
  {
    category: "Interview Preparation", 
    items: [
      {
        title: "Mock Interview Sessions",
        description: "Practice with seniors and mentors",
        link: "#",
        type: "Practice"
      },
      {
        title: "Technical Interview Guide",
        description: "Common questions and solutions",
        link: "#",
        type: "Guide"
      }
    ]
  },
  {
    category: "Project Ideas",
    items: [
      {
        title: "Portfolio Project Ideas",
        description: "Projects that impress recruiters",
        link: "#",
        type: "Ideas"
      },
      {
        title: "Open Source Contributions",
        description: "How to contribute to meaningful projects",
        link: "https://github.com/topics/good-first-issue",
        type: "Resource"
      }
    ]
  }
];

export default function C2CToolkit() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("internships");

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

  const { data: opportunities = [], isLoading: opportunitiesLoading, error } = useQuery({
    queryKey: ["/api/opportunities"],
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
        <Skeleton className="h-12 w-full" />
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Job": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Event": return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "Template": return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "Guide": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Practice": return "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200";
      default: return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const filterOpportunitiesByType = (type: string) => {
    return opportunities.filter((opp: any) => opp.type.toLowerCase() === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Campus to Career (C2C) Toolkit</h2>
        <p className="text-muted-foreground">Your complete resource for transitioning from campus to career</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolkitSections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab(section.id)}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                  <i className={section.icon}></i>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.id === "internships" ? filterOpportunitiesByType("internship").length :
                     section.id === "vacancies" ? filterOpportunitiesByType("job").length :
                     section.id === "events" ? filterOpportunitiesByType("event").length : 
                     "Multiple"} items
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {toolkitSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} data-testid={`tab-${section.id}`}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Internships Tab */}
        <TabsContent value="internships">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-briefcase text-blue-600"></i>
                <span>Current Internship Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : filterOpportunitiesByType("internship").length > 0 ? (
                <div className="space-y-4">
                  {filterOpportunitiesByType("internship").map((internship: any) => (
                    <Card key={internship.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{internship.title}</h3>
                            {internship.description && (
                              <p className="text-sm text-muted-foreground mt-1">{internship.description}</p>
                            )}
                          </div>
                          <Badge className={getTypeColor("Internship")}>
                            Internship
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          {internship.deadline && (
                            <>
                              <span className="flex items-center space-x-1">
                                <i className="fas fa-calendar"></i>
                                <span>Deadline: {format(new Date(internship.deadline), 'MMM d, yyyy')}</span>
                              </span>
                            </>
                          )}
                          {internship.tags && internship.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {internship.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {internship.link && (
                            <Button 
                              size="sm"
                              onClick={() => window.open(internship.link, '_blank')}
                              data-testid={`button-apply-${internship.id}`}
                            >
                              <i className="fas fa-external-link-alt mr-2"></i>
                              Apply Now
                            </Button>
                          )}
                          {internship.contact && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `mailto:${internship.contact}?subject=Inquiry about ${internship.title}`}
                              data-testid={`button-contact-${internship.id}`}
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
                <div className="text-center py-12">
                  <i className="fas fa-briefcase text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Internships Available</h3>
                  <p className="text-muted-foreground">Check back later for new opportunities.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vacancies Tab */}
        <TabsContent value="vacancies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-building text-green-600"></i>
                <span>Job Vacancies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : filterOpportunitiesByType("job").length > 0 ? (
                <div className="space-y-4">
                  {filterOpportunitiesByType("job").map((job: any) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            {job.description && (
                              <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                            )}
                          </div>
                          <Badge className={getTypeColor("Job")}>
                            Full Time
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          {job.deadline && (
                            <>
                              <span className="flex items-center space-x-1">
                                <i className="fas fa-calendar"></i>
                                <span>Deadline: {format(new Date(job.deadline), 'MMM d, yyyy')}</span>
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {job.link && (
                            <Button 
                              size="sm"
                              onClick={() => window.open(job.link, '_blank')}
                              data-testid={`button-apply-job-${job.id}`}
                            >
                              <i className="fas fa-external-link-alt mr-2"></i>
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-building text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Job Vacancies</h3>
                  <p className="text-muted-foreground">New opportunities will be posted here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <div className="space-y-6">
            {recommendations.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-star text-yellow-600"></i>
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <Card key={item.title} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{item.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            </div>
                            <Badge className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => item.link !== "#" && window.open(item.link, '_blank')}
                            data-testid={`button-resource-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Access Resource
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-calendar text-purple-600"></i>
                <span>C2C Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Resume Review Session",
                    description: "Get your resume reviewed by industry professionals",
                    date: "January 30, 2025",
                    time: "2:00 PM - 4:00 PM",
                    location: "Career Development Center"
                  },
                  {
                    title: "Mock Interview Drive",
                    description: "Practice interviews with experienced professionals",
                    date: "February 5, 2025", 
                    time: "10:00 AM - 5:00 PM",
                    location: "Conference Hall"
                  },
                  {
                    title: "Industry Connect Session",
                    description: "Network with alumni working in top companies",
                    date: "February 12, 2025",
                    time: "6:00 PM - 8:00 PM",
                    location: "Virtual Event"
                  }
                ].map((event, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <Badge className={getTypeColor("Event")}>
                          Event
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-calendar"></i>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-clock"></i>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" data-testid={`button-register-event-${index}`}>
                          <i className="fas fa-user-plus mr-2"></i>
                          Register
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-calendar-event-${index}`}>
                          <i className="fas fa-calendar-plus mr-2"></i>
                          Add to Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-rocket text-primary"></i>
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col space-y-1" data-testid="button-upload-resume">
              <i className="fas fa-upload text-lg"></i>
              <span className="text-sm">Upload Resume</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-schedule-mock">
              <i className="fas fa-microphone text-lg"></i>
              <span className="text-sm">Schedule Mock Interview</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-track-applications">
              <i className="fas fa-list text-lg"></i>
              <span className="text-sm">Track Applications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
