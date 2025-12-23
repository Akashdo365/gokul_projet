import { db } from "./db";
import { 
  users, scanLogs, emergencyLogs,
  type User, type InsertUser, 
  type ScanLog, 
  type EmergencyLog 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(): Promise<User | undefined>;
  updateUser(user: InsertUser): Promise<User>;
  createScanLog(type: string, result: string, confidence?: number): Promise<ScanLog>;
  getScanLogs(): Promise<ScanLog[]>;
  createEmergencyLog(locationLat?: string, locationLng?: string): Promise<EmergencyLog>;
}

export class DatabaseStorage implements IStorage {
  // Single user system for MVP, we just get the first user or create a default one
  async getUser(): Promise<User | undefined> {
    const [user] = await db.select().from(users).limit(1);
    return user;
  }

  async updateUser(insertUser: InsertUser): Promise<User> {
    const existing = await this.getUser();
    if (existing) {
      const [updated] = await db
        .update(users)
        .set(insertUser)
        .where(eq(users.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(users).values(insertUser).returning();
      return created;
    }
  }

  async createScanLog(type: string, result: string, confidence?: number): Promise<ScanLog> {
    const [log] = await db
      .insert(scanLogs)
      .values({ 
        type, 
        result, 
        confidence: confidence || 0 
      })
      .returning();
    return log;
  }

  async getScanLogs(): Promise<ScanLog[]> {
    return db
      .select()
      .from(scanLogs)
      .orderBy(desc(scanLogs.timestamp))
      .limit(50);
  }

  async createEmergencyLog(locationLat?: string, locationLng?: string): Promise<EmergencyLog> {
    const [log] = await db
      .insert(emergencyLogs)
      .values({ 
        locationLat, 
        locationLng,
        status: "triggered"
      })
      .returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
