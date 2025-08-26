import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-2xl">TUF</span>
            </div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Take U Forward
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your comprehensive campus life platform for SSN College. Connect with seniors, access study materials, discover opportunities, and accelerate your career journey.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="text-lg px-8 py-6"
            data-testid="button-login"
          >
            Sign In with SSN Account
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-user-graduate text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
              <CardTitle>Connect with Seniors</CardTitle>
              <CardDescription>
                Get guidance from experienced seniors across all departments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-file-pdf text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>
                Access organized notes and resources by department and semester
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-calendar-alt text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <CardTitle>Campus Events</CardTitle>
              <CardDescription>
                Stay updated with IEEE, ACM, and department events
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-rocket text-orange-600 dark:text-orange-400 text-xl"></i>
              </div>
              <CardTitle>Career Toolkit</CardTitle>
              <CardDescription>
                From campus to career with placement tips and opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-graduation-cap text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <CardTitle>GATE Resources</CardTitle>
              <CardDescription>
                Comprehensive preparation materials for competitive exams
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-2">
                <i className="fas fa-users text-indigo-600 dark:text-indigo-400 text-xl"></i>
              </div>
              <CardTitle>Campus Clubs</CardTitle>
              <CardDescription>
                Discover and connect with all SSN clubs and societies
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>Enhancing Campus Life @ SSN College</p>
          <p className="text-sm mt-2">Built for students, by students</p>
        </div>
      </div>
    </div>
  );
}
