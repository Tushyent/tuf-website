
Video link: https://drive.google.com/drive/folders/1ZGR95ervdLx0KdruruxNhwPdJARPx6lh?usp=sharing

Contact: tushyent2410053@ssn.edu.in , 9840611793
for any queries

# 🚀 TUF - Take U Forward

**Empowering Freshmen Through Seniors-Led Digital Support**

> A comprehensive digital platform designed to enhance campus life at SSN College by centralizing mentorship, academic resources, and opportunities.


## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Future Roadmap](#future-roadmap)
- [License](#license)

## 🎯 Problem Statement

**Theme: Enhancing Campus Life**

Freshmen entering SSN face significant challenges:
- **Confusion and Disconnection** despite abundant campus resources
- **Informal Mentorship** lacking structure and accessibility  
- **Scattered Academic Materials** across multiple drives and chats
- **Poor Communication** of vital opportunities (IFPs, NPTEL, internships, hackathons)
- **Environmental Waste** from repeated paper printing
- **Unequal Access** to guidance and opportunities

**Current Gap:** No unified, trusted digital platform integrating mentorship, academic repositories, and campus opportunity aggregation.

## 💡 Our Solution

**TUF (Take U Forward)** is a comprehensive web platform that transforms campus life by providing:
- Structured peer-to-peer mentorship
- Centralized academic resource repository
- Real-time campus opportunity aggregation
- Sustainable, paperless learning environment

## ✨ Features

### 🏠 **Dashboard**
- Personalized student overview
- Quick access to recent activities and announcements

### 📅 **Events Calendar** 
- Integrated calendar with Google Calendar sync
- Real-time updates for all campus events

### 🏛️ **Clubs & Societies**
- Complete directory of campus organizations
- Easy access to club information and contact details

### 🎉 **Events of SSN**
- Instagram integration for event updates
- Organized by categories:
  - **IEEE Societies** (Photonics, PELS, PES, WIE, etc.)
  - **ACM Chapters** (SSN ACM, SSN ACM-W)
  - **Department Clubs** (AIT, ACE, ABE, AME, etc.)

### 📚 **Academic Resources**
- **Notes Repository**: DSA, OS, OOPS, DSP, Electrical Machines, Engineering Graphics
- **GATE Preparation**: Comprehensive topic-wise resources
- Direct links to curated online content

### 🔬 **Projects (IFP)**
- Database of senior IFPs by subject/specialization
- Advanced sorting and filtering options
- Direct contact with project mentors

### 💬 **Discussions**
- Community forum for academic and non-academic discussions
- Peer-to-peer knowledge sharing

### 🎓 **Where to Learn**
Direct access to top learning platforms:
- GeeksforGeeks, GATE Smashers
- W3Schools, FreeCodeCamp
- TechWithTim, CodeWithMosh
- Physics Wallah, Unacademy
- Take U Forward (DSA), Jenny's Lectures

### 👥 **Chat with Seniors**
- **Structured Mentorship** by department and interests
- **Category-based Support**: Placements, Hackathons, Academics
- **Multiple Contact Options**: WhatsApp, Email, Direct Chat
- **Area of Interest Matching**

### 📖 **NPTEL/Online Courses**
- Curated course recommendations
- Progress tracking and certification guidance

### 💼 **Placement Tips**
- Resume building guides
- Interview preparation resources
- Industry insights from alumni

### 🔧 **C2C (Campus-to-Career) Toolkit**
- **Internship Updates**: Live opportunity feed
- **Job Vacancies**: Real-time postings
- **Recommendations**: Personalized career guidance
- **C2C Events**: Career-focused workshops and seminars

### 🔗 **Easy Access to Links**
Centralized hub for:
- All SSN club social media pages
- Official SSN website and social handles
- **Instincts**, **Invente**, **SSN Alumni Association**
- Essential student portals and resources

### 👤 **My Profile**
- Comprehensive profile management
- Privacy settings and preferences
- Academic progress tracking

## 🛠️ Tech Stack

### **Frontend**
- **React** with **TypeScript** for type safety
- **Tailwind CSS** for responsive styling
- **shadcn/ui** component library
- **Vite** for fast development and building

### **Backend**
- **Node.js** with **TypeScript**
- **Express.js** for API routes
- **SQLite** with **Drizzle ORM** for database management

### **Authentication & Deployment**
- **Replit Authentication** (scalable to SSN SSO)
- **Replit** for rapid prototyping and deployment
- Ready for migration to **Firebase** or **AWS**

### **Additional Tools**
- **React Query** for efficient data fetching
- **React Hook Form** for form management
- **Lucide React** for consistent iconography

## 📁 Project Structure

```
TUF/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Application entry point
│   └── index.html
├── server/                # Backend Node.js application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── db.ts             # Database configuration
│   ├── replitAuth.ts     # Authentication logic
│   └── storage.ts        # File storage utilities
├── shared/               # Shared types and schemas
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Replit account** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tushyent/tuf-website.git
   cd tuf-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with necessary configurations
   cp .env.example .env
   ```

4. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Access the application** at `http://localhost:5173`
2. **Sign up** using your SSN email credentials
3. **Complete your profile** with department and interests
4. **Explore features** through the intuitive sidebar navigation
5. **Connect with seniors** for mentorship and guidance
6. **Access academic resources** organized by department and semester

## 🤝 Contributing

We welcome contributions from the SSN community!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🗺️ Future Roadmap

### Phase 1: MVP Enhancement
- [ ] Advanced search functionality
- [ ] Push notifications for events
- [ ] Mobile responsiveness improvements
- [ ] Integration with SSN official APIs

### Phase 2: Advanced Features
- [ ] AI-powered mentor matching
- [ ] Real-time chat system
- [ ] Advanced analytics dashboard
- [ ] Mobile application (Flutter)

### Phase 3: Scalability
- [ ] Multi-college deployment
- [ ] Advanced authentication (SSO)
- [ ] Cloud infrastructure migration
- [ ] Performance optimization

### Phase 4: Intelligence
- [ ] Personalized recommendations
- [ ] Predictive analytics for career paths
- [ ] Automated resource curation
- [ ] Integration with academic management systems

## 🌍 Impact & Vision

### **Expected Impact**

**For Students:**
- Faster campus onboarding
- Equal access to mentorship opportunities  
- Better awareness of academic and career opportunities
- Reduced confusion and improved academic performance

**For Institution:**
- Improved student engagement metrics
- Reduced administrative queries
- Better visibility of student activities
- Enhanced alumni-student connectivity

**For Sustainability:**
- Paperless, digital-first culture
- Measurable reduction in printing waste
- Environmental consciousness among students

### **Vision Statement**
*To create an inclusive, sustainable, and empowering digital ecosystem that ensures no student feels lost during their academic journey, fostering a culture of peer support and continuous learning.*

## 📊 Analytics & Metrics

- **User Engagement**: Track active users and feature utilization
- **Resource Access**: Monitor most accessed materials and resources
- **Mentorship Success**: Measure mentor-mentee interaction quality
- **Event Participation**: Track event attendance through platform
- **Academic Performance**: Correlate platform usage with academic outcomes

## 🏆 Achievements

- **Solo 4-Hour Hackathon MVP**: Successfully developed during intense hackathon
- **Comprehensive Feature Set**: 15+ major features implemented
- **Scalable Architecture**: Designed for future expansion
- **User-Centric Design**: Intuitive interface based on student needs

## 📞 Contact & Support

**Project Maintainer:** [Tushyent N P]
- **Email:** [tushyent2410053@ssn.edu.in]
- **LinkedIn:** [Tushyent N P](https://www.linkedin.com/in/tushyent-n-p/)
- **GitHub:** [Tushyent](https://github.com/Tushyent)

**For SSN-specific queries:**
- **Campus Support:** Contact through official SSN channels
- **Technical Issues:** Create an issue in this repository
- **Feature Requests:** Use GitHub discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **SSN College of Engineering** for inspiring this solution
- **Senior students and mentors** who provided insights and guidance  
- **Open source community** for the amazing tools and libraries
- **Replit** for providing an excellent development and deployment platform

---

<div align="center">

**Made with ❤️ for SSN Students**

*Empowering every freshman with equitable access to guidance, structured academic resources, and sustainable learning practices.*


</div>
