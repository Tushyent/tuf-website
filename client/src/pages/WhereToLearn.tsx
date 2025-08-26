import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const learningResources = [
  {
    category: "Programming & Web Development",
    description: "Learn programming fundamentals and web development technologies",
    icon: "fas fa-code",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    resources: [
      {
        name: "W3Schools",
        description: "Web development tutorials and references",
        url: "https://www.w3schools.com/",
        level: "Beginner",
        topics: ["HTML", "CSS", "JavaScript", "Python"]
      },
      {
        name: "FreeCodeCamp",
        description: "Interactive coding curriculum with projects",
        url: "https://www.freecodecamp.org/",
        level: "Beginner",
        topics: ["Web Development", "Data Science", "APIs"]
      },
      {
        name: "TechWithTim",
        description: "Programming tutorials and project walkthroughs", 
        url: "https://www.youtube.com/c/TechWithTim",
        level: "Intermediate",
        topics: ["Python", "Machine Learning", "Game Development"]
      },
      {
        name: "CodeWithMosh",
        description: "Clear and structured programming courses",
        url: "https://codewithmosh.com/",
        level: "Beginner",
        topics: ["JavaScript", "React", "Node.js", "Python"]
      }
    ]
  },
  {
    category: "Computer Science Core & GATE",
    description: "Master computer science fundamentals and GATE preparation",
    icon: "fas fa-graduation-cap",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    resources: [
      {
        name: "GATE Smashers",
        description: "Comprehensive GATE CS preparation videos",
        url: "https://www.youtube.com/c/GateSmashers",
        level: "Intermediate",
        topics: ["OS", "DBMS", "CN", "TOC", "COA"]
      },
      {
        name: "Jenny's Lectures",
        description: "Computer science concepts explained simply",
        url: "https://www.youtube.com/c/JennyslecturesCSIT",
        level: "Beginner",
        topics: ["DBMS", "OS", "Software Engineering"]
      },
      {
        name: "Physics Wallah",
        description: "Educational content for competitive exams",
        url: "https://www.youtube.com/c/PhysicsWallah",
        level: "Beginner",
        topics: ["Mathematics", "Physics", "Computer Science"]
      },
      {
        name: "Unacademy",
        description: "Live classes and structured courses",
        url: "https://unacademy.com/",
        level: "All Levels",
        topics: ["GATE", "Competitive Exams", "Interview Prep"]
      }
    ]
  },
  {
    category: "Data Structures & Algorithms",
    description: "Master DSA for competitive programming and interviews",
    icon: "fas fa-sitemap",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    resources: [
      {
        name: "Take U Forward (TUF)",
        description: "Structured DSA course by Striver",
        url: "https://takeuforward.org/",
        level: "All Levels",
        topics: ["DSA", "Competitive Programming", "Interview Prep"]
      },
      {
        name: "LeetCode",
        description: "Practice coding problems and contests",
        url: "https://leetcode.com/",
        level: "All Levels", 
        topics: ["Algorithms", "Data Structures", "System Design"]
      },
      {
        name: "CodeStudio",
        description: "Coding Ninjas practice platform",
        url: "https://www.codestudio.com/",
        level: "All Levels",
        topics: ["DSA", "Interview Questions", "Mock Tests"]
      },
      {
        name: "Abdul Bari",
        description: "In-depth algorithm analysis and explanation",
        url: "https://www.youtube.com/channel/UCZCFT11CWBi3MHNlGf019nw",
        level: "Intermediate",
        topics: ["Algorithms", "Analysis", "Theory"]
      }
    ]
  },
  {
    category: "General Computer Science",
    description: "Comprehensive computer science knowledge base",
    icon: "fas fa-laptop-code",
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    resources: [
      {
        name: "GeeksforGeeks (GFG)",
        description: "Articles, tutorials, and interview preparation",
        url: "https://www.geeksforgeeks.org/",
        level: "All Levels",
        topics: ["Programming", "Algorithms", "Interview Questions"]
      },
      {
        name: "HackerRank",
        description: "Coding challenges and skill assessments",
        url: "https://www.hackerrank.com/",
        level: "All Levels",
        topics: ["Programming", "Algorithms", "Databases"]
      },
      {
        name: "Coursera",
        description: "University-level courses from top institutions",
        url: "https://www.coursera.org/",
        level: "All Levels",
        topics: ["Computer Science", "Machine Learning", "Data Science"]
      },
      {
        name: "edX",
        description: "High-quality courses from universities",
        url: "https://www.edx.org/",
        level: "All Levels",
        topics: ["Computer Science", "Programming", "Engineering"]
      }
    ]
  }
];

export default function WhereToLearn() {
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
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default: return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Where to Learn</h2>
        <p className="text-muted-foreground">Curated learning resources for programming, computer science, and technical skills</p>
      </div>

      {/* Learning Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
            <i className="fas fa-lightbulb"></i>
            <span>Learning Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-medium mb-2">Effective Learning Strategies</h4>
              <ul className="space-y-1">
                <li>• Start with fundamentals and build progressively</li>
                <li>• Practice coding daily, even if just for 30 minutes</li>
                <li>• Learn by building projects, not just watching tutorials</li>
                <li>• Join communities and discuss concepts with peers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Resource Selection</h4>
              <ul className="space-y-1">
                <li>• Choose resources that match your current level</li>
                <li>• Combine video tutorials with hands-on practice</li>
                <li>• Use multiple sources to understand difficult concepts</li>
                <li>• Track your progress and set realistic goals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <div className="space-y-8">
        {learningResources.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                  <i className={category.icon}></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{category.category}</h3>
                  <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.resources.map((resource) => (
                  <Card key={resource.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                        </div>
                        <Badge className={getLevelColor(resource.level)}>
                          {resource.level}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {resource.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(resource.url, '_blank')}
                        data-testid={`button-open-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Open Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-plus-circle text-primary"></i>
            <span>More Learning Platforms</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fab fa-youtube text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <h4 className="font-medium text-foreground">YouTube Channels</h4>
              <p className="text-sm text-muted-foreground">Free video tutorials and courses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-book text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <h4 className="font-medium text-foreground">Documentation</h4>
              <p className="text-sm text-muted-foreground">Official language and framework docs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-users text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h4 className="font-medium text-foreground">Communities</h4>
              <p className="text-sm text-muted-foreground">Stack Overflow, Reddit, Discord</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
