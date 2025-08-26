import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "placements", label: "Placements" },
  { value: "hackathons", label: "Hackathons" },
  { value: "research", label: "Research" },
  { value: "higher-studies", label: "Higher Studies" },
];

const departments = [
  { value: "all", label: "All Departments" },
  { value: "Computer Science Engineering", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Electronics & Communication", label: "Electronics & Communication" },
  { value: "Electrical & Electronics", label: "Electrical & Electronics" },
  { value: "Mechanical Engineering", label: "Mechanical" },
  { value: "Civil Engineering", label: "Civil" },
];

const skillTags = ["DSA", "ML/AI", "Web Dev", "Cybersec", "IoT", "Mobile Dev", "System Design", "Competitive Programming"];

export default function ChatWithSeniors() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

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

  const { data: mentors = [], isLoading: mentorsLoading, error } = useQuery({
    queryKey: ["/api/mentors", { 
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      department: selectedDepartment !== "all" ? selectedDepartment : undefined,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
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
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const generateWhatsAppUrl = (mentor: any) => {
    const message = `Hi ${mentor.user.firstName}, I'm ${user?.firstName} (Year ${user?.year}, ${user?.department}). I'd love guidance on ${selectedSkills.join(', ') || 'general topics'}. Can we chat? – via TUF`;
    return `https://wa.me/${mentor.contactWhatsapp}?text=${encodeURIComponent(message)}`;
  };

  const generateEmailUrl = (mentor: any) => {
    const subject = "Mentorship request via TUF";
    const body = `Hi ${mentor.user.firstName},\n\nI'm ${user?.firstName} (Year ${user?.year}, ${user?.department}). I'd love guidance on ${selectedSkills.join(', ') || 'general topics'}. Can we connect?\n\nBest regards,\n${user?.firstName}`;
    return `mailto:${mentor.contactEmail || mentor.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Chat with Seniors</h2>
        <p className="text-muted-foreground">Connect with experienced seniors for guidance and mentorship</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger data-testid="select-department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skills/Interests</label>
              <div className="flex flex-wrap gap-2">
                {skillTags.map((skill) => (
                  <Button
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSkill(skill)}
                    data-testid={`button-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      {mentorsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor: any) => (
            <Card key={mentor.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={mentor.user.profileImageUrl || ""} />
                    <AvatarFallback>
                      {mentor.user.firstName?.[0]}{mentor.user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {mentor.user.firstName} {mentor.user.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {mentor.user.department} • {mentor.user.program}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-500 text-sm"></i>
                    <span className="text-sm text-muted-foreground">
                      {mentor.rating ? (mentor.rating / 10).toFixed(1) : "New"}
                    </span>
                  </div>
                </div>
                
                {mentor.user.intro && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {mentor.user.intro}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.interests?.slice(0, 4).map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    {mentor.user.socials?.linkedin && (
                      <i className="fab fa-linkedin text-blue-600"></i>
                    )}
                    {mentor.user.socials?.github && (
                      <i className="fab fa-github text-foreground"></i>
                    )}
                  </div>
                  <Badge variant={mentor.isAvailable ? "default" : "secondary"}>
                    {mentor.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  {mentor.contactWhatsapp ? (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(generateWhatsAppUrl(mentor), '_blank')}
                      disabled={!mentor.isAvailable}
                      data-testid={`button-whatsapp-${mentor.id}`}
                    >
                      <i className="fab fa-whatsapp mr-2"></i>
                      WhatsApp
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled
                    >
                      <i className="fab fa-whatsapp mr-2"></i>
                      WhatsApp
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = generateEmailUrl(mentor)}
                    data-testid={`button-email-${mentor.id}`}
                  >
                    <i className="fas fa-envelope"></i>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-user-graduate text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">No Mentors Found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters to find mentors that match your interests.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
