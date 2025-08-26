import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt", path: "/" },
  { id: "events-calendar", label: "Events Calendar", icon: "fas fa-calendar-alt", path: "/events" },
  { id: "clubs", label: "Clubs in SSN", icon: "fas fa-users", path: "/clubs" },
  { id: "ssn-events", label: "Events of SSN", icon: "fas fa-star", path: "/ssn-events" },
  { 
    id: "resources", 
    label: "Resources", 
    icon: "fas fa-book", 
    children: [
      { id: "notes", label: "Notes", icon: "fas fa-file-pdf", path: "/notes" },
      { id: "gate-resources", label: "GATE Resources", icon: "fas fa-graduation-cap", path: "/gate-resources" },
    ]
  },
  { id: "projects", label: "Projects (IFP)", icon: "fas fa-project-diagram", path: "/projects" },
  { id: "discussions", label: "Discussions", icon: "fas fa-comments", path: "/discussions" },
  { id: "where-to-learn", label: "Where to Learn", icon: "fas fa-lightbulb", path: "/learn" },
  { id: "chat-seniors", label: "Chat with Seniors", icon: "fas fa-user-graduate", path: "/mentors" },
  { id: "nptel-courses", label: "NPTEL / Online Courses", icon: "fas fa-laptop-code", path: "/courses" },
  { id: "placement-tips", label: "Placement Tips", icon: "fas fa-briefcase", path: "/placement" },
  { id: "c2c-toolkit", label: "Campus to Career (C2C)", icon: "fas fa-rocket", path: "/c2c" },
  { id: "easy-links", label: "Easy Access to Links", icon: "fas fa-link", path: "/links" },
  { id: "profile", label: "My Profile", icon: "fas fa-user", path: "/profile" },
];

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const [location] = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>("resources");

  const toggleExpanded = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <nav 
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transition-transform duration-300 ease-in-out",
        isMobile && !isOpen && "-translate-x-full",
        !isMobile && "translate-x-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TUF</span>
          </div>
          <span className="font-semibold text-card-foreground">Take U Forward</span>
        </div>
        {isMobile && (
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
        {navItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              // Dropdown item
              <div className="space-y-1">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  data-testid={`button-toggle-${item.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${item.icon} w-5`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedItem === item.id && "rotate-90"
                    )}
                  />
                </button>
                {expandedItem === item.id && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.path}
                        onClick={handleLinkClick}
                        data-testid={`link-${child.id}`}
                      >
                        <div
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                            location === child.path
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <i className={`${child.icon} w-4`} />
                          <span>{child.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Regular item
              <Link
                href={item.path}
                onClick={handleLinkClick}
                data-testid={`link-${item.id}`}
              >
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    location === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <i className={`${item.icon} w-5`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
