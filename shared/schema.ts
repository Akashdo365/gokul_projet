import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  emergencyContact: text("emergency_contact").notNull(),
  alternateContact: text("alternate_contact"),
  language: text("language").default("en"),
  preferences: jsonb("preferences").$type<{
    highContrast?: boolean;
    voiceSpeed?: number;
  }>(),
});

export const scanLogs = pgTable("scan_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'object', 'text', 'currency'
  result: text("result").notNull(),
  confidence: integer("confidence"), // 0-100
  timestamp: timestamp("timestamp").defaultNow(),
});

export const emergencyLogs = pgTable("emergency_logs", {
  id: serial("id").primaryKey(),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").default("triggered"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertScanLogSchema = createInsertSchema(scanLogs).omit({ id: true, timestamp: true });
export const insertEmergencyLogSchema = createInsertSchema(emergencyLogs).omit({ id: true, timestamp: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;
export type EmergencyLog = typeof emergencyLogs.$inferSelect;

export type DetectObjectResponse = {
  objects: Array<{ name: string; confidence: number }>;
};

export type CurrencyResponse = {
  value: number;
  currency: string;
};

export type TextResponse = {
  text: string;
};

// Export Chat models from integration
export * from "./models/chat";
