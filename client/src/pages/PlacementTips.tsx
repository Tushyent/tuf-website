import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const placementSections = [
  {
    title: "Interview Preparation",
    icon: "fas fa-user-tie",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    resources: [
      {
        name: "Data Structures & Algorithms",
        description: "Master DSA for technical interviews",
        links: [
          { name: "Take U Forward (TUF)", url: "https://takeuforward.org/", type: "Course" },
          { name: "LeetCode Practice", url: "https://leetcode.com/", type: "Practice" },
          { name: "GFG DSA Course", url: "https://www.geeksforgeeks.org/dsa-tutorial-learn-data-structures-and-algorithms/", type: "Tutorial" }
        ]
      },
      {
        name: "System Design",
        description: "Learn to design scalable systems",
        links: [
          { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Guide" },
          { name: "Grokking System Design", url: "https://www.educative.io/courses/grokking-the-system-design-interview", type: "Course" },
          { name: "High Scalability", url: "http://highscalability.com/", type: "Blog" }
        ]
      },
      {
        name: "HR Questions",
        description: "Common behavioral and HR interview questions",
        links: [
          { name: "Common HR Questions", url: "https://www.indeed.com/career-advice/interviewing/top-interview-questions-and-answers", type: "Guide" },
          { name: "STAR Method", url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-method", type: "Technique" },
          { name: "Mock Interview Practice", url: "https://pramp.com/", type: "Practice" }
        ]
      }
    ]
  },
  {
    title: "Resume Building",
    icon: "fas fa-file-alt",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    resources: [
      {
        name: "Resume Templates",
        description: "Professional resume templates for tech roles",
        links: [
          { name: "Overleaf LaTeX Templates", url: "https://www.overleaf.com/gallery/tagged/cv", type: "Template" },
          { name: "Google Docs Templates", url: "https://docs.google.com/document/u/0/?ftv=1&folder=0AKrJw_8oMR3mUk9PVA", type: "Template" },
          { name: "Canva Resume Builder", url: "https://www.canva.com/resumes/", type: "Tool" }
        ]
      },
      {
        name: "Resume Examples",
        description: "Sample resumes from successful candidates",
        links: [
          { name: "Tech Resume Examples", url: "https://www.resumeworded.com/resume-examples/software-engineer", type: "Example" },
          { name: "GitHub Resume Repos", url: "https://github.com/topics/resume", type: "Repository" },
          { name: "Reddit r/cscareerquestions", url: "https://www.reddit.com/r/cscareerquestions/", type: "Community" }
        ]
      }
    ]
  },
  {
    title: "Coding Platforms",
    icon: "fas fa-code",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    resources: [
      {
        name: "Competitive Programming",
        description: "Platforms for coding contests and practice",
        links: [
          { name: "Codeforces", url: "https://codeforces.com/", type: "Contest" },
          { name: "CodeChef", url: "https://www.codechef.com/", type: "Contest" },
          { name: "AtCoder", url: "https://atcoder.jp/", type: "Contest" }
        ]
      },
      {
        name: "Interview Practice",
        description: "Coding interview specific platforms",
        links: [
          { name: "LeetCode", url: "https://leetcode.com/", type: "Practice" },
          { name: "HackerRank", url: "https://www.hackerrank.com/", type: "Practice" },
          { name: "InterviewBit", url: "https://www.interviewbit.com/", type: "Practice" }
        ]
      }
    ]
  }
];

const seniorsAdvice = [
  {
    name: "Arjun Mehta",
    company: "Google",
    year: "CSE '24",
    advice: "Focus on fundamentals. Master one programming language completely before jumping to frameworks. Data structures and algorithms are non-negotiable."
  },
  {
    name: "Priya Sharma", 
    company: "Microsoft",
    year: "IT '23",
    advice: "Practice mock interviews extensively. Communication is as important as technical skills. Explain your thought process clearly during coding rounds."
  },
  {
    name: "Vikram Patel",
    company: "Amazon",
    year: "CSE '23",
    advice: "Build projects that showcase your skills. Having 2-3 solid projects with good documentation can set you apart from other candidates."
  },
  {
    name: "Ananya Reddy",
    company: "Adobe",
    year: "IT '24",
    advice: "Start preparation early. Don't wait for placement season. Consistent practice for 6 months is better than intensive cramming for 2 months."
  },
  {
    name: "Rohit Kumar",
    company: "Flipkart",
    year: "CSE '22",
    advice: "Network with alumni and seniors. Many opportunities come through referrals. Maintain your LinkedIn profile and participate in tech communities."
  }
];

export default function PlacementTips() {
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

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
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
      case "Course": return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Practice": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Tutorial": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Guide": return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "Template": return "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200";
      default: return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Placement Tips</h2>
        <p className="text-muted-foreground">Comprehensive resources for interview preparation, resume building, and placement success</p>
      </div>

      {/* Placement Timeline */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-calendar-check text-primary"></i>
            <span>Placement Preparation Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold">6M</span>
              </div>
              <h4 className="font-medium text-foreground">6 Months Before</h4>
              <p className="text-sm text-muted-foreground">Start DSA preparation, build projects</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold">3M</span>
              </div>
              <h4 className="font-medium text-foreground">3 Months Before</h4>
              <p className="text-sm text-muted-foreground">Resume building, mock interviews</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold">1M</span>
              </div>
              <h4 className="font-medium text-foreground">1 Month Before</h4>
              <p className="text-sm text-muted-foreground">Company research, aptitude tests</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold">1W</span>
              </div>
              <h4 className="font-medium text-foreground">1 Week Before</h4>
              <p className="text-sm text-muted-foreground">Final preparation, document ready</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Sections */}
      <div className="space-y-8">
        {placementSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${section.color}`}>
                  <i className={section.icon}></i>
                </div>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.resources.map((resource) => (
                  <div key={resource.name}>
                    <h4 className="font-semibold text-foreground mb-2">{resource.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {resource.links.map((link) => (
                        <Card key={link.name} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.open(link.url, '_blank')}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">{link.name}</h5>
                              <Badge className={getTypeColor(link.type)} variant="secondary">
                                {link.type}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              data-testid={`button-open-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <i className="fas fa-external-link-alt mr-2"></i>
                              Open
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seniors' Advice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-quote-left text-primary"></i>
            <span>Advice from Successful Seniors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seniorsAdvice.map((senior) => (
              <Card key={senior.name} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{senior.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {senior.company} • {senior.year}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{senior.advice}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-tasks text-primary"></i>
            <span>Placement Preparation Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Technical Preparation</h4>
              <div className="space-y-2">
                {[
                  "Complete 300+ DSA problems",
                  "Build 2-3 significant projects",
                  "Learn one technology stack deeply",
                  "Practice system design basics",
                  "Contribute to open source projects"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 border-2 border-primary rounded"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Professional Preparation</h4>
              <div className="space-y-2">
                {[
                  "Create a polished resume",
                  "Build a strong LinkedIn profile",
                  "Practice elevator pitch",
                  "Research target companies",
                  "Prepare behavioral interview answers"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 border-2 border-primary rounded"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
