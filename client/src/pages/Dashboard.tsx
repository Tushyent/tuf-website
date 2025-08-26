import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

// Sample data for dashboard
const sampleUpcomingEvents = [
  {
    id: "dash-event-1",
    title: "IEEE WIE Connect 2025",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    organizer: "IEEE WIE SSN"
  },
  {
    id: "dash-event-2", 
    title: "CodeX Hackathon",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    organizer: "IEEE CS SSN"
  }
];

const sampleLatestNotes = [
  {
    id: "dash-note-1",
    title: "Data Structures Complete Guide",
    dept: "CSE",
    semester: 3,
    pages: 156,
    courseCode: "CS301"
  },
  {
    id: "dash-note-2",
    title: "Database Management Systems",
    dept: "CSE", 
    semester: 4,
    pages: 198,
    courseCode: "CS401"
  },
  {
    id: "dash-note-3",
    title: "Digital Signal Processing",
    dept: "ECE",
    semester: 5, 
    pages: 267,
    courseCode: "EC501"
  }
];

const sampleMentors = [
  {
    id: "dash-mentor-1",
    user: {
      firstName: "Arjun",
      lastName: "Kumar", 
      department: "CSE",
      program: "BTech '25",
      profileImageUrl: null
    },
    interests: ["Full Stack Dev", "System Design", "DSA"],
    company: "Google",
    role: "SDE-2"
  },
  {
    id: "dash-mentor-2", 
    user: {
      firstName: "Priya",
      lastName: "Sharma",
      department: "ECE",
      program: "BTech '24", 
      profileImageUrl: null
    },
    interests: ["Machine Learning", "Research", "Signal Processing"],
    company: "Microsoft",
    role: "Data Scientist"
  }
];

const sampleOpportunities = [
  {
    id: "dash-opp-1",
    title: "Google Summer Internship 2025",
    type: "Internship",
    deadline: "2025-09-15"
  },
  {
    id: "dash-opp-2",
    title: "Microsoft Off-Campus Drive",
    type: "Full-Time",
    deadline: "2025-09-20"
  }
];

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
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

  const { data: apiUpcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events", { upcoming: true }],
    enabled: isAuthenticated,
  });

  const { data: apiLatestNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["/api/notes"],
    enabled: isAuthenticated,
  });

  const { data: apiFeaturedMentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ["/api/mentors"],
    enabled: isAuthenticated,
  });

  const { data: apiOpportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/opportunities"],
    enabled: isAuthenticated,
  });

  // Use API data if available, otherwise use sample data
  const upcomingEvents = apiUpcomingEvents.length > 0 ? apiUpcomingEvents : sampleUpcomingEvents;
  const latestNotes = apiLatestNotes.length > 0 ? apiLatestNotes : sampleLatestNotes;
  const featuredMentors = apiFeaturedMentors.length > 0 ? apiFeaturedMentors : sampleMentors;
  const opportunities = apiOpportunities.length > 0 ? apiOpportunities : sampleOpportunities;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  const firstName = user?.firstName || "Student";
  const userDept = user?.department || "CSE";
  const userYear = user?.year || 2;

  // Filter notes by user's department and semester
  const relevantNotes = latestNotes.filter((note: any) => 
    note.dept === userDept || note.semester <= userYear
  ).slice(0, 2);

  // Filter mentors by user's department  
  const relevantMentors = featuredMentors.filter((mentor: any) => 
    mentor.user.department === userDept
  ).slice(0, 1);

  const featuredMentor = relevantMentors[0];

  return (
    <div className="space-y-6">
      {/* Hero Section - Enhanced with gradient and better styling */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              Welcome back, {firstName}! 👋
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Start with Seniors → Notes → C2C. Your campus journey simplified.
            </p>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
              <i className="fas fa-leaf text-green-300"></i>
              <span className="text-blue-100">Pages saved from printing: <span className="font-semibold text-white">1,247</span></span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fas fa-graduation-cap text-4xl text-white/80"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards - Enhanced with better colors and styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Events Card */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-blue-900">Upcoming Events</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <i className="fas fa-calendar-alt text-white"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 2).map((event: any) => (
                  <div key={event.id} className="bg-white/70 p-3 rounded-lg border">
                    <div className="font-medium text-gray-900 text-sm">{event.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1 border-blue-300">
                      {event.organizer}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            )}
            <Button asChild size="sm" className="w-full mt-4 bg-blue-600 hover:bg-blue-700" data-testid="button-view-events">
              <Link href="/events">View All Events</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Latest Notes Card */}
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-emerald-900">Latest Notes</CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <i className="fas fa-file-pdf text-white"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {notesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : relevantNotes.length > 0 ? (
              <div className="space-y-3">
                {relevantNotes.map((note: any) => (
                  <div key={note.id} className="bg-white/70 p-3 rounded-lg border">
                    <div className="font-medium text-gray-900 text-sm">{note.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {note.dept} Sem {note.semester} • {note.pages} pages
                    </div>
                    <Badge variant="outline" className="text-xs mt-1 border-emerald-300">
                      {note.courseCode}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes available</p>
            )}
            <Button asChild variant="secondary" size="sm" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-browse-notes">
              <Link href="/notes">Browse Notes</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Featured Mentor Card */}
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-orange-900">Featured Mentor</CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <i className="fas fa-user-graduate text-white"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {mentorsLoading ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              </div>
            ) : featuredMentor ? (
              <div className="bg-white/70 p-3 rounded-lg border">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-12 h-12 border-2 border-orange-300">
                    <AvatarImage src={featuredMentor.user.profileImageUrl || ""} />
                    <AvatarFallback className="bg-orange-200 text-orange-800 font-semibold">
                      {featuredMentor.user.firstName?.[0]}{featuredMentor.user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {featuredMentor.user.firstName} {featuredMentor.user.lastName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {featuredMentor.user.department} • {featuredMentor.user.program}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      {featuredMentor.company} - {featuredMentor.role}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {featuredMentor.interests?.slice(0, 2).map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="text-xs bg-orange-200 text-orange-800">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No mentors available</p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full mt-4 border-orange-300 hover:bg-orange-50" data-testid="button-connect-mentor">
              <Link href="/mentors">Connect Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* C2C Highlight Card */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-purple-900">C2C Highlight</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <i className="fas fa-rocket text-white"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {opportunitiesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : opportunities.length > 0 ? (
              <div className="space-y-3">
                {opportunities.slice(0, 2).map((opp: any) => (
                  <div key={opp.id} className="bg-white/70 p-3 rounded-lg border">
                    <div className="font-medium text-gray-900 text-sm">{opp.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {opp.type} • Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1 border-purple-300">
                      {opp.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="bg-white/70 p-3 rounded-lg border">
                  <div className="font-medium text-gray-900">Resume Template</div>
                  <div className="text-xs text-gray-600">Updated for 2025 trends</div>
                  <Badge variant="outline" className="text-xs mt-1 border-purple-300">
                    Template
                  </Badge>
                </div>
              </div>
            )}
            <Button asChild variant="outline" size="sm" className="w-full mt-4 border-purple-300 hover:bg-purple-50" data-testid="button-explore-c2c">
              <Link href="/c2c">Explore C2C</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Row - Enhanced with better colors */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <i className="fas fa-bolt mr-2"></i>
            Quick Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-3 h-auto p-6 hover:bg-blue-50 hover:scale-105 transition-all duration-200 border border-transparent hover:border-blue-200" data-testid="button-quick-chat-seniors">
              <Link href="/mentors">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <i className="fas fa-user-graduate text-white text-lg"></i>
                </div>
                <span className="text-sm font-medium text-center text-gray-700">Chat with Seniors</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex flex-col items-center space-y-3 h-auto p-6 hover:bg-green-50 hover:scale-105 transition-all duration-200 border border-transparent hover:border-green-200" data-testid="button-quick-notes">
              <Link href="/notes">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <i className="fas fa-file-pdf text-white text-lg"></i>
                </div>
                <span className="text-sm font-medium text-center text-gray-700">Notes</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex flex-col items-center space-y-3 h-auto p-6 hover:bg-purple-50 hover:scale-105 transition-all duration-200 border border-transparent hover:border-purple-200" data-testid="button-quick-events">
              <Link href="/events">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <i className="fas fa-calendar-alt text-white text-lg"></i>
                </div>
                <span className="text-sm font-medium text-center text-gray-700">Events</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex flex-col items-center space-y-3 h-auto p-6 hover:bg-orange-50 hover:scale-105 transition-all duration-200 border border-transparent hover:border-orange-200" data-testid="button-quick-c2c">
              <Link href="/c2c">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <i className="fas fa-rocket text-white text-lg"></i>
                </div>
                <span className="text-sm font-medium text-center text-gray-700">C2C Toolkit</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex flex-col items-center space-y-3 h-auto p-6 hover:bg-red-50 hover:scale-105 transition-all duration-200 border border-transparent hover:border-red-200" data-testid="button-quick-links">
              <Link href="/links">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <i className="fas fa-link text-white text-lg"></i>
                </div>
                <span className="text-sm font-medium text-center text-gray-700">Easy Links</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}