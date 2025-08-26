import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const linkGroups = [
  {
    id: "ssn",
    label: "SSN Official",
    icon: "fas fa-university",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    links: [
      {
        name: "SSN Official Website",
        url: "https://ssn.edu.in/",
        description: "Main college website"
      },
      {
        name: "SSN LinkedIn",
        url: "https://www.linkedin.com/school/ssn-college-of-engineering/",
        description: "Official LinkedIn page"
      },
      {
        name: "SSN YouTube",
        url: "https://www.youtube.com/c/SSNCollegeofEngineering",
        description: "Official YouTube channel"
      },
      {
        name: "SSN Instagram",
        url: "https://www.instagram.com/ssn_institutions/",
        description: "Official Instagram handle"
      },
      {
        name: "SSN Facebook",
        url: "https://www.facebook.com/SSNCollegeOfEngineering/",
        description: "Official Facebook page"
      }
    ]
  },
  {
    id: "flagship",
    label: "Flagship Events",
    icon: "fas fa-flag",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    links: [
      {
        name: "SSN Instincts",
        url: "https://www.instagram.com/ssn_instincts/",
        description: "Annual cultural fest"
      },
      {
        name: "Invente",
        url: "https://www.instagram.com/invente_ssn/",
        description: "Annual technical symposium"
      },
      {
        name: "Instincts Official Page",
        url: "https://instincts.ssn.edu.in/",
        description: "Cultural fest official website"
      },
      {
        name: "Invente Official Page",
        url: "https://invente.ssn.edu.in/",
        description: "Technical symposium website"
      }
    ]
  },
  {
    id: "alumni",
    label: "Alumni Network",
    icon: "fas fa-users",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    links: [
      {
        name: "SSN Alumni Association",
        url: "https://www.linkedin.com/company/ssn-alumni-association/",
        description: "Official alumni network"
      },
      {
        name: "Alumni LinkedIn Group",
        url: "https://www.linkedin.com/groups/4644510/",
        description: "LinkedIn alumni community"
      },
      {
        name: "Alumni Portal",
        url: "https://alumni.ssn.edu.in/",
        description: "Alumni registration and networking"
      }
    ]
  },
  {
    id: "ieee",
    label: "IEEE Chapters",
    icon: "fab fa-connectdevelop",
    color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    links: [
      {
        name: "IEEE SSN SB",
        url: "https://www.instagram.com/ieee_ssn/",
        description: "IEEE Student Branch"
      },
      {
        name: "IEEE Computer Society",
        url: "https://www.instagram.com/ssn_ieee_cs/",
        description: "Computer Society Chapter"
      },
      {
        name: "IEEE WIE",
        url: "https://www.instagram.com/ssn_ieee_wie/",
        description: "Women in Engineering"
      },
      {
        name: "IEEE PELS",
        url: "https://www.instagram.com/ssn_ieee_pels/",
        description: "Power Electronics Society"
      },
      {
        name: "IEEE PES",
        url: "https://www.instagram.com/ssn_ieee_pes/",
        description: "Power & Energy Society"
      },
      {
        name: "IEEE Photonics Society",
        url: "https://www.instagram.com/ssn_ieee_photonics/",
        description: "Photonics Society Chapter"
      }
    ]
  },
  {
    id: "acm",
    label: "ACM Chapters",
    icon: "fas fa-code",
    color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
    links: [
      {
        name: "SSN ACM",
        url: "https://www.instagram.com/ssn_acm/",
        description: "ACM Student Chapter"
      },
      {
        name: "SSN ACM-W",
        url: "https://www.instagram.com/ssn_acmw/",
        description: "ACM Women Chapter"
      },
      {
        name: "ACM SIGCHI",
        url: "https://www.instagram.com/ssn_acm_sigchi/",
        description: "Human-Computer Interaction"
      },
      {
        name: "ACM SIGSOFT",
        url: "https://www.instagram.com/ssn_acm_sigsoft/",
        description: "Software Engineering"
      }
    ]
  },
  {
    id: "clubs",
    label: "Department & Clubs",
    icon: "fas fa-users-cog",
    color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400",
    links: [
      {
        name: "TechClub SSN",
        url: "https://www.instagram.com/techclub_ssn/",
        description: "Technical club"
      },
      {
        name: "BuildClub SSN",
        url: "https://www.instagram.com/buildclub_ssn/",
        description: "Innovation and building"
      },
      {
        name: "SSN Coding Club",
        url: "https://www.instagram.com/ssn_coding/",
        description: "Competitive programming"
      },
      {
        name: "SSN Photo Club",
        url: "https://www.instagram.com/ssn_photoclub/",
        description: "Photography club"
      },
      {
        name: "SSN Gradient Club",
        url: "https://www.instagram.com/ssn_gradient/",
        description: "Design and arts"
      },
      {
        name: "SSN Lakshya",
        url: "https://www.instagram.com/ssn_lakshya/",
        description: "Cultural activities"
      },
      {
        name: "Saaral Tamil Mandram",
        url: "https://www.instagram.com/saaral_ssn/",
        description: "Tamil literary association"
      }
    ]
  }
];

export default function EasyLinks() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("ssn");

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

  const { data: dbLinks = [], isLoading: linksLoading, error } = useQuery({
    queryKey: ["/api/links", { search: searchQuery || undefined }],
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
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const filteredGroups = linkGroups.filter(group => 
    searchQuery === "" || 
    group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.links.some(link => 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const copyToClipboard = (url: string, name: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied",
        description: `${name} link copied to clipboard`,
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Easy Access to Links</h2>
        <p className="text-muted-foreground">Quick access to all important SSN college and organization links</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <Input
              type="text"
              placeholder="Search links, organizations, or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-links"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {linkGroups.map((group) => (
          <Card 
            key={group.id} 
            className={`hover:shadow-md transition-shadow cursor-pointer ${activeGroup === group.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActiveGroup(group.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${group.color}`}>
                <i className={group.icon}></i>
              </div>
              <h3 className="font-medium text-sm">{group.label}</h3>
              <p className="text-xs text-muted-foreground">{group.links.length} links</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Links Tabs */}
      <Tabs value={activeGroup} onValueChange={setActiveGroup}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {linkGroups.map((group) => (
            <TabsTrigger key={group.id} value={group.id} className="text-xs" data-testid={`tab-${group.id}`}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredGroups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.color}`}>
                    <i className={group.icon}></i>
                  </div>
                  <span>{group.label}</span>
                  <Badge variant="secondary">{group.links.length} links</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.links
                    .filter(link => 
                      searchQuery === "" || 
                      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      link.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((link) => (
                    <Card key={link.name} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{link.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(link.url, link.name)}
                            data-testid={`button-copy-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <i className="fas fa-copy"></i>
                          </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => window.open(link.url, '_blank')}
                            data-testid={`button-visit-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <i className="fas fa-external-link-alt mr-2"></i>
                            Visit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(link.url, link.name)}
                          >
                            <i className="fas fa-share"></i>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Database Links */}
      {dbLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <i className="fas fa-database text-primary"></i>
              <span>Additional Links</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {linksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dbLinks.map((link: any) => (
                  <Card key={link.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{link.label}</h4>
                          {link.description && (
                            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                          )}
                          <Badge variant="outline" className="mt-2 text-xs">
                            {link.group}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(link.url, link.label)}
                        >
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(link.url, '_blank')}
                          data-testid={`button-visit-db-${link.id}`}
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Popular Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-fire text-orange-500"></i>
            <span>Most Visited Links</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "SSN Official Website",
              "SSN ACM",
              "IEEE SSN SB", 
              "TechClub SSN",
              "SSN Instincts",
              "Invente",
              "SSN Alumni Association",
              "SSN LinkedIn"
            ].map((linkName) => (
              <Button key={linkName} variant="outline" size="sm" data-testid={`button-popular-${linkName.toLowerCase().replace(/\s+/g, '-')}`}>
                {linkName}
                <i className="fas fa-external-link-alt ml-2 text-xs"></i>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-suggest-link">
              <i className="fas fa-plus text-lg"></i>
              <span className="text-sm">Suggest New Link</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-report-broken">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              <span className="text-sm">Report Broken Link</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-1" data-testid="button-bookmark-links">
              <i className="fas fa-bookmark text-lg"></i>
              <span className="text-sm">Bookmark Links</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
