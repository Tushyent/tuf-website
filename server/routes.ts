import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertNoteSchema,
  insertEventSchema,
  insertMentorSchema,
  insertClubSchema,
  insertOpportunitySchema,
  insertProjectIfpSchema,
  insertLinkSchema,
  insertDiscussionChannelSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      // Update user data
      const updatedUser = await storage.upsertUser({
        id: userId,
        ...updates,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Mentor routes
  app.get('/api/mentors', async (req, res) => {
    try {
      const { category, department, skills } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (department) filters.department = department as string;
      if (skills) filters.skills = (skills as string).split(',');
      
      const mentors = await storage.getMentors(filters);
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.post('/api/mentors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const mentorData = insertMentorSchema.parse({
        ...req.body,
        userId,
      });
      
      const mentor = await storage.createMentor(mentorData);
      res.json(mentor);
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(500).json({ message: "Failed to create mentor profile" });
    }
  });

  // Notes routes
  app.get('/api/notes', async (req, res) => {
    try {
      const { dept, semester, courseCode, search } = req.query;
      const filters: any = {};
      
      if (dept) filters.dept = dept as string;
      if (semester) filters.semester = parseInt(semester as string);
      if (courseCode) filters.courseCode = courseCode as string;
      if (search) filters.search = search as string;
      
      const notes = await storage.getNotes(filters);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteData = insertNoteSchema.parse({
        ...req.body,
        uploadedBy: userId,
      });
      
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to upload note" });
    }
  });

  app.post('/api/notes/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementNoteDownloads(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing download:", error);
      res.status(500).json({ message: "Failed to record download" });
    }
  });

  // Events routes
  app.get('/api/events', async (req, res) => {
    try {
      const { tags, upcoming } = req.query;
      const filters: any = {};
      
      if (tags) filters.tags = (tags as string).split(',');
      if (upcoming) filters.upcoming = upcoming === 'true';
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Clubs routes
  app.get('/api/clubs', async (req, res) => {
    try {
      const { category } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      
      const clubs = await storage.getClubs(filters);
      res.json(clubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ message: "Failed to fetch clubs" });
    }
  });

  app.post('/api/clubs', isAuthenticated, async (req: any, res) => {
    try {
      const clubData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(clubData);
      res.json(club);
    } catch (error) {
      console.error("Error creating club:", error);
      res.status(500).json({ message: "Failed to create club" });
    }
  });

  // Opportunities routes
  app.get('/api/opportunities', async (req, res) => {
    try {
      const { type, tags } = req.query;
      const filters: any = {};
      
      if (type) filters.type = type as string;
      if (tags) filters.tags = (tags as string).split(',');
      
      const opportunities = await storage.getOpportunities(filters);
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  app.post('/api/opportunities', isAuthenticated, async (req: any, res) => {
    try {
      const opportunityData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity(opportunityData);
      res.json(opportunity);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      res.status(500).json({ message: "Failed to create opportunity" });
    }
  });

  // Projects IFP routes
  app.get('/api/projects-ifp', async (req, res) => {
    try {
      const { dept, area } = req.query;
      const filters: any = {};
      
      if (dept) filters.dept = dept as string;
      if (area) filters.area = area as string;
      
      const projects = await storage.getProjectsIfp(filters);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects-ifp', isAuthenticated, async (req: any, res) => {
    try {
      const projectData = insertProjectIfpSchema.parse(req.body);
      const project = await storage.createProjectIfp(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Links routes
  app.get('/api/links', async (req, res) => {
    try {
      const { group, search } = req.query;
      const filters: any = {};
      
      if (group) filters.group = group as string;
      if (search) filters.search = search as string;
      
      const links = await storage.getLinks(filters);
      res.json(links);
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  app.post('/api/links', isAuthenticated, async (req: any, res) => {
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const link = await storage.createLink(linkData);
      res.json(link);
    } catch (error) {
      console.error("Error creating link:", error);
      res.status(500).json({ message: "Failed to create link" });
    }
  });

  // Discussion channels routes
  app.get('/api/discussions', async (req, res) => {
    try {
      const { platform, topicTags } = req.query;
      const filters: any = {};
      
      if (platform) filters.platform = platform as string;
      if (topicTags) filters.topicTags = (topicTags as string).split(',');
      
      const channels = await storage.getDiscussionChannels(filters);
      res.json(channels);
    } catch (error) {
      console.error("Error fetching discussion channels:", error);
      res.status(500).json({ message: "Failed to fetch discussion channels" });
    }
  });

  app.post('/api/discussions', isAuthenticated, async (req: any, res) => {
    try {
      const channelData = insertDiscussionChannelSchema.parse(req.body);
      const channel = await storage.createDiscussionChannel(channelData);
      res.json(channel);
    } catch (error) {
      console.error("Error creating discussion channel:", error);
      res.status(500).json({ message: "Failed to create discussion channel" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
