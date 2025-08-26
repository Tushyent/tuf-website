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

  const { data: events = [], isLoading: eventsLoading, error } = useQuery({
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
    
    events.forEach(event => {
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
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                        </div>
                        <Badge variant={
                          event.tags?.includes('IEEE') ? 'default' :
                          event.tags?.includes('ACM') ? 'secondary' :
                          event.tags?.includes('Dept') ? 'outline' : 'default'
                        }>
                          {event.organizer}
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
                          >
                            <i className="fas fa-external-link-alt"></i>
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
