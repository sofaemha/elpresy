// filepath: src/lib/db/schema.ts
import { pgTable, text, timestamp, boolean, uuid, real, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image:         text("image"),
  role:          text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt:     timestamp("createdAt").notNull().defaultNow(),
  updatedAt:     timestamp("updatedAt").notNull().defaultNow(),
});

export const sessions = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => users.id)
});

export const accounts = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => users.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull()
});

export const verifications = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt")
});

export const predictions = pgTable("predictions", {
  id:               uuid("id").primaryKey().defaultRandom(),
  userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amperePerCycle:   real("ampere_per_cycle").notNull(),
  dailyUsageHours:  real("daily_usage_hours").notNull(),
  predictionPeriod: integer("prediction_period").notNull(),
  resultLower:      real("result_lower").notNull(),
  resultUpper:      real("result_upper").notNull(),
  totalAmpere:      real("total_ampere").notNull().default(0),
  chartData:        jsonb("chart_data"),  // Array<{ day: number; ampere: number }>
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export type NewPrediction = typeof predictions.$inferInsert;
export type Prediction    = typeof predictions.$inferSelect;
