import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const discussionCategories = [
  {
    title: "Placements & Career",
    description: "Discuss placement preparation, interview experiences, and career guidance",
    icon: "fas fa-briefcase",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    channels: [
      {
        name: "SSN Placements Official",
        platform: "WhatsApp",
        description: "Official placement updates and announcements",
        url: "https://chat.whatsapp.com/placement-official",
        members: "500+"
      },
      {
        name: "Interview Experiences",
        platform: "Discord",
        description: "Share and discuss interview experiences",
        url: "https://discord.gg/ssn-interviews",
        members: "250+"
      },
      {
        name: "Resume Reviews",
        platform: "Telegram", 
        description: "Get feedback on your resume from seniors",
        url: "https://t.me/ssn_resume_reviews",
        members: "180+"
      }
    ]
  },
  {
    title: "Hackathons & Competitions",
    description: "Connect with team members and discuss upcoming competitions",
    icon: "fas fa-code",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    channels: [
      {
        name: "SSN Hackathon Hub",
        platform: "Discord",
        description: "Find teammates and discuss hackathon ideas",
        url: "https://discord.gg/ssn-hackathons",
        members: "320+"
      },
      {
        name: "Competitive Programming",
        platform: "WhatsApp",
        description: "Daily contests and CP discussions",
        url: "https://chat.whatsapp.com/cp-ssn",
        members: "150+"
      },
      {
        name: "Project Collaborations",
        platform: "Telegram",
        description: "Find collaborators for your projects",
        url: "https://t.me/ssn_projects",
        members: "200+"
      }
    ]
  },
  {
    title: "Department Discussions",
    description: "Department-specific academic and project discussions",
    icon: "fas fa-graduation-cap",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    channels: [
      {
        name: "CSE Department",
        platform: "WhatsApp",
        description: "CSE students general discussions",
        url: "https://chat.whatsapp.com/cse-dept",
        members: "400+"
      },
      {
        name: "IT Department", 
        platform: "WhatsApp",
        description: "IT students academic discussions",
        url: "https://chat.whatsapp.com/it-dept",
        members: "300+"
      },
      {
        name: "ECE Department",
        platform: "Discord",
        description: "ECE projects and study materials",
        url: "https://discord.gg/ece-ssn",
        members: "250+"
      }
    ]
  },
  {
    title: "Study Groups",
    description: "Form study groups and share academic resources",
    icon: "fas fa-users-study",
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    channels: [
      {
        name: "GATE Preparation",
        platform: "Telegram",
        description: "GATE aspirants study group",
        url: "https://t.me/ssn_gate_prep",
        members: "180+"
      },
      {
        name: "Semester Study Groups",
        platform: "WhatsApp",
        description: "Semester-wise study coordination",
        url: "https://chat.whatsapp.com/study-groups",
        members: "350+"
      },
      {
        name: "Research Discussions",
        platform: "Discord",
        description: "Academic research and paper discussions",
        url: "https://discord.gg/ssn-research",
        members: "120+"
      }
    ]
  }
];

export default function Discussions() {
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

  const { data: channels = [], isLoading: channelsLoading, error } = useQuery({
    queryKey: ["/api/discussions"],
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
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp': return 'fab fa-whatsapp';
      case 'discord': return 'fab fa-discord';
      case 'telegram': return 'fab fa-telegram';
      default: return 'fas fa-comments';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp': return 'bg-green-500';
      case 'discord': return 'bg-indigo-500';
      case 'telegram': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Discussions</h2>
        <p className="text-muted-foreground">Join active community channels and connect with fellow students</p>
      </div>

      {/* Guidelines Card */}
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-900 dark:text-yellow-100">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Community Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
            <p>• Be respectful and professional in all communications</p>
            <p>• No spam, irrelevant content, or self-promotion</p>
            <p>• Help others by sharing knowledge and resources</p>
            <p>• Report any inappropriate behavior to group admins</p>
            <p>• Follow platform-specific rules and guidelines</p>
          </div>
        </CardContent>
      </Card>

      {/* Discussion Categories */}
      <div className="space-y-8">
        {discussionCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                  <i className={category.icon}></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.channels.map((channel) => (
                  <Card key={channel.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{channel.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getPlatformColor(channel.platform)}`}>
                          <i className={`${getPlatformIcon(channel.platform)} text-sm`}></i>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          <i className="fas fa-users mr-1"></i>
                          {channel.members}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {channel.platform}
                        </Badge>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(channel.url, '_blank')}
                        data-testid={`button-join-${channel.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <i className={`${getPlatformIcon(channel.platform)} mr-2`}></i>
                        Join Channel
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request New Channel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-plus-circle text-primary"></i>
            <span>Request New Discussion Channel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Don't see a discussion channel that fits your needs? Request a new one and we'll help you get it started.
          </p>
          <Button data-testid="button-request-channel">
            <i className="fas fa-plus mr-2"></i>
            Request New Channel
          </Button>
        </CardContent>
      </Card>

      {/* Database Channels (if any) */}
      {channels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel: any) => (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{channel.label}</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {channel.topicTags?.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getPlatformColor(channel.platform)}`}>
                        <i className={`${getPlatformIcon(channel.platform)} text-sm`}></i>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(channel.url, '_blank')}
                      data-testid={`button-join-db-${channel.id}`}
                    >
                      <i className={`${getPlatformIcon(channel.platform)} mr-2`}></i>
                      Join {channel.platform}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
