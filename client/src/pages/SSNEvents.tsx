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

const societyGroups = [
  {
    id: "ieee",
    label: "IEEE Societies",
    societies: [
      "IEEE Photonics Society",
      "SSN IEEE PELS",
      "SSN IEEE PES", 
      "SSN IEEE WIE",
      "SSN IEEE Computer Society",
      "SSN IEEE Communications Society"
    ]
  },
  {
    id: "acm",
    label: "ACM Societies",
    societies: [
      "SSN ACM",
      "SSN ACM-W",
      "SSN ACM SIGCHI",
      "SSN ACM SIGSOFT"
    ]
  },
  {
    id: "dept",
    label: "Department Clubs",
    societies: [
      "AIT (CSE Association)",
      "ACE Computer",
      "ABE (Biomedical)",
      "AME (Mechanical)",
      "ACE Civil",
      "ACE Chemical",
      "EEE Association",
      "ECE Association"
    ]
  }
];

export default function SSNEvents() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSociety, setSelectedSociety] = useState("");

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
    queryKey: ["/api/events", { 
      organizer: selectedSociety || undefined,
      tags: selectedGroup ? [selectedGroup.toUpperCase()] : undefined 
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

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    setSelectedSociety("");
  };

  const availableSocieties = selectedGroup 
    ? societyGroups.find(g => g.id === selectedGroup)?.societies || []
    : [];

  const getInstagramUrl = (societyName: string) => {
    const handle = societyName.toLowerCase()
      .replace(/ssn\s?/g, "ssn")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    return `https://instagram.com/${handle}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Events of SSN</h2>
        <p className="text-muted-foreground">Discover events organized by IEEE, ACM, and departmental societies</p>
      </div>

      {/* Society Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Society Group</label>
              <Select value={selectedGroup} onValueChange={handleGroupChange}>
                <SelectTrigger data-testid="select-society-group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {societyGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Society/Club</label>
              <Select 
                value={selectedSociety} 
                onValueChange={setSelectedSociety}
                disabled={!selectedGroup}
              >
                <SelectTrigger data-testid="select-society">
                  <SelectValue placeholder="Select a society" />
                </SelectTrigger>
                <SelectContent>
                  {availableSocieties.map((society) => (
                    <SelectItem key={society} value={society}>
                      {society}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Display */}
      {selectedSociety ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Events by {selectedSociety}
            </h3>
            <Button
              variant="outline"
              onClick={() => window.open(getInstagramUrl(selectedSociety), '_blank')}
              data-testid="button-instagram-page"
            >
              <i className="fab fa-instagram mr-2"></i>
              Instagram Page
            </Button>
          </div>

          {eventsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map((event: any) => (
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
                        selectedGroup === 'ieee' ? 'default' :
                        selectedGroup === 'acm' ? 'secondary' : 'outline'
                      }>
                        {selectedGroup.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-clock w-4"></i>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-map-marker-alt w-4"></i>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1" data-testid={`button-register-${event.id}`}>
                        <i className="fas fa-user-plus mr-2"></i>
                        Register
                      </Button>
                      {event.link && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(event.link, '_blank')}
                          data-testid={`button-details-${event.id}`}
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <i className="fas fa-calendar-times text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
                <p className="text-muted-foreground text-center">
                  {selectedSociety} hasn't posted any events recently.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.open(getInstagramUrl(selectedSociety), '_blank')}
                  data-testid="button-check-instagram"
                >
                  <i className="fab fa-instagram mr-2"></i>
                  Check their Instagram
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-users text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Society</h3>
            <p className="text-muted-foreground text-center">
              Choose a society group and then select a specific society to view their events.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
