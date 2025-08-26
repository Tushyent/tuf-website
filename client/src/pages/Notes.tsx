import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

const departments = [
  { value: "", label: "Select Department" },
  { value: "cse", label: "Computer Science Engineering" },
  { value: "it", label: "Information Technology" },
  { value: "ece", label: "Electronics & Communication" },
  { value: "eee", label: "Electrical & Electronics" },
  { value: "mechanical", label: "Mechanical Engineering" },
  { value: "civil", label: "Civil Engineering" },
];

const semestersByDept: { [key: string]: number[] } = {
  "cse": [1, 2, 3, 4, 5, 6, 7, 8],
  "it": [1, 2, 3, 4, 5, 6, 7, 8],
  "ece": [1, 2, 3, 4, 5, 6, 7, 8],
  "eee": [1, 2, 3, 4, 5, 6, 7, 8],
  "mechanical": [1, 2, 3, 4, 5, 6, 7, 8],
  "civil": [1, 2, 3, 4, 5, 6, 7, 8],
};

const coursesByDeptSem: { [key: string]: { [key: number]: { code: string; name: string }[] } } = {
  "cse": {
    3: [
      { code: "CS19301", name: "Data Structures and Algorithms" },
      { code: "CS19302", name: "Digital Logic Design" },
      { code: "CS19303", name: "Object Oriented Programming" },
    ],
    4: [
      { code: "CS19403", name: "Operating Systems" },
      { code: "CS19404", name: "Database Management Systems" },
      { code: "CS19405", name: "Design and Analysis of Algorithms" },
    ],
    5: [
      { code: "CS19502", name: "Computer Networks" },
      { code: "CS19503", name: "Software Engineering" },
      { code: "CS19504", name: "Theory of Computation" },
    ],
    6: [
      { code: "CS19601", name: "Compiler Design" },
      { code: "CS19602", name: "Machine Learning" },
      { code: "CS19603", name: "Computer Graphics" },
    ],
  },
  "it": {
    5: [
      { code: "IT19502", name: "Database Management Systems" },
      { code: "IT19503", name: "Web Technologies" },
      { code: "IT19504", name: "Software Testing" },
    ],
  },
  // Add more departments and courses as needed
};

export default function Notes() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | "">("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: notes = [], isLoading: notesLoading, error } = useQuery({
    queryKey: ["/api/notes", { 
      dept: selectedDept || undefined,
      semester: selectedSemester || undefined,
      courseCode: selectedCourse || undefined,
      search: searchQuery || undefined,
    }],
    enabled: isAuthenticated,
  });

  const downloadMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await apiRequest("POST", `/api/notes/${noteId}/download`);
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
        title: "Error",
        description: "Failed to record download",
        variant: "destructive",
      });
    },
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

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    setSelectedSemester("");
    setSelectedCourse("");
  };

  const handleSemesterChange = (semester: string) => {
    const sem = semester ? parseInt(semester) : "";
    setSelectedSemester(sem);
    setSelectedCourse("");
  };

  const availableSemesters = selectedDept ? semestersByDept[selectedDept] || [] : [];
  const availableCourses = selectedDept && selectedSemester ? 
    coursesByDeptSem[selectedDept]?.[selectedSemester as number] || [] : [];

  const handleNoteOpen = (note: any) => {
    downloadMutation.mutate(note.id);
    window.open(note.fileUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notes & Study Materials</h2>
        <p className="text-muted-foreground">Access course materials organized by department, semester, and subject</p>
      </div>

      {/* Navigation Dropdowns */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department</label>
              <Select value={selectedDept} onValueChange={handleDeptChange}>
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
              <label className="block text-sm font-medium text-foreground mb-2">Semester</label>
              <Select 
                value={selectedSemester?.toString() || ""} 
                onValueChange={handleSemesterChange}
                disabled={!selectedDept}
              >
                <SelectTrigger data-testid="select-semester">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Course</label>
              <Select 
                value={selectedCourse} 
                onValueChange={setSelectedCourse}
                disabled={!selectedDept || !selectedSemester}
              >
                <SelectTrigger data-testid="select-course">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-search-notes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes Content */}
      {notesLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {selectedDept || selectedSemester || selectedCourse || searchQuery ? "Search Results" : "Popular Notes"}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {notes.map((note: any) => (
              <Card key={note.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-file-pdf text-red-600 dark:text-red-400 text-xl"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-1">{note.title}</h4>
                      {note.description && (
                        <p className="text-sm text-muted-foreground mb-2">{note.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                        <span>{note.dept} • Semester {note.semester}</span>
                        <span>•</span>
                        <span>{note.courseCode}</span>
                        <span>•</span>
                        <span>{note.pages} pages</span>
                        <span>•</span>
                        <span>Uploaded by: {note.uploader.firstName} {note.uploader.lastName?.[0]}.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleNoteOpen(note)}
                          data-testid={`button-open-note-${note.id}`}
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Open PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNoteOpen(note)}
                          data-testid={`button-download-note-${note.id}`}
                        >
                          <i className="fas fa-download"></i>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-star-note-${note.id}`}
                        >
                          <i className="fas fa-star"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-file-pdf text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-medium text-foreground mb-2">No Notes Found</h3>
            <p className="text-muted-foreground text-center">
              {selectedDept || selectedSemester || selectedCourse || searchQuery
                ? "Try adjusting your search criteria or filters."
                : "No notes have been uploaded yet. Be the first to contribute!"
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      {user?.role === 'senior' || user?.role === 'admin' ? (
        <Card className="bg-muted">
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Upload New Notes</h4>
            <p className="text-sm text-muted-foreground mb-4">Help your juniors by sharing your study materials</p>
            <Button data-testid="button-upload-notes">
              <i className="fas fa-plus mr-2"></i>
              Upload Notes
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
