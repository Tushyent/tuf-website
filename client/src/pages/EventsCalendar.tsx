import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";

// Sample events data for demonstration
const sampleEvents = [
  {
    id: "sample-1",
    title: "WIE Connect 2025: Women in Engineering Leadership Summit",
    description: "Inspiring talks from industry leaders, networking sessions, and career guidance for women in engineering. Special guest speakers from Google and Microsoft.",
    organizer: "IEEE WIE SSN",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    location: "Main Auditorium, SSN",
    link: "https://instagram.com/ieee_wie_ssn",
    tags: ["IEEE"],
    instagramHandle: "@ieee_wie_ssn"
  },
  {
    id: "sample-2",
    title: "ACM Orientation & Team Building",
    description: "Welcome to ACM! Get to know your peers, learn about upcoming events, and participate in fun team-building activities.",
    organizer: "SSN ACM",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    location: "CSE Seminar Hall",
    link: "https://instagram.com/ssn_acm",
    tags: ["ACM"],
    instagramHandle: "@ssn_acm"
  },
  {
    id: "sample-3",
    title: "CodeX 2025: 24-Hour Coding Marathon",
    description: "IEEE Computer Society's flagship coding event. Solve challenging problems, win amazing prizes, and showcase your programming skills!",
    organizer: "IEEE CS SSN",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    location: "Computer Lab Block A",
    link: "https://instagram.com/ieee_cs_ssn",
    tags: ["IEEE"],
    instagramHandle: "@ieee_cs_ssn"
  },
  {
    id: "sample-4",
    title: "Department Technical Symposium - Technova",
    description: "Annual technical symposium featuring paper presentations, project exhibitions, and technical competitions across all departments.",
    organizer: "CSE Department",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    location: "CSE Department",
    link: "https://instagram.com/cse_ssn",
    tags: ["Dept"],
    instagramHandle: "@cse_ssn"
  },
  {
    id: "sample-5",
    title: "Invente 2025: Inter-College Cultural Fest",
    description: "SSN's premier cultural festival with music, dance, drama competitions, and celebrity performances. Register your team now!",
    organizer: "Cultural Committee",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    location: "Campus Wide",
    link: "https://instagram.com/invente_ssn",
    tags: ["Clubs"],
    instagramHandle: "@invente_ssn"
  },
  {
    id: "sample-6",
    title: "AI/ML Workshop by IEEE PELS",
    description: "Hands-on workshop on Machine Learning applications in Power Electronics. Learn to implement ML algorithms for power system optimization.",
    organizer: "IEEE PELS SSN",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    location: "EEE Smart Classroom",
    link: "https://instagram.com/ieee_pels_ssn",
    tags: ["IEEE"],
    instagramHandle: "@ieee_pels_ssn"
  },
  {
    id: "sample-7",
    title: "TechClub SSN: IoT Bootcamp",
    description: "3-day intensive bootcamp on Internet of Things. Build your own smart home automation system using Arduino and ESP32.",
    organizer: "TechClub SSN",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    location: "Innovation Lab",
    link: "https://instagram.com/techclub_ssn",
    tags: ["Clubs"],
    instagramHandle: "@techclub_ssn"
  }
];

const eventCategories = [
  { id: "all", label: "All" },
  { id: "IEEE", label: "IEEE" },
  { id: "ACM", label: "ACM" },
  { id: "Dept", label: "Dept" },
  { id: "Clubs", label: "Clubs" },
];

export default function EventsCalendar() {
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

  const { data: apiEvents = [], isLoading: eventsLoading, error } = useQuery({
    queryKey: ["/api/events", { upcoming: true, tags: selectedCategory !== "all" ? [selectedCategory] : undefined }],
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

  // Use API events if available, otherwise use sample events
  const events = apiEvents.length > 0 ? apiEvents : sampleEvents;

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const generateCalendarUrl = (event: any) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: event.description || '',
      location: event.location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const groupEventsByDate = (events: any[]) => {
    const grouped: { [key: string]: any[] } = {};

    // Filter events by selected category
    const filteredEvents = selectedCategory === "all" 
      ? events 
      : events.filter(event => event.tags?.includes(selectedCategory));

    filteredEvents.forEach(event => {
      const eventDate = new Date(event.date);
      let dateKey = "";

      if (isToday(eventDate)) {
        dateKey = `Today - ${format(eventDate, 'MMMM d, yyyy')}`;
      } else if (isTomorrow(eventDate)) {
        dateKey = `Tomorrow - ${format(eventDate, 'MMMM d, yyyy')}`;
      } else if (isThisWeek(eventDate)) {
        dateKey = `This Week - ${format(eventDate, 'EEEE, MMMM d')}`;
      } else {
        dateKey = format(eventDate, 'MMMM d, yyyy');
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Events Calendar</h2>
          <p className="text-muted-foreground">Upcoming events in the next 14 days</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          {eventCategories.map((category) => (
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

      {/* Events List */}
      {eventsLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedEvents).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-foreground mb-3">{dateKey}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dayEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-base leading-tight">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{event.description}</p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            event.tags?.includes('IEEE') ? 'default' :
                            event.tags?.includes('ACM') ? 'secondary' :
                            event.tags?.includes('Dept') ? 'outline' : 'default'
                          }
                          className="ml-2 shrink-0"
                        >
                          {event.organizer.replace(' SSN', '')}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-clock w-4"></i>
                          <span>{format(new Date(event.date), 'h:mm a')}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-map-marker-alt w-4"></i>
                            <span>{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-user w-4"></i>
                          <span>{event.organizer}</span>
                        </div>
                        {event.instagramHandle && (
                          <div className="flex items-center space-x-2">
                            <i className="fab fa-instagram w-4"></i>
                            <span className="text-blue-600">{event.instagramHandle}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(generateCalendarUrl(event), '_blank')}
                          data-testid={`button-add-calendar-${event.id}`}
                        >
                          <i className="fas fa-calendar-plus mr-2"></i>
                          Add to Calendar
                        </Button>
                        {event.link && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(event.link, '_blank')}
                            data-testid={`button-external-link-${event.id}`}
                            className="px-3"
                          >
                            <i className="fab fa-instagram mr-1"></i>
                            IG
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-calendar-times text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground text-center">
              {selectedCategory === "all" 
                ? "There are no upcoming events in the next 14 days."
                : `No upcoming events found for ${selectedCategory}.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}