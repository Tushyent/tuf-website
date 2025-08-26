import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const gateStreams = [
  { value: "cs", label: "GATE - Computer Science" },
  { value: "ec", label: "GATE - Electronics & Communication" },
  { value: "ee", label: "GATE - Electrical Engineering" },
  { value: "me", label: "GATE - Mechanical Engineering" },
  { value: "ce", label: "GATE - Civil Engineering" },
];

const csTopics = [
  {
    name: "Data Structures & Algorithms",
    resources: [
      { name: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/", description: "Comprehensive DSA tutorials" },
      { name: "Take U Forward DSA", url: "https://takeuforward.org/", description: "Structured DSA course by Striver" },
      { name: "Abdul Bari Algorithms", url: "https://www.youtube.com/c/AbdulBari", description: "In-depth algorithm explanations" },
    ]
  },
  {
    name: "Operating Systems",
    resources: [
      { name: "Gate Smashers OS", url: "https://www.youtube.com/c/GateSmashers", description: "Complete OS playlist" },
      { name: "Knowledge Gate", url: "https://www.youtube.com/c/KnowledgeGate", description: "OS concepts explained" },
      { name: "Neso Academy", url: "https://www.youtube.com/c/nesoacademy", description: "Detailed OS tutorials" },
    ]
  },
  {
    name: "Database Management Systems",
    resources: [
      { name: "Gate Smashers DBMS", url: "https://www.youtube.com/c/GateSmashers", description: "Complete DBMS course" },
      { name: "Jenny's Lectures", url: "https://www.youtube.com/c/JennyslecturesCSIT", description: "DBMS fundamentals" },
      { name: "5 Minutes Engineering", url: "https://www.youtube.com/c/5MinutesEngineering", description: "Quick DBMS concepts" },
    ]
  },
  {
    name: "Computer Networks",
    resources: [
      { name: "Gate Smashers CN", url: "https://www.youtube.com/c/GateSmashers", description: "Complete networking course" },
      { name: "Knowledge Gate CN", url: "https://www.youtube.com/c/KnowledgeGate", description: "Network protocols explained" },
      { name: "Neso Academy CN", url: "https://www.youtube.com/c/nesoacademy", description: "Networking fundamentals" },
    ]
  },
  {
    name: "Theory of Computation",
    resources: [
      { name: "Neso Academy TOC", url: "https://www.youtube.com/c/nesoacademy", description: "Complete TOC playlist" },
      { name: "Gate Lectures by Ravindrababu", url: "https://www.youtube.com/c/GateLecturesByRavindrababuRavula", description: "TOC concepts" },
      { name: "Knowledge Gate TOC", url: "https://www.youtube.com/c/KnowledgeGate", description: "Automata theory" },
    ]
  },
  {
    name: "Computer Organization & Architecture",
    resources: [
      { name: "Gate Smashers COA", url: "https://www.youtube.com/c/GateSmashers", description: "Complete COA course" },
      { name: "Neso Academy COA", url: "https://www.youtube.com/c/nesoacademy", description: "Computer architecture" },
      { name: "GATE Applied Course", url: "https://www.youtube.com/c/GATEAppliedCourse", description: "Advanced COA topics" },
    ]
  }
];

const ecTopics = [
  {
    name: "Digital Signal Processing",
    resources: [
      { name: "NPTEL DSP", url: "https://nptel.ac.in/", description: "Digital signal processing course" },
      { name: "Gate Academy", url: "https://www.youtube.com/c/GateAcademy", description: "DSP for GATE" },
      { name: "All About Electronics", url: "https://www.youtube.com/c/AllAboutElectronics", description: "DSP concepts" },
    ]
  },
  {
    name: "Control Systems",
    resources: [
      { name: "Gate Academy", url: "https://www.youtube.com/c/GateAcademy", description: "Control systems course" },
      { name: "NPTEL Control", url: "https://nptel.ac.in/", description: "Advanced control theory" },
      { name: "Electronics Academy", url: "https://www.youtube.com/", description: "Control engineering" },
    ]
  }
];

export default function GateResources() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedStream, setSelectedStream] = useState("cs");
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

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

  const toggleTopicCompletion = (topicName: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicName)) {
      newCompleted.delete(topicName);
    } else {
      newCompleted.add(topicName);
    }
    setCompletedTopics(newCompleted);
  };

  const getCurrentTopics = () => {
    switch (selectedStream) {
      case "cs": return csTopics;
      case "ec": return ecTopics;
      default: return csTopics;
    }
  };

  const currentTopics = getCurrentTopics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">GATE Resources</h2>
        <p className="text-muted-foreground">Comprehensive preparation materials for GATE examination</p>
      </div>

      {/* Stream Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-foreground mb-2">Select GATE Stream</label>
            <Select value={selectedStream} onValueChange={setSelectedStream}>
              <SelectTrigger data-testid="select-gate-stream">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gateStreams.map((stream) => (
                  <SelectItem key={stream.value} value={stream.value}>
                    {stream.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-chart-pie text-primary"></i>
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedTopics.size}</div>
              <div className="text-sm text-muted-foreground">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{currentTopics.length}</div>
              <div className="text-sm text-muted-foreground">Total Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {currentTopics.length > 0 ? Math.round((completedTopics.size / currentTopics.length) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="space-y-6">
        {currentTopics.map((topic) => (
          <Card key={topic.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <i className="fas fa-book text-primary"></i>
                  <span>{topic.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={completedTopics.has(topic.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTopicCompletion(topic.name)}
                    data-testid={`button-mark-complete-${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <i className={`fas ${completedTopics.has(topic.name) ? 'fa-check' : 'fa-square'} mr-2`}></i>
                    {completedTopics.has(topic.name) ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.resources.map((resource) => (
                  <Card key={resource.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-play text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-1">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                          <Button 
                            size="sm" 
                            onClick={() => window.open(resource.url, '_blank')}
                            data-testid={`button-open-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Open Resource
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Study Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-lightbulb text-yellow-500"></i>
            <span>Study Tips for GATE</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Preparation Strategy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-emerald-600 mt-0.5"></i>
                  <span>Start with fundamentals and build strong concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-emerald-600 mt-0.5"></i>
                  <span>Practice previous year questions regularly</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-emerald-600 mt-0.5"></i>
                  <span>Take mock tests to improve time management</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-emerald-600 mt-0.5"></i>
                  <span>Revise topics multiple times for retention</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Important Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-star text-yellow-500 mt-0.5"></i>
                  <span>Standard textbooks for theoretical concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-star text-yellow-500 mt-0.5"></i>
                  <span>Online video lectures for visual learning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-star text-yellow-500 mt-0.5"></i>
                  <span>Practice platforms for numerical problems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-star text-yellow-500 mt-0.5"></i>
                  <span>Discussion forums for doubt clarification</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
