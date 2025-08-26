# TUF - Take U Forward: Campus Life Platform

## Overview

TUF (Take U Forward) is a comprehensive campus life platform designed specifically for SSN College of Engineering. This web application serves as a centralized hub for students to access study materials, connect with seniors, discover opportunities, participate in college events, and accelerate their career journey. The platform provides a mobile-first responsive design while maintaining excellent desktop functionality for presentations and demos.

The application is structured as a full-stack web platform featuring a React frontend with modern UI components, an Express.js backend with RESTful APIs, and PostgreSQL database integration. It includes comprehensive authentication through Replit's OIDC system and provides role-based access control for students, seniors, and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with path-based navigation
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript for end-to-end type safety
- **Authentication**: Replit Auth integration with OpenID Connect (OIDC) for secure user authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful endpoints with consistent error handling and logging middleware

### Database Architecture
- **Database**: PostgreSQL for reliable relational data storage
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Comprehensive schema covering users, mentors, notes, events, clubs, opportunities, projects, links, and discussion channels
- **Migrations**: Drizzle Kit for database schema migrations and version control

### Authentication & Authorization
- **Provider**: Replit Auth with OIDC for seamless integration with the platform
- **Session Storage**: PostgreSQL-backed sessions for scalable session management
- **Role System**: User roles (student, senior, admin) for access control
- **Security**: HTTP-only cookies with secure flags and CSRF protection

### Core Features Architecture
- **Dashboard**: Centralized overview with upcoming events, latest notes, featured mentors, and opportunities
- **Events Management**: Calendar view with filtering by categories (IEEE, ACM, Departmental, Clubs)
- **Notes System**: Department and semester-based organization with course-specific categorization
- **Mentorship Platform**: Senior-student connection system with skill and expertise matching
- **Resource Hub**: GATE preparation materials, NPTEL courses, and learning resources
- **Project Showcase**: IFP (Industry Focused Projects) with department and specialization filtering
- **Discussion Channels**: Platform-specific communication channels (WhatsApp, Discord, Telegram)

### UI/UX Design Patterns
- **Mobile-First**: Responsive design optimized for mobile devices with desktop adaptability
- **Sidebar Navigation**: Collapsible sidebar with hierarchical menu structure
- **Component Library**: Consistent design system using Radix UI primitives
- **Loading States**: Skeleton loaders and proper loading indicators for enhanced user experience
- **Error Handling**: User-friendly error messages with automatic retry mechanisms

### Data Flow Architecture
- **Client-Server**: RESTful API communication with JSON payloads
- **Caching Strategy**: React Query for intelligent client-side caching and background updates
- **Real-time Updates**: Query invalidation for immediate data synchronization
- **Optimistic Updates**: Client-side updates with server synchronization for responsive interactions

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling
- **Drizzle ORM**: Type-safe database operations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication & Security
- **Replit Auth**: OIDC-based authentication system integrated with the platform
- **OpenID Client**: OIDC client implementation for secure authentication flows
- **Passport.js**: Authentication middleware for Express applications

### Frontend Libraries
- **React Query**: Server state management and caching solution
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Wouter**: Lightweight routing library for React applications
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for JavaScript
- **PostCSS**: CSS processing with autoprefixer support
- **ESBuild**: Fast JavaScript bundler for production builds

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility for dynamic styling
- **zod**: Schema validation for type-safe data handling
- **react-hook-form**: Performant form library with validation support

### External Services Integration
- **Font APIs**: Google Fonts integration for typography (DM Sans, Fira Code, Geist Mono)
- **CDN Resources**: External font and asset delivery for optimized loading
- **Platform Links**: Integration with educational platforms (NPTEL, GATE resources, learning platforms)