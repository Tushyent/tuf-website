import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format, addDays } from "date-fns";

const currentNPTELCourses = [
  {
    id: "ml-2024",
    title: "Machine Learning",
    instructor: "Prof. Balaraman Ravindran, IIT Madras",
    duration: "12 weeks",
    startDate: addDays(new Date(), 7),
    deadline: addDays(new Date(), 14),
    description: "Comprehensive introduction to machine learning algorithms and applications",
    level: "Intermediate",
    credits: 3,
    url: "https://nptel.ac.in/courses/106/106/106106139/"
  },
  {
    id: "dbms-2024",
    title: "Database Management System",
    instructor: "Prof. D.B. Phatak, IIT Bombay",
    duration: "8 weeks",
    startDate: addDays(new Date(), 21),
    deadline: addDays(new Date(), 28),
    description: "Fundamentals of database design, SQL, and database administration",
    level: "Beginner",
    credits: 2,
    url: "https://nptel.ac.in/courses/106/106/106106093/"
  },
  {
    id: "dsa-2024",
    title: "Data Structures and Algorithms",
    instructor: "Prof. Naveen Garg, IIT Delhi",
    duration: "10 weeks",
    startDate: addDays(new Date(), 14),
    deadline: addDays(new Date(), 21),
    description: "Essential data structures and algorithmic techniques for problem solving",
    level: "Intermediate",
    credits: 3,
    url: "https://nptel.ac.in/courses/106/106/106106133/"
  }
];

const otherPlatforms = [
  {
    name: "Coursera",
    description: "University courses with certificates from top institutions",
    icon: "fas fa-graduation-cap",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    url: "https://www.coursera.org/",
    features: ["University partnerships", "Verified certificates", "Financial aid available", "Specializations"]
  },
  {
    name: "edX",
    description: "High-quality courses from Harvard, MIT, and other top universities",
    icon: "fas fa-university",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    url: "https://www.edx.org/",
    features: ["MicroMasters programs", "Professional certificates", "Free audit option", "Industry partnerships"]
  },
  {
    name: "Swayam",
    description: "Government of India's education platform with free courses",
    icon: "fas fa-flag-usa",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    url: "https://swayam.gov.in/",
    features: ["Free courses", "Government recognition", "Credit transfer", "Multiple languages"]
  },
  {
    name: "Udemy",
    description: "Practical skills-based courses for professional development",
    icon: "fas fa-tools",
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    url: "https://www.udemy.com/",
    features: ["Lifetime access", "Practical projects", "Regular discounts", "Mobile app learning"]
  }
];

export default function NPTELCourses() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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
    queryKey: ["/api/opportunities", { type: "NPTEL" }],
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

  const generateCalendarUrl = (course: any) => {
    const startDate = new Date(course.deadline);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `NPTEL Course Deadline: ${course.title}`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: `Registration deadline for ${course.title} by ${course.instructor}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default: return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    }
  };

  const isDeadlineSoon = (deadline: Date) => {
    const daysUntilDeadline = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">NPTEL / Online Courses</h2>
        <p className="text-muted-foreground">Current and upcoming courses with enrollment deadlines and credit information</p>
      </div>

      {/* Current NPTEL Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-video text-primary"></i>
            <span>Current NPTEL Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentNPTELCourses.map((course) => (
              <Card key={course.id} className={`hover:shadow-md transition-shadow ${isDeadlineSoon(course.deadline) ? 'border-orange-200 dark:border-orange-800' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                        </div>
                        {isDeadlineSoon(course.deadline) && (
                          <Badge variant="destructive" className="ml-4">
                            <i className="fas fa-clock mr-1"></i>
                            Deadline Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                          <div className="font-medium">{course.duration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Credits</div>
                          <div className="font-medium">{course.credits}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Start Date</div>
                          <div className="font-medium">{format(course.startDate, 'MMM d, yyyy')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Deadline</div>
                          <div className="font-medium text-orange-600">{format(course.deadline, 'MMM d, yyyy')}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        <Badge variant="outline">
                          <i className="fas fa-graduation-cap mr-1"></i>
                          {course.credits} Credits
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:min-w-[200px]">
                      <Button 
                        onClick={() => window.open(course.url, '_blank')}
                        data-testid={`button-enroll-${course.id}`}
                      >
                        <i className="fas fa-user-plus mr-2"></i>
                        Enroll Now
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => window.open(generateCalendarUrl(course), '_blank')}
                        data-testid={`button-add-deadline-${course.id}`}
                      >
                        <i className="fas fa-calendar-plus mr-2"></i>
                        Add Deadline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Opportunities */}
      {opportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opportunity: any) => (
                <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{opportunity.title}</h3>
                        {opportunity.description && (
                          <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                        )}
                        {opportunity.deadline && (
                          <div className="text-sm text-muted-foreground">
                            <i className="fas fa-calendar mr-1"></i>
                            Deadline: {format(new Date(opportunity.deadline), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-4 lg:mt-0">
                        {opportunity.link && (
                          <Button 
                            onClick={() => window.open(opportunity.link, '_blank')}
                            data-testid={`button-view-${opportunity.id}`}
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-globe text-primary"></i>
            <span>Other Learning Platforms</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherPlatforms.map((platform) => (
              <Card key={platform.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platform.color}`}>
                      <i className={platform.icon}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {platform.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <i className="fas fa-check text-emerald-600 text-xs"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(platform.url, '_blank')}
                    data-testid={`button-visit-${platform.name.toLowerCase()}`}
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Visit {platform.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Transfer Information */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
            <i className="fas fa-info-circle"></i>
            <span>Credit Transfer Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• NPTEL courses can be used for credit transfer - check with your department</p>
            <p>• Minimum 60% score required for most credit transfer programs</p>
            <p>• Complete assignments and proctored exams for certificate eligibility</p>
            <p>• Some courses may have additional prerequisites or co-requisites</p>
            <p>• Consult your academic advisor before enrolling for credit transfer</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
