import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

const departments = [
  "Computer Science Engineering",
  "Information Technology", 
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biomedical Engineering"
];

const programs = ["BE/BTech", "ME/MTech", "PhD"];
const years = [1, 2, 3, 4];

const skillOptions = [
  "DSA", "Machine Learning", "Web Development", "Mobile Development",
  "Data Science", "Competitive Programming", "System Design", "DevOps",
  "Cybersecurity", "IoT", "Blockchain", "UI/UX Design", "Database Management",
  "Cloud Computing", "Artificial Intelligence", "Computer Vision", "NLP"
];

export default function Profile() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    year: "",
    program: "",
    department: "",
    intro: "",
    skills: [] as string[],
    phone: "",
    socials: {
      linkedin: "",
      github: "",
      instagram: ""
    }
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showPhone: false,
    showInstagram: true
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        year: user.year?.toString() || "",
        program: user.program || "",
        department: user.department || "",
        intro: user.intro || "",
        skills: user.skills || [],
        phone: user.phone || "",
        socials: {
          linkedin: user.socials?.linkedin || "",
          github: user.socials?.github || "",
          instagram: user.socials?.instagram || ""
        }
      });
    }
  }, [user]);

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

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value
      }
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      year: formData.year ? parseInt(formData.year) : null,
      program: formData.program,
      department: formData.department,
      intro: formData.intro,
      skills: formData.skills,
      phone: formData.phone,
      socials: formData.socials
    });
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "senior": return { label: "Senior", color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" };
      case "admin": return { label: "Admin", color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" };
      default: return { label: "Student", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" };
    }
  };

  const roleDisplay = getRoleDisplay(user?.role || "student");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">My Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                    data-testid="input-email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                      <SelectTrigger data-testid="select-year">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year === 1 ? "1st Year" : 
                             year === 2 ? "2nd Year" :
                             year === 3 ? "3rd Year" : "4th Year"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                      <SelectTrigger data-testid="select-program">
                        <SelectValue placeholder="Select Program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger data-testid="select-department">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="intro">Introduction</Label>
                  <Textarea
                    id="intro"
                    placeholder="Tell us about your tech interests and extracurricular activities..."
                    value={formData.intro}
                    onChange={(e) => handleInputChange("intro", e.target.value)}
                    rows={4}
                    data-testid="textarea-intro"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    data-testid="input-phone"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-profile"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                      data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.skills.length} skills
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.socials.linkedin}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                    data-testid="input-linkedin"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={formData.socials.github}
                    onChange={(e) => handleSocialChange("github", e.target.value)}
                    data-testid="input-github"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={formData.socials.instagram}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    data-testid="input-instagram"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user?.profileImageUrl || ""} />
                  <AvatarFallback className="text-xl">
                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-muted-foreground mb-2">{formData.email}</p>
                <Badge className={roleDisplay.color}>
                  {roleDisplay.label}
                </Badge>
                {formData.department && formData.year && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.department} • Year {formData.year}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-phone" className="text-sm font-medium">
                    Show phone to juniors
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow juniors to see your contact number
                  </p>
                </div>
                <Switch
                  id="show-phone"
                  checked={privacySettings.showPhone}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showPhone: checked }))
                  }
                  data-testid="switch-show-phone"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-instagram" className="text-sm font-medium">
                    Show Instagram
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Display your Instagram handle publicly
                  </p>
                </div>
                <Switch
                  id="show-instagram"
                  checked={privacySettings.showInstagram}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showInstagram: checked }))
                  }
                  data-testid="switch-show-instagram"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" data-testid="button-change-avatar">
                <i className="fas fa-camera mr-2"></i>
                Change Profile Picture
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-profile">
                <i className="fas fa-download mr-2"></i>
                Export Profile Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
