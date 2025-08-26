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

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events", { upcoming: true }],
    enabled: isAuthenticated,
  });

  const { data: latestNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["/api/notes"],
    enabled: isAuthenticated,
  });

  const { data: featuredMentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ["/api/mentors"],
    enabled: isAuthenticated,
  });

  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/opportunities"],
    enabled: isAuthenticated,
  });

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {firstName}! 👋
        </h2>
        <p className="opacity-90 mb-4">
          Start with Seniors → Notes → C2C. Your campus journey simplified.
        </p>
        <div className="flex items-center space-x-2 text-blue-100">
          <i className="fas fa-leaf"></i>
          <span>Pages saved from printing: 247</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Upcoming Events Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <i className="fas fa-calendar-alt text-primary"></i>
            </div>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map((event: any) => (
                  <div key={event.id} className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">{event.title}</div>
                    <div className="text-xs">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            )}
            <Button asChild size="sm" className="w-full mt-3" data-testid="button-view-events">
              <Link href="/events">View All Events</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Latest Notes Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Latest Notes</CardTitle>
              <i className="fas fa-file-pdf text-emerald-600"></i>
            </div>
          </CardHeader>
          <CardContent>
            {notesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : relevantNotes.length > 0 ? (
              <div className="space-y-2">
                {relevantNotes.map((note: any) => (
                  <div key={note.id} className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">{note.title}</div>
                    <div className="text-xs">
                      {note.dept} Sem {note.semester} • {note.pages} pages
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes available</p>
            )}
            <Button asChild variant="secondary" size="sm" className="w-full mt-3" data-testid="button-browse-notes">
              <Link href="/notes">Browse Notes</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Featured Mentor Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Featured Mentor</CardTitle>
              <i className="fas fa-user-graduate text-orange-500"></i>
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
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={featuredMentor.user.profileImageUrl || ""} />
                    <AvatarFallback>
                      {featuredMentor.user.firstName?.[0]}{featuredMentor.user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {featuredMentor.user.firstName} {featuredMentor.user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {featuredMentor.user.department} • {featuredMentor.user.program}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {featuredMentor.interests?.slice(0, 2).map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No mentors available</p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full mt-3" data-testid="button-connect-mentor">
              <Link href="/mentors">Connect Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* C2C Highlight Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">C2C Highlight</CardTitle>
              <i className="fas fa-rocket text-purple-500"></i>
            </div>
          </CardHeader>
          <CardContent>
            {opportunitiesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ) : opportunities.length > 0 ? (
              <div className="space-y-2">
                {opportunities.slice(0, 2).map((opp: any) => (
                  <div key={opp.id} className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">{opp.title}</div>
                    <div className="text-xs">{opp.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground">Resume Template</div>
                  <div className="text-xs">Updated for 2025 trends</div>
                </div>
              </div>
            )}
            <Button asChild variant="outline" size="sm" className="w-full mt-3" data-testid="button-explore-c2c">
              <Link href="/c2c">Explore C2C</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Row */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-2 h-auto p-4" data-testid="button-quick-chat-seniors">
              <Link href="/mentors">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-graduate text-blue-600 dark:text-blue-400"></i>
                </div>
                <span className="text-xs font-medium text-center">Chat with Seniors</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-2 h-auto p-4" data-testid="button-quick-notes">
              <Link href="/notes">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-pdf text-green-600 dark:text-green-400"></i>
                </div>
                <span className="text-xs font-medium text-center">Notes</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-2 h-auto p-4" data-testid="button-quick-events">
              <Link href="/events">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-alt text-purple-600 dark:text-purple-400"></i>
                </div>
                <span className="text-xs font-medium text-center">Events</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-2 h-auto p-4" data-testid="button-quick-c2c">
              <Link href="/c2c">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-rocket text-orange-600 dark:text-orange-400"></i>
                </div>
                <span className="text-xs font-medium text-center">C2C Toolkit</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="flex flex-col items-center space-y-2 h-auto p-4" data-testid="button-quick-links">
              <Link href="/links">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <i className="fas fa-link text-red-600 dark:text-red-400"></i>
                </div>
                <span className="text-xs font-medium text-center">Easy Links</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
