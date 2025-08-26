import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  uuid,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Additional TUF-specific fields
  year: integer("year"),
  program: varchar("program"), // BE/BTech, ME/MTech
  department: varchar("department"),
  intro: text("intro"),
  skills: text("skills").array(),
  phone: varchar("phone"),
  role: varchar("role").default("student"), // student, senior, admin
  socials: jsonb("socials"), // {linkedin, github, instagram}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mentors = pgTable("mentors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  interests: text("interests").array(),
  availability: text("availability"),
  contactWhatsapp: varchar("contact_whatsapp"),
  contactEmail: varchar("contact_email"),
  rating: integer("rating").default(0),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  dept: varchar("dept").notNull(),
  semester: integer("semester").notNull(),
  courseCode: varchar("course_code").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  fileUrl: varchar("file_url").notNull(),
  pages: integer("pages").default(0),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  description: text("description"),
  organizer: varchar("organizer").notNull(),
  date: timestamp("date").notNull(),
  location: varchar("location"),
  link: varchar("link"),
  tags: text("tags").array(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // IEEE, ACM, Dept, Cultural
  description: text("description"),
  instagram: varchar("instagram"),
  email: varchar("email"),
  meetingTime: varchar("meeting_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type").notNull(), // IFP, Internship, NPTEL, Hackathon, Cert
  title: varchar("title").notNull(),
  description: text("description"),
  deadline: date("deadline"),
  link: varchar("link"),
  contact: varchar("contact"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectsIfp = pgTable("projects_ifp", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  dept: varchar("dept").notNull(),
  area: varchar("area").notNull(),
  brief: text("brief"),
  guideName: varchar("guide_name").notNull(),
  contact: varchar("contact").notNull(),
  year: integer("year").notNull(),
  link: varchar("link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label").notNull(),
  url: varchar("url").notNull(),
  group: varchar("group").notNull(), // SSN, IEEE, ACM, Dept, Alumni, Social, Flagship
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discussionsChannels = pgTable("discussions_channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label").notNull(),
  platform: varchar("platform").notNull(), // WhatsApp, Discord, Telegram
  url: varchar("url").notNull(),
  topicTags: text("topic_tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  mentorProfile: many(mentors),
  uploadedNotes: many(notes),
  createdEvents: many(events),
}));

export const mentorsRelations = relations(mentors, ({ one }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  uploader: one(users, {
    fields: [notes.uploadedBy],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertMentor = typeof mentors.$inferInsert;
export type Mentor = typeof mentors.$inferSelect;

export type InsertNote = typeof notes.$inferInsert;
export type Note = typeof notes.$inferSelect;

export type InsertEvent = typeof events.$inferInsert;
export type Event = typeof events.$inferSelect;

export type InsertClub = typeof clubs.$inferInsert;
export type Club = typeof clubs.$inferSelect;

export type InsertOpportunity = typeof opportunities.$inferInsert;
export type Opportunity = typeof opportunities.$inferSelect;

export type InsertProjectIfp = typeof projectsIfp.$inferInsert;
export type ProjectIfp = typeof projectsIfp.$inferSelect;

export type InsertLink = typeof links.$inferInsert;
export type Link = typeof links.$inferSelect;

export type InsertDiscussionChannel = typeof discussionsChannels.$inferInsert;
export type DiscussionChannel = typeof discussionsChannels.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  createdAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  downloads: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
});

export const insertProjectIfpSchema = createInsertSchema(projectsIfp).omit({
  id: true,
  createdAt: true,
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  createdAt: true,
});

export const insertDiscussionChannelSchema = createInsertSchema(discussionsChannels).omit({
  id: true,
  createdAt: true,
});
