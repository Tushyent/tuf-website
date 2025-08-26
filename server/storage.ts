import {
  users,
  mentors,
  notes,
  events,
  clubs,
  opportunities,
  projectsIfp,
  links,
  discussionsChannels,
  type User,
  type UpsertUser,
  type Mentor,
  type InsertMentor,
  type Note,
  type InsertNote,
  type Event,
  type InsertEvent,
  type Club,
  type InsertClub,
  type Opportunity,
  type InsertOpportunity,
  type ProjectIfp,
  type InsertProjectIfp,
  type Link,
  type InsertLink,
  type DiscussionChannel,
  type InsertDiscussionChannel,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Mentor operations
  getMentors(filters?: { category?: string; department?: string; skills?: string[] }): Promise<(Mentor & { user: User })[]>;
  getMentorByUserId(userId: string): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(id: string, mentor: Partial<InsertMentor>): Promise<Mentor>;
  
  // Notes operations
  getNotes(filters?: { dept?: string; semester?: number; courseCode?: string; search?: string }): Promise<(Note & { uploader: User })[]>;
  createNote(note: InsertNote): Promise<Note>;
  incrementNoteDownloads(id: string): Promise<void>;
  
  // Events operations
  getEvents(filters?: { tags?: string[]; upcoming?: boolean }): Promise<(Event & { creator: User })[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Clubs operations
  getClubs(filters?: { category?: string }): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  
  // Opportunities operations
  getOpportunities(filters?: { type?: string; tags?: string[] }): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  
  // Projects IFP operations
  getProjectsIfp(filters?: { dept?: string; area?: string }): Promise<ProjectIfp[]>;
  createProjectIfp(project: InsertProjectIfp): Promise<ProjectIfp>;
  
  // Links operations
  getLinks(filters?: { group?: string; search?: string }): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  
  // Discussion channels operations
  getDiscussionChannels(filters?: { platform?: string; topicTags?: string[] }): Promise<DiscussionChannel[]>;
  createDiscussionChannel(channel: InsertDiscussionChannel): Promise<DiscussionChannel>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Mentor operations
  async getMentors(filters?: { category?: string; department?: string; skills?: string[] }): Promise<(Mentor & { user: User })[]> {
    let query = db
      .select()
      .from(mentors)
      .innerJoin(users, eq(mentors.userId, users.id))
      .where(eq(mentors.isAvailable, true));

    if (filters?.department) {
      query = query.where(eq(users.department, filters.department));
    }

    const results = await query;
    return results.map(result => ({
      ...result.mentors,
      user: result.users,
    }));
  }

  async getMentorByUserId(userId: string): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, userId));
    return mentor;
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const [newMentor] = await db.insert(mentors).values(mentor).returning();
    return newMentor;
  }

  async updateMentor(id: string, mentor: Partial<InsertMentor>): Promise<Mentor> {
    const [updatedMentor] = await db
      .update(mentors)
      .set(mentor)
      .where(eq(mentors.id, id))
      .returning();
    return updatedMentor;
  }

  // Notes operations
  async getNotes(filters?: { dept?: string; semester?: number; courseCode?: string; search?: string }): Promise<(Note & { uploader: User })[]> {
    let query = db
      .select()
      .from(notes)
      .innerJoin(users, eq(notes.uploadedBy, users.id))
      .orderBy(desc(notes.createdAt));

    const conditions = [];
    if (filters?.dept) {
      conditions.push(eq(notes.dept, filters.dept));
    }
    if (filters?.semester) {
      conditions.push(eq(notes.semester, filters.semester));
    }
    if (filters?.courseCode) {
      conditions.push(eq(notes.courseCode, filters.courseCode));
    }
    if (filters?.search) {
      conditions.push(ilike(notes.title, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return results.map(result => ({
      ...result.notes,
      uploader: result.users,
    }));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async incrementNoteDownloads(id: string): Promise<void> {
    await db
      .update(notes)
      .set({ downloads: sql`${notes.downloads} + 1` })
      .where(eq(notes.id, id));
  }

  // Events operations
  async getEvents(filters?: { tags?: string[]; upcoming?: boolean }): Promise<(Event & { creator: User })[]> {
    let query = db
      .select()
      .from(events)
      .innerJoin(users, eq(events.createdBy, users.id))
      .orderBy(events.date);

    const conditions = [];
    if (filters?.upcoming) {
      conditions.push(sql`${events.date} >= ${new Date()}`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return results.map(result => ({
      ...result.events,
      creator: result.users,
    }));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Clubs operations
  async getClubs(filters?: { category?: string }): Promise<Club[]> {
    let query = db.select().from(clubs).orderBy(clubs.name);

    if (filters?.category) {
      query = query.where(eq(clubs.category, filters.category));
    }

    return await query;
  }

  async createClub(club: InsertClub): Promise<Club> {
    const [newClub] = await db.insert(clubs).values(club).returning();
    return newClub;
  }

  // Opportunities operations
  async getOpportunities(filters?: { type?: string; tags?: string[] }): Promise<Opportunity[]> {
    let query = db.select().from(opportunities).orderBy(desc(opportunities.createdAt));

    if (filters?.type) {
      query = query.where(eq(opportunities.type, filters.type));
    }

    return await query;
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const [newOpportunity] = await db.insert(opportunities).values(opportunity).returning();
    return newOpportunity;
  }

  // Projects IFP operations
  async getProjectsIfp(filters?: { dept?: string; area?: string }): Promise<ProjectIfp[]> {
    let query = db.select().from(projectsIfp).orderBy(desc(projectsIfp.year));

    const conditions = [];
    if (filters?.dept) {
      conditions.push(eq(projectsIfp.dept, filters.dept));
    }
    if (filters?.area) {
      conditions.push(eq(projectsIfp.area, filters.area));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async createProjectIfp(project: InsertProjectIfp): Promise<ProjectIfp> {
    const [newProject] = await db.insert(projectsIfp).values(project).returning();
    return newProject;
  }

  // Links operations
  async getLinks(filters?: { group?: string; search?: string }): Promise<Link[]> {
    let query = db.select().from(links).orderBy(links.group, links.label);

    const conditions = [];
    if (filters?.group) {
      conditions.push(eq(links.group, filters.group));
    }
    if (filters?.search) {
      conditions.push(ilike(links.label, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  }

  async createLink(link: InsertLink): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  // Discussion channels operations
  async getDiscussionChannels(filters?: { platform?: string; topicTags?: string[] }): Promise<DiscussionChannel[]> {
    let query = db.select().from(discussionsChannels).orderBy(discussionsChannels.label);

    if (filters?.platform) {
      query = query.where(eq(discussionsChannels.platform, filters.platform));
    }

    return await query;
  }

  async createDiscussionChannel(channel: InsertDiscussionChannel): Promise<DiscussionChannel> {
    const [newChannel] = await db.insert(discussionsChannels).values(channel).returning();
    return newChannel;
  }
}

export const storage = new DatabaseStorage();
