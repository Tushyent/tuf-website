import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

// Import all pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import EventsCalendar from "@/pages/EventsCalendar";
import Clubs from "@/pages/Clubs";
import SSNEvents from "@/pages/SSNEvents";
import Notes from "@/pages/Notes";
import GateResources from "@/pages/GateResources";
import Projects from "@/pages/Projects";
import Discussions from "@/pages/Discussions";
import WhereToLearn from "@/pages/WhereToLearn";
import ChatWithSeniors from "@/pages/ChatWithSeniors";
import NPTELCourses from "@/pages/NPTELCourses";
import PlacementTips from "@/pages/PlacementTips";
import C2CToolkit from "@/pages/C2CToolkit";
import EasyLinks from "@/pages/EasyLinks";
import Profile from "@/pages/Profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Layout>
          <Route path="/" component={Dashboard} />
          <Route path="/events" component={EventsCalendar} />
          <Route path="/clubs" component={Clubs} />
          <Route path="/ssn-events" component={SSNEvents} />
          <Route path="/notes" component={Notes} />
          <Route path="/gate-resources" component={GateResources} />
          <Route path="/projects" component={Projects} />
          <Route path="/discussions" component={Discussions} />
          <Route path="/learn" component={WhereToLearn} />
          <Route path="/mentors" component={ChatWithSeniors} />
          <Route path="/courses" component={NPTELCourses} />
          <Route path="/placement" component={PlacementTips} />
          <Route path="/c2c" component={C2CToolkit} />
          <Route path="/links" component={EasyLinks} />
          <Route path="/profile" component={Profile} />
        </Layout>
      )}
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
