# PRD.md — Product Requirements Document
## ELPRESY: Electrical Predictions System

> **Document Status:** v2.3 — Fully Resolved (Next.js 16 updated)
> **Architecture:** Option B — Neon + Better Auth (locked)
> **Last Updated:** May 2026 (aligned to Next.js 16.2.4)
> **Authority:** This is the single source of truth for all product, feature, ML, and architecture decisions on ELPRESY. All development and code generation must conform to rules stated here. All items are resolved and must be treated as hard constraints. Do not invent, assume, or hallucinate values for any entry in this document.

***

## 1. Executive Summary

ELPRESY (Electrical Predictions System) is a bilingual (Indonesian/English) web application that enables building managers and facility teams to forecast daily AC ampere usage over a defined prediction period. The prediction engine runs entirely within the Next.js environment using a CART (Classification and Regression Tree) regression model via the `ml-cart` npm library — no external ML server is required.

The product is an Indonesian undergraduate thesis (Skripsi) that must simultaneously serve as a polished production web application and an academically defensible ML system with documented RMSE, MAE, and R² accuracy metrics.

**Architecture:** Neon (serverless PostgreSQL) + Better Auth + Drizzle ORM, deployed on Vercel.

***

## 2. Problem Statement

### 2.1 Background

Air conditioning systems are one of the largest variable operating costs in commercial and institutional buildings in Indonesia. Without short-term forecasting, facility teams cannot:

- Anticipate peak ampere load periods before they occur
- Optimize AC scheduling to reduce unnecessary runtime and energy cost
- Provide defensible energy projections to building operators or management
- Maintain consistent accountability over consumption across reporting cycles

Manual estimation — spreadsheets, rule-of-thumb — is inaccurate, inconsistent, and unscalable. Industrial-grade Building Management Systems are prohibitively expensive for the mid-scale institutions this product targets.

### 2.2 What ELPRESY Provides

- A browser-native CART regression forecasting tool requiring zero installation
- Forecasts expressed as a daily time-series chart and a numerical confidence range
- Persistent per-user prediction history accessible from an authenticated dashboard
- Administrative oversight of all users and prediction records
- Full bilingual support (Indonesian and English)

### 2.3 Primary Impact

Building managers and facility teams gain a structured, accessible forecasting tool that replaces manual estimation, enabling better energy planning and accountability.

***

## 3. Goals and Objectives

### 3.1 Product Goals

| ID | Goal | Measurable Outcome |
|----|------|--------------------|
| G1 | Accurate AC ampere forecasting | R² ≥ 0.80 on held-out test set |
| G2 | Production-ready prediction form | Accepts inputs, runs model, returns chart + range without error |
| G3 | User history dashboard | Authenticated users view past submissions and trend charts |
| G4 | Secure authentication | Register, login, logout work; routes protected by middleware |
| G5 | Admin oversight panel | Admin views all users and all prediction records |
| G6 | Full bilingual UI | All strings in Indonesian and English, switchable at runtime |
| G7 | Academic thesis approval | System passes defense and receives supervisor/examiner sign-off |

### 3.2 Non-Goals (Hard Out-of-Scope)

- Real-time sensor or IoT integration
- Mobile native application
- Multi-tenant or multi-organization management
- Cost estimation in IDR
- Automatic model retraining from user-submitted data
- Public REST API
- Email notifications or alerts
- Light mode (dark-mode exclusive, permanent)
- Chart/result export (PNG, PDF, CSV)

***

## 4. Target Users

### 4.1 User Segments

| Segment | Role | Primary Need |
|---------|------|--------------|
| Building Manager / Facility Team | Primary product user | Forecast AC ampere usage for planning and cost control |
| Academic Evaluator / Thesis Supervisor | Secondary evaluator | Assess ML quality, accuracy, and system completeness |

### 4.2 User Personas

**Persona A — Facility Manager (Andi, 38)**
Manages AC across 3 floors of an office building. Non-technical; needs quick, trustworthy forecasts before submitting monthly energy reports. Values clarity and minimal friction.

**Persona B — Academic Evaluator (Dr. Siti, 52)**
University lecturer evaluating the thesis. Technically proficient; scrutinizes ML methodology, accuracy metrics, and system architecture. Expects a complete and polished product.

### 4.3 Language Policy

- Indonesian is the primary language for the academic and deployment context
- English is supported for technical legibility
- All UI strings must use `next-intl` and be switchable at runtime via the navigation locale toggle

***

## 5. Architecture — Option B: Neon + Better Auth (Locked)

This option is locked. Do not mix elements from other options.

### 5.1 Full Stack

| Layer | Technology | Package |
|-------|-----------|---------|
| Framework | Next.js 16 App Router (v16.2.4) | `next` |
| Runtime | Node.js ≥ 20.9.0 (LTS) | — |
| React | React 19.2 (bundled with Next.js 16) | `react`, `react-dom` |
| Language | TypeScript ≥ 5.1 strict | — |
| Bundler | Turbopack (default in Next.js 16) | built-in |
| Styling | Tailwind CSS v4 + shadcn/ui + Base UI | `tailwindcss`, `@base-ui/react` |
| i18n | next-intl | `next-intl` |
| ML | CART Regression | `ml-cart` v2.1.1 |
| Charts | Recharts | `recharts` |
| Auth | Better Auth | `better-auth` |
| Database | Neon Serverless PostgreSQL | connection via `pg` driver (see §5.3) |
| ORM | Drizzle ORM | `drizzle-orm`, `drizzle-kit` |
| DB driver | pg (node-postgres) | `pg`, `@types/pg` |
| Deployment | Vercel | — |
| Package manager | pnpm | — |

### 5.2 Environment Variables

```env
# .env.local

BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

### 5.3 Critical Driver Compatibility Note

`@neondatabase/serverless` v1.0.0+ requires tagged-template SQL syntax that is incompatible with the Better Auth Drizzle adapter. Use the standard `pg` driver instead.

```typescript
// filepath: src/lib/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

**Do not use `@neondatabase/serverless` with Better Auth.**

### 5.4 Better Auth Setup

```typescript
// filepath: src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
});
```

```typescript
// filepath: src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

```typescript
// filepath: src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 5.5 Route Protection Proxy

> **Next.js 16 Breaking Change:** `middleware.ts` is deprecated and renamed to `proxy.ts`. The exported function must also be renamed from `middleware` to `proxy`. The `edge` runtime is **not** supported in `proxy` — it runs Node.js only. If you need the `edge` runtime, keep the old `middleware.ts` file instead.

```typescript
// filepath: src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/predict"];
const adminRoutes = ["/admin"];

export async function proxy(req: NextRequest) {
  const session = await getSessionFromRequest(req, auth);
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => pathname.includes(r));
  const isAdmin = adminRoutes.some((r) => pathname.includes(r));

  if ((isProtected || isAdmin) && !session)
    return NextResponse.redirect(new URL("/login", req.url));
  if (isAdmin && session?.user.role !== "admin")
    return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 5.6 Schema Generation

```bash
npx @better-auth/cli generate   # generates auth schema into src/lib/db/auth-schema.ts
pnpm drizzle-kit push           # push merged schema to Neon
```

***

## 6. Database Schema

### 6.1 Better Auth Tables (Auto-generated)

Managed by Better Auth CLI. Do not manually edit. Tables: `users`, `sessions`, `accounts`, `verifications`. The `role` column must be added as a custom field (§6.2).

### 6.2 Extended Users Table

```typescript
// filepath: src/lib/db/schema.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

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
```

### 6.3 Predictions Table

```typescript
// filepath: src/lib/db/schema.ts (continued)
import { uuid, real, integer, jsonb } from "drizzle-orm/pg-core";

export const predictions = pgTable("predictions", {
  id:               uuid("id").primaryKey().defaultRandom(),
  userId:           text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amperePerCycle:   real("ampere_per_cycle").notNull(),
  dailyUsageHours:  real("daily_usage_hours").notNull(),
  predictionPeriod: integer("prediction_period").notNull(),
  resultLower:      real("result_lower").notNull(),
  resultUpper:      real("result_upper").notNull(),
  chartData:        jsonb("chart_data"),  // Array<{ day: number; ampere: number }>
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export type NewPrediction = typeof predictions.$inferInsert;
export type Prediction    = typeof predictions.$inferSelect;
```

### 6.4 Drizzle Config

```typescript
// filepath: drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  out:    "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

### 6.5 Admin Seed Script

```typescript
// filepath: src/lib/db/seed-admin.ts
// Run once: pnpm tsx src/lib/db/seed-admin.ts
import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const adminEmail = "admin@elpresy.com"; // change before running
  await db.update(users).set({ role: "admin" }).where(eq(users.email, adminEmail));
  console.log(`Admin role assigned to: ${adminEmail}`);
  process.exit(0);
}
seedAdmin();
```

***

## 7. ML Model Specification

### 7.1 Algorithm

| Property | Value |
|----------|-------|
| Algorithm | CART — Classification and Regression Tree |
| Type | Regression |
| Library | `ml-cart` v2.1.1 |
| Class | `DecisionTreeRegression` |
| Runtime | Next.js API route (`/api/predict`) |

### 7.2 Mathematical Foundation

CART minimizes at each node:

\[J(D, \theta) = \frac{n_\text{left}}{n} \cdot \text{MSE}_\text{left} + \frac{n_\text{right}}{n} \cdot \text{MSE}_\text{right}\]

Each leaf returns:

\[\hat{y} = \frac{1}{|D_\text{leaf}|} \sum_{i \in D_\text{leaf}} y_i\]

### 7.3 Hyperparameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| `gainFunction` | `"regression"` | MSE-based splitting |
| `splitFunction` | `"mean"` | Threshold = mean of adjacent sorted values |
| `maxDepth` | `10` | Reduce if overfitting; increase if underfitting |
| `minNumSamples` | `5` | Prevents leaves with too few training samples |

### 7.4 Feature Matrix

| Column | Feature | Type | Notes |
|--------|---------|------|-------|
| 0 | Ampere Per Cycle | `float` | Held constant across all time steps |
| 1 | Daily Usage Hours | `float` | Held constant across all time steps |
| 2 | Time Step Index | `integer` | 0-indexed: 0 = Day 1, … N−1 = Day N |

One input row is generated per day in the prediction period. Only column 2 varies per row.

### 7.5 Prediction Utility

```typescript
// filepath: src/lib/ml/predict.ts
import { DecisionTreeRegression as DTR } from "ml-cart";
import modelJSON from "./model.json";

export interface ChartDataPoint { day: number; ampere: number; }
export interface PredictionResult {
  chartData: ChartDataPoint[];
  resultLower: number;
  resultUpper: number;
}

const reg = DTR.load(modelJSON);

export function runPrediction(
  amperePerCycle: number,
  dailyUsageHours: number,
  predictionPeriod: number
): PredictionResult {
  const inputMatrix = Array.from({ length: predictionPeriod }, (_, i) => [
    amperePerCycle, dailyUsageHours, i,
  ]);
  const predictions = reg.predict(inputMatrix) as number[];
  const resultLower = parseFloat((Math.min(...predictions) * 0.9).toFixed(3));
  const resultUpper = parseFloat((Math.max(...predictions) * 1.1).toFixed(3));
  const chartData   = predictions.map((v, i) => ({ day: i + 1, ampere: parseFloat(v.toFixed(3)) }));
  return { chartData, resultLower, resultUpper };
}
```

### 7.6 Prediction API Route

```typescript
// filepath: src/app/api/predict/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runPrediction } from "@/lib/ml/predict";
import { db } from "@/lib/db";
import { predictions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { amperePerCycle, dailyUsageHours, predictionPeriod } = await req.json();

  if (
    typeof amperePerCycle  !== "number" || amperePerCycle  <= 0  || amperePerCycle  > 50 ||
    typeof dailyUsageHours !== "number" || dailyUsageHours <= 0  || dailyUsageHours > 24 ||
    typeof predictionPeriod !== "number" || !Number.isInteger(predictionPeriod) ||
    predictionPeriod < 1 || predictionPeriod > 365
  ) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const result  = runPrediction(amperePerCycle, dailyUsageHours, predictionPeriod);
  const session = await auth.api.getSession({ headers: req.headers });

  if (session?.user?.id) {
    await db.insert(predictions).values({
      userId: session.user.id,
      amperePerCycle, dailyUsageHours, predictionPeriod,
      resultLower: result.resultLower,
      resultUpper: result.resultUpper,
      chartData:   result.chartData,
    });
  }
  return NextResponse.json(result);
}
```

### 7.7 Model Lifecycle

```
OFFLINE TRAINING
  new DTR({ maxDepth: 10, minNumSamples: 5 })
  → reg.train(trainingMatrix, trainingTargets)
  → reg.toJSON()  →  save to src/lib/ml/model.json

AT PREDICTION TIME
  DTR.load(modelJSON)   (loaded once at module init)
  → reg.predict(inputMatrix)
```

### 7.8 Training Dataset Requirements

| Property | Requirement |
|----------|------------|
| Source | Real AC ampere meter readings — must be documented for thesis |
| Format | JSON array: `{ trainingSet: number[][], trainingValues: number[] }` |
| Minimum samples | Ensure ≥ 20 rows in test split |
| Split | 80% training / 20% test |
| Features | Ampere Per Cycle, Daily Usage Hours, Time Step Index |
| Target | Measured ampere output |
| Preprocessing | Raw values as default — normalization requires explicit supervisor approval |

### 7.9 Dummy Training Dataset (Placeholder)

Used for development only. **Delete `src/lib/ml/data/dummy/` entirely when real data is provided.**

```typescript
// filepath: src/lib/ml/data/dummy/generate.ts
// Run: pnpm tsx src/lib/ml/data/dummy/generate.ts
// WARNING: DELETE this folder when real data is available.
import { writeFileSync } from "fs";
import { join } from "path";

function rand(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(3));
}

const trainingSet: number[][] = [];
const trainingValues: number[] = [];

for (let i = 0; i < 100; i++) {
  const a = rand(5, 25), h = rand(1, 16), t = i % 30;
  trainingSet.push([a, h, t]);
  trainingValues.push(parseFloat((a * 0.6 + h * 0.3 + t * 0.1 + rand(-0.5, 0.5)).toFixed(3)));
}

writeFileSync(join(__dirname, "dataset.json"), JSON.stringify({ trainingSet, trainingValues }, null, 2));
console.log("Generated 100 dummy samples. WARNING: delete when real data is available.");
```

```typescript
// filepath: src/lib/ml/data/dummy/train.ts
// Run: pnpm tsx src/lib/ml/data/dummy/train.ts
// WARNING: DELETE this folder when real data is available.
import { DecisionTreeRegression as DTR } from "ml-cart";
import { writeFileSync } from "fs";
import { join } from "path";
import dataset from "./dataset.json";

const reg = new DTR({ maxDepth: 10, minNumSamples: 5 });
reg.train(dataset.trainingSet, dataset.trainingValues);
writeFileSync(join(__dirname, "../../model.json"), JSON.stringify(reg.toJSON(), null, 2));
console.log("model.json written. WARNING: trained on dummy data — replace before thesis submission.");
```

**Replacement procedure:**
1. Delete `src/lib/ml/data/dummy/` entirely
2. Place real dataset at `src/lib/ml/data/real/dataset.json` (same format)
3. Train with `src/lib/ml/data/real/train.ts` → outputs `src/lib/ml/model.json`
4. Recompute RMSE, MAE, R² on the 20% test split and document in thesis

***

## 8. Accuracy and Evaluation Metrics

### 8.1 Metric Definitions

\[\text{RMSE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (\hat{y}_i - y_i)^2}\]

\[\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |\hat{y}_i - y_i|\]

\[R^2 = 1 - \frac{\sum_{i=1}^{n}(\hat{y}_i - y_i)^2}{\sum_{i=1}^{n}(\bar{y} - y_i)^2}\]

Where \(\hat{y}_i\) = predicted, \(y_i\) = actual, \(\bar{y}\) = mean of actuals.

### 8.2 Accuracy Targets

| Metric | Minimum (Pass) | Target | Ideal |
|--------|---------------|--------|-------|
| R² | ≥ 0.70 | ≥ 0.80 | ≥ 0.90 |
| RMSE | Document relative to data scale | — | — |
| MAE | Document relative to data scale | — | — |

### 8.3 Evaluation Protocol

1. Train CART model on 80% of dataset only
2. Compute all metrics on 20% held-out test set exclusively — never the training set
3. Document dataset size, split counts, and all three metric values in the thesis
4. Display metrics in the UI (landing page accuracy section + dashboard badge)
5. Thesis documentation includes metrics only if supervisor requires additional reporting beyond what the UI shows

***

## 9. Feature Requirements

### 9.1 Status Overview

| Feature | Status | Priority |
|---------|--------|----------|
| Landing Page | ✅ Existing | P0 |
| Bilingual UI (`next-intl`) | ✅ Existing | P0 |
| Prediction Form | ✅ Existing (dummy data) | P0 |
| Prediction Result (Chart + Range) | ✅ Existing (dummy data) | P0 |
| Real CART ML Integration | 🔲 Required | P0 |
| Authentication (Register/Login/Logout) | 🔲 Required | P0 |
| User Dashboard | 🔲 Required | P1 |
| Prediction History | 🔲 Required | P1 |
| Admin Panel | 🔲 Required | P1 |

***

### 9.2 Landing Page

**Status:** Existing | **Priority:** P0

**Requirements:**
- Communicates what ELPRESY is and who it serves
- Presents academic credibility signals (model type, R², metrics)
- Primary CTA routes to `/register` or `/predict`
- Fully responsive from 375px to 1440px+
- Follows `DESIGN.md` — dark premium, Space Grotesk + DM Sans, Muted Gold accents
- All strings via `next-intl`

**Content sections:**

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Product name, tagline, CTA |
| 2 | Problem/Value | What ELPRESY solves |
| 3 | How It Works | 3-step flow |
| 4 | Features | Key capabilities |
| 5 | Accuracy | Model type, R²/RMSE/MAE display |
| 6 | Footer | Navigation, locale switcher, copyright |

#### Bilingual Copy Reference

All keys below must exist in `messages/en.json` and `messages/id.json`. Never hardcode display text in component files.

**Hero**

| Key | English | Indonesian |
|-----|---------|-----------|
| `hero.badge` | Electrical Prediction System | Sistem Prediksi Listrik |
| `hero.headline` | Forecast Your AC Ampere Usage with Precision | Prediksi Penggunaan Ampere AC Anda dengan Presisi |
| `hero.subheadline` | ELPRESY uses machine learning to help building managers and facility teams forecast daily AC ampere consumption — before the bill arrives. | ELPRESY menggunakan machine learning untuk membantu manajer gedung dan tim fasilitas memperkirakan konsumsi ampere AC harian — sebelum tagihan datang. |
| `hero.cta_primary` | Get Started | Mulai Sekarang |
| `hero.cta_secondary` | See How It Works | Lihat Cara Kerjanya |

**Problem / Value**

| Key | English | Indonesian |
|-----|---------|-----------|
| `problem.label` | The Problem | Masalah yang Kami Selesaikan |
| `problem.headline` | Manual Estimation Isn't Good Enough | Estimasi Manual Tidak Cukup Lagi |
| `problem.body` | Spreadsheets and rule-of-thumb calculations leave facility teams guessing. Unexpected peak loads lead to budget overruns, inefficient scheduling, and a lack of accountability over energy consumption. | Spreadsheet dan kalkulasi perkiraan membuat tim fasilitas hanya bisa menebak. Beban puncak yang tidak terduga menyebabkan anggaran membengkak, penjadwalan tidak efisien, dan kurangnya akuntabilitas atas konsumsi energi. |

**How It Works**

| Key | English | Indonesian |
|-----|---------|-----------|
| `howitworks.label` | How It Works | Cara Kerjanya |
| `howitworks.headline` | Three Steps to Your Forecast | Tiga Langkah Menuju Prediksi Anda |
| `howitworks.step1_title` | Enter Your Parameters | Masukkan Parameter Anda |
| `howitworks.step1_body` | Input your AC ampere per cycle, daily usage hours, and the number of days to forecast. | Masukkan ampere AC per siklus, jam penggunaan harian, dan jumlah hari yang ingin diprediksi. |
| `howitworks.step2_title` | Run the Model | Jalankan Model |
| `howitworks.step2_body` | The CART regression model processes your inputs and generates a day-by-day ampere forecast — entirely in the browser. | Model regresi CART memproses input Anda dan menghasilkan prediksi ampere harian — sepenuhnya di browser. |
| `howitworks.step3_title` | Read Your Forecast | Baca Hasil Prediksi |
| `howitworks.step3_body` | View your time-series chart and predicted ampere range. Save results to your history for future reference. | Lihat grafik time-series dan rentang ampere yang diprediksi. Simpan hasil ke riwayat Anda untuk referensi mendatang. |

**Features**

| Key | English | Indonesian |
|-----|---------|-----------|
| `features.label` | Features | Fitur |
| `features.headline` | Built for Precision and Clarity | Dirancang untuk Presisi dan Kejelasan |
| `features.f1_title` | CART Regression Model | Model Regresi CART |
| `features.f1_body` | A proven, interpretable regression algorithm trained on real AC measurement data. | Algoritma regresi yang telah terbukti, dilatih pada data pengukuran AC nyata. |
| `features.f2_title` | Time-Series Forecast | Prediksi Time-Series |
| `features.f2_body` | See ampere usage projected day by day across your chosen forecast period. | Lihat penggunaan ampere yang diproyeksikan hari demi hari dalam periode prediksi Anda. |
| `features.f3_title` | Confidence Range | Rentang Kepercayaan |
| `features.f3_body` | Every prediction includes an upper and lower bound so you can plan for variance. | Setiap prediksi menyertakan batas atas dan bawah agar Anda dapat merencanakan varians. |
| `features.f4_title` | Prediction History | Riwayat Prediksi |
| `features.f4_body` | All your past predictions are saved to your personal dashboard for trend analysis. | Semua prediksi Anda tersimpan di dashboard pribadi untuk analisis tren. |
| `features.f5_title` | Bilingual Interface | Antarmuka Dua Bahasa |
| `features.f5_body` | Switch between Indonesian and English at any time from the navigation bar. | Ganti antara Bahasa Indonesia dan Inggris kapan saja dari bilah navigasi. |
| `features.f6_title` | No Installation Required | Tidak Perlu Instalasi |
| `features.f6_body` | Runs entirely in the browser. No app download, no server setup, no subscription cost. | Berjalan sepenuhnya di browser. Tidak perlu unduhan aplikasi, pengaturan server, atau biaya berlangganan. |

**Accuracy**

| Key | English | Indonesian |
|-----|---------|-----------|
| `accuracy.label` | Model Accuracy | Akurasi Model |
| `accuracy.headline` | Validated with Real Measurement Data | Divalidasi dengan Data Pengukuran Nyata |
| `accuracy.body` | The ELPRESY prediction model is evaluated using industry-standard regression metrics on a held-out test set. | Model prediksi ELPRESY dievaluasi menggunakan metrik regresi standar industri pada data uji yang terpisah. |
| `accuracy.r2_label` | R² Score | Skor R² |
| `accuracy.rmse_label` | RMSE | RMSE |
| `accuracy.mae_label` | MAE | MAE |
| `accuracy.note` | Metrics computed on 20% held-out test split. Higher R² indicates a better fit. | Metrik dihitung pada 20% data uji yang terpisah. R² lebih tinggi menunjukkan kesesuaian lebih baik. |

**Navigation & Footer**

| Key | English | Indonesian |
|-----|---------|-----------|
| `nav.home` | Home | Beranda |
| `nav.predict` | Predict | Prediksi |
| `nav.dashboard` | Dashboard | Dashboard |
| `nav.admin` | Admin | Admin |
| `nav.login` | Log In | Masuk |
| `nav.register` | Get Started | Mulai |
| `nav.logout` | Log Out | Keluar |
| `footer.tagline` | Electrical predictions powered by machine learning. | Prediksi listrik berbasis machine learning. |
| `footer.copyright` | © 2026 ELPRESY. All rights reserved. | © 2026 ELPRESY. Hak cipta dilindungi. |
| `footer.thesis_note` | Developed as an undergraduate thesis project (Skripsi). | Dikembangkan sebagai proyek tugas akhir (Skripsi). |

**Auth Pages**

| Key | English | Indonesian |
|-----|---------|-----------|
| `auth.login_title` | Welcome Back | Selamat Datang Kembali |
| `auth.login_subtitle` | Log in to access your predictions | Masuk untuk mengakses prediksi Anda |
| `auth.register_title` | Create Your Account | Buat Akun Anda |
| `auth.register_subtitle` | Start forecasting your AC ampere usage | Mulai prediksi penggunaan ampere AC Anda |
| `auth.field_name` | Full Name | Nama Lengkap |
| `auth.field_email` | Email Address | Alamat Email |
| `auth.field_password` | Password | Kata Sandi |
| `auth.field_confirm_password` | Confirm Password | Konfirmasi Kata Sandi |
| `auth.btn_login` | Log In | Masuk |
| `auth.btn_register` | Create Account | Buat Akun |
| `auth.link_register` | Don't have an account? Get started | Belum punya akun? Mulai di sini |
| `auth.link_login` | Already have an account? Log in | Sudah punya akun? Masuk |
| `auth.error_generic` | Something went wrong. Please try again. | Terjadi kesalahan. Silakan coba lagi. |
| `auth.error_invalid` | Invalid email or password. | Email atau kata sandi tidak valid. |

**Prediction Form**

| Key | English | Indonesian |
|-----|---------|-----------|
| `predict.title` | New Prediction | Prediksi Baru |
| `predict.subtitle` | Enter your AC parameters to generate a forecast | Masukkan parameter AC Anda untuk membuat prediksi |
| `predict.field_ampere` | Ampere Per Cycle | Ampere Per Siklus |
| `predict.field_ampere_hint` | Typical range: 5 – 25 A | Rentang umum: 5 – 25 A |
| `predict.field_hours` | Daily Usage Hours | Jam Penggunaan Harian |
| `predict.field_hours_hint` | Hours per day (max 24) | Jam per hari (maks 24) |
| `predict.field_period` | Prediction Period | Periode Prediksi |
| `predict.field_period_hint` | Number of days to forecast (max 365) | Jumlah hari yang diprediksi (maks 365) |
| `predict.btn_submit` | Generate Forecast | Buat Prediksi |
| `predict.btn_loading` | Generating… | Memproses… |
| `predict.result_title` | Forecast Result | Hasil Prediksi |
| `predict.result_range` | Predicted Range | Rentang Prediksi |
| `predict.result_chart_title` | Daily Ampere Forecast | Prediksi Ampere Harian |
| `predict.chart_x_axis` | Day | Hari |
| `predict.chart_y_axis` | Ampere (A) | Ampere (A) |
| `predict.new_prediction` | New Prediction | Prediksi Baru |
| `predict.error_required` | This field is required. | Kolom ini wajib diisi. |
| `predict.error_ampere` | Ampere must be between 0 and 50. | Ampere harus antara 0 dan 50. |
| `predict.error_hours` | Hours must be between 0 and 24. | Jam harus antara 0 dan 24. |
| `predict.error_period` | Period must be between 1 and 365 days. | Periode harus antara 1 dan 365 hari. |

**Dashboard**

| Key | English | Indonesian |
|-----|---------|-----------|
| `dashboard.title` | Dashboard | Dashboard |
| `dashboard.total_predictions` | Total Predictions | Total Prediksi |
| `dashboard.last_range` | Last Predicted Range | Rentang Prediksi Terakhir |
| `dashboard.last_date` | Last Prediction Date | Tanggal Prediksi Terakhir |
| `dashboard.history_title` | Prediction History | Riwayat Prediksi |
| `dashboard.trend_title` | Ampere Trend | Tren Ampere |
| `dashboard.col_date` | Date | Tanggal |
| `dashboard.col_ampere` | Ampere/Cycle | Ampere/Siklus |
| `dashboard.col_hours` | Hours/Day | Jam/Hari |
| `dashboard.col_period` | Period (days) | Periode (hari) |
| `dashboard.col_range` | Predicted Range | Rentang Prediksi |
| `dashboard.empty` | No predictions yet. Start your first forecast. | Belum ada prediksi. Mulai prediksi pertama Anda. |

**Admin Panel**

| Key | English | Indonesian |
|-----|---------|-----------|
| `admin.title` | Admin Panel | Panel Admin |
| `admin.tab_users` | Users | Pengguna |
| `admin.tab_predictions` | Predictions | Prediksi |
| `admin.col_name` | Name | Nama |
| `admin.col_email` | Email | Email |
| `admin.col_role` | Role | Peran |
| `admin.col_registered` | Registered | Terdaftar |
| `admin.col_user` | User | Pengguna |
| `admin.total_users` | Total Users | Total Pengguna |
| `admin.total_predictions` | Total Predictions | Total Prediksi |

***

### 9.3 Prediction Form

**Status:** Existing (dummy data) | **Priority:** P0

#### Input Fields

| Field | Label EN | Label ID | Type | Validation |
|-------|----------|----------|------|-----------|
| Ampere Per Cycle | Ampere Per Cycle | Ampere Per Siklus | `float` | Required. > 0 and ≤ 50. Unit: A |
| Daily Usage Hours | Daily Usage Hours | Jam Penggunaan Harian | `float` | Required. > 0 and ≤ 24. |
| Prediction Period | Prediction Period | Periode Prediksi | `integer` | Required. ≥ 1 and ≤ 365. Unit: days |

#### Output A — Confidence Range
- Formula: `[min(predictions) × 0.90, max(predictions) × 1.10]`
- Display: `X.XXX A — Y.YYY A`
- Must reflect actual CART output — never hardcoded

#### Output B — Time-Series Chart (Recharts)

```tsx
// filepath: src/components/predict/result/chart.tsx
"use client";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { ChartDataPoint } from "@/lib/ml/predict";

export default function PredictionChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="day" stroke="#A1A1AA" tick={{ fill: "#A1A1AA", fontSize: 12 }}
          label={{ value: "Day / Hari", position: "insideBottom", offset: -8, fill: "#A1A1AA" }} />
        <YAxis stroke="#A1A1AA" tick={{ fill: "#A1A1AA", fontSize: 12 }}
          label={{ value: "Ampere (A)", angle: -90, position: "insideLeft", fill: "#A1A1AA" }} />
        <Tooltip contentStyle={{ backgroundColor: "#111113", border: "1px solid rgba(201,168,76,0.2)",
          color: "#FAFAFA", borderRadius: "0.5rem" }} />
        <Line type="monotone" dataKey="ampere" stroke="#C9A84C" strokeWidth={2}
          dot={false} activeDot={{ r: 4, fill: "#F5C842" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

#### Validation Rules
- All three fields are required; empty submission is blocked
- Errors displayed inline per field, bilingual, with `aria-describedby`
- Submit button is disabled while a prediction is in progress

***

### 9.4 Authentication

**Status:** Required | **Priority:** P0

#### Registration (`/register`)
- Fields: Full Name, Email, Password, Confirm Password
- Email must be unique; Password min 8 characters with at least 1 number
- On success: redirect to `/dashboard`

#### Login (`/login`)
- Fields: Email, Password
- On failure: generic error only — do not reveal which field is wrong
- Session persists across page refresh (Better Auth HTTP-only cookie)

#### Logout
- Calls `authClient.signOut()` → redirects to landing page

#### Session in Server Components
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const session = await auth.api.getSession({ headers: await headers() });
// session?.user.id, .name, .email, .role
```

#### Session in Client Components
```typescript
import { useSession } from "@/lib/auth-client";
const { data: session, isPending } = useSession();
```

***

### 9.5 User Dashboard

**Status:** Required | **Priority:** P1 | **Route:** `/dashboard`

- Summary cards: total predictions, last ampere range, date of last prediction
- Trend line chart: `resultUpper` over time (x = `createdAt`, Recharts)
- History table: paginated (20/page), sorted by date descending
- "New Prediction" CTA → `/predict`

```typescript
// Data fetching in dashboard/page.tsx (Server Component)
const session = await auth.api.getSession({ headers: await headers() });
const userPredictions = await db
  .select().from(predictions)
  .where(eq(predictions.userId, session!.user.id))
  .orderBy(desc(predictions.createdAt))
  .limit(20);
```

***

### 9.6 Admin Panel

**Status:** Required | **Priority:** P1 | **Route:** `/admin`

- All registered users: name, email, role, registration date — paginated (20/page)
- All prediction records: user reference, inputs, result range, timestamp — paginated (20/page)
- Read-only — no deletion, no export in this version
- Role restriction enforced by middleware (§5.5)

```typescript
// All users
const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

// All predictions with user name
const allPredictions = await db
  .select({ prediction: predictions, userName: users.name })
  .from(predictions)
  .leftJoin(users, eq(predictions.userId, users.id))
  .orderBy(desc(predictions.createdAt));
```

***

## 10. Technical Architecture

### 10.1 Directory Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx                # Auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   └── predict/page.tsx
│   │   └── (admin)/
│   │       ├── layout.tsx                # Admin guard
│   │       └── admin/page.tsx
│   └── api/
│       ├── auth/[...all]/route.ts        # Better Auth handler
│       └── predict/route.ts
├── components/
│   ├── ui/                               # shadcn/ui + Base UI
│   ├── landing/
│   │   ├── layout/navbar.tsx
│   │   ├── layout/footer.tsx
│   │   └── section/hero/
│   │       ├── hero.tsx
│   │       ├── background.tsx
│   │       └── content/left.tsx
│   │       └── content/right.tsx
│   └── predict/
│       ├── predict-form.tsx
│       └── result/chart.tsx
│       └── result/range.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── seed-admin.ts
│   └── ml/
│       ├── model.json
│       ├── predict.ts
│       └── data/
│           └── dummy/           # DELETE when real data arrives
│               ├── generate.ts
│               ├── train.ts
│               └── dataset.json
├── i18n/
├── proxy.ts                              # Next.js 16: renamed from middleware.ts
└── messages/
    ├── en.json
    └── id.json
```

### 10.2 Routing Table

| Route | Access | Description |
|-------|--------|-------------|
| `/[locale]` | Public | Landing page |
| `/[locale]/login` | Public | Login |
| `/[locale]/register` | Public | Register |
| `/[locale]/dashboard` | Authenticated | User dashboard |
| `/[locale]/predict` | Authenticated | Prediction form |
| `/[locale]/admin` | Admin only | Admin panel |
| `/api/auth/[...all]` | Managed by Better Auth | Auth endpoints |
| `/api/predict` | Called by predict form | Prediction API |

> **Note (Next.js 16):** Route protection is handled by `src/proxy.ts` (renamed from `src/middleware.ts`). The exported function is `proxy()`, not `middleware()`.

### 10.3 Hard Implementation Constraints

1. Complete, production-ready code — never truncate with `// rest of code here`
2. Line 1 of every file must be a filepath comment: `// filepath: src/lib/auth.ts`
3. Strict TypeScript — `any` is prohibited everywhere
4. All components responsive from 375px to 1440px+
5. All animations include `@media (prefers-reduced-motion: reduce)` overrides
6. Tailwind CSS v4 utility classes only — no raw inline styles
7. Semantic HTML in all sections (`header`, `main`, `section`, `footer`, `nav`)
8. All filenames lowercase; component functions PascalCase; state/handlers camelCase
9. All user-facing strings via `next-intl` — no hardcoded display text
10. Shell & Section pattern for all complex components
11. `"use client"` only where required (Recharts, Better Auth hooks, event handlers)
12. Use `pg` driver — never `@neondatabase/serverless` with Better Auth
13. **(Next.js 16)** Route protection file is `src/proxy.ts`, export is `proxy()` — not `middleware`
14. **(Next.js 16)** All Request-time APIs (`cookies()`, `headers()`, `params`, `searchParams`) are async-only — always `await` them; sync access is removed
15. **(Next.js 16)** Node.js ≥ 20.9.0 required; TypeScript ≥ 5.1 required

***

## 11. User Flows

### 11.1 New User Registration

```
Landing Page → "Get Started"
  → /register → Name, Email, Password, Confirm Password
    → Submit → Better Auth creates user (role: "user")
      → /dashboard
```

### 11.2 Authenticated Prediction Flow

```
/dashboard → "New Prediction"
  → /predict → Fill inputs → Submit → Client validation
    → POST /api/predict → Server validation + DTR.predict()
      → Return chartData[], resultLower, resultUpper
        → Render Recharts LineChart + confidence range
          → Auto-save prediction to DB
            → "New Prediction" or back to /dashboard
```

### 11.3 Admin Flow

```
/login (admin credentials)
  → /admin
    → Tab 1: All users table (paginated)
    → Tab 2: All prediction records table (paginated)
```

***

## 12. Success Criteria

| ID | Criterion | Verification |
|----|-----------|-------------|
| S1 | Prediction form accepts inputs and returns results without error | Manual testing |
| S2 | CART model produces per-day time-series chart | Visual inspection |
| S3 | Confidence range derives from model output, not hardcoded | Code review |
| S4 | R² ≥ 0.80 on test split | Metric computation |
| S5 | RMSE and MAE documented in thesis | Academic documentation |
| S6 | Register, login, logout work; sessions persist | Manual testing |
| S7 | Dashboard shows accurate prediction history for current user | Manual testing |
| S8 | Admin panel shows all users/records; non-admin access blocked | Role-based testing |
| S9 | All UI text is bilingual and locale-switchable | Manual locale toggle |
| S10 | Prediction records saved automatically after successful prediction | Database inspection |
| S11 | Application live on Vercel production URL | URL verification |
| S12 | Thesis passes defense and receives academic approval | Examination outcome |

***

## 13. Decision Log

All decisions are fully resolved. No open decisions remain.

| ID | Decision | Resolution | Section |
|----|----------|-----------|---------|
| OD-A | Architecture option | Neon + Better Auth + Drizzle ORM | §5 |
| OD-B | Training dataset | 100-row dummy in `src/lib/ml/data/dummy/` — safe to delete when real data arrives | §7.9 |
| OD-C | Feature normalization | Raw values as default; normalization requires explicit supervisor approval | §7.8 |
| OD-D | Accuracy metrics in UI | Displayed in UI (landing + dashboard); docs-only if supervisor requires extra | §8.3 |
| OD-E | Landing page copy | Bilingual EN/ID fully specified | §9.2 |
| OD-F | Logo | `Zap` from `lucide-react`, `#C9A84C`, wordmark `ELPRESY` in Space Grotesk | §16 |
| OD-G | Prediction Period unit | Days (1–365) | §9.3 |
| OD-H | Confidence range method | `[min×0.9, max×1.1]` | §7.5 |
| OD-I | Chart library | Recharts with dark theme | §9.3 |
| OD-J | Ampere input range | > 0 and ≤ 50 A | §9.3 |
| OD-K | CART hyperparameters | `maxDepth: 10`, `minNumSamples: 5` | §7.3 |
| OD-L | Train/test split | 80% / 20% | §7.8 |
| OD-M | Package manager | pnpm | §5.1 |
| OD-N | Admin role assignment | Manually seeded via `seed-admin.ts` | §6.5 |
| OD-O | Password rules | Min 8 chars, at least 1 number | §9.4 |
| OD-P | DB driver | `pg` (node-postgres) — not `@neondatabase/serverless` | §5.3 |
| OD-Q | Next.js 16 proxy | Route protection file is `src/proxy.ts`; export is `proxy()` — `middleware` name is deprecated in Next.js 16 | §5.5 |
| OD-R | Next.js 16 runtime | Node.js ≥ 20.9.0 (LTS), TypeScript ≥ 5.1, React 19.2 (bundled), Turbopack enabled by default | §5.1 |

***

## 14. Installation and Setup Guide

### 14.1 Dependency Installation

```bash
# Next.js 16 requires Node.js >= 20.9.0
pnpm add better-auth drizzle-orm pg recharts next-intl ml-cart
pnpm add -D drizzle-kit @types/pg tsx
```

### 14.2 Setup Order

1. Create Neon project at neon.tech — copy connection string
2. Generate secret: `openssl rand -base64 32`
3. Populate `.env.local` (§5.2)
4. Create `src/lib/db/index.ts` — `pg` driver (§5.3)
5. Create `src/lib/auth.ts` — Better Auth server (§5.4)
6. Create `src/lib/auth-client.ts` — Better Auth client (§5.4)
7. Mount auth handler at `src/app/api/auth/[...all]/route.ts` (§5.4)
8. Run `npx @better-auth/cli generate` → generates auth schema
9. Merge auth schema with product schema in `src/lib/db/schema.ts` (§6.2, §6.3)
10. Run `pnpm drizzle-kit push` → push schema to Neon
11. Run `pnpm tsx src/lib/db/seed-admin.ts` → assign admin role
12. Add `src/proxy.ts` (§5.5) — **Next.js 16**: file is `proxy.ts`, function export is `proxy()`, not `middleware`
13. Run dummy data generator: `pnpm tsx src/lib/ml/data/dummy/generate.ts`
14. Run dummy model training: `pnpm tsx src/lib/ml/data/dummy/train.ts` → outputs `model.json`
15. Create `src/lib/ml/predict.ts` (§7.5)
16. Create `src/app/api/predict/route.ts` (§7.6)
17. Connect prediction form to `/api/predict`

***

## 15. Appendix

### A. ml-cart API Reference

| Method | Signature | Description |
|--------|-----------|-------------|
| Constructor | `new DTR(options?)` | Initialize with optional hyperparameters |
| Train | `reg.train(X: number[][], y: number[])` | Fit model to training data |
| Predict | `reg.predict(X: number[][])` | Returns `number[]` |
| Export | `reg.toJSON()` | Serialize to plain JS object |
| Load | `DTR.load(model)` | Restore serialized model |

### B. Better Auth Relevant Methods

| Context | Method | Description |
|---------|--------|-------------|
| Server | `auth.api.getSession({ headers })` | Get session server-side |
| Client | `useSession()` | Reactive session hook |
| Client | `authClient.signIn.email({ email, password })` | Sign in |
| Client | `authClient.signUp.email({ name, email, password })` | Register |
| Client | `authClient.signOut()` | Sign out |

### C. Glossary

| Term | Definition |
|------|-----------|
| CART | Classification and Regression Tree |
| RMSE | Root Mean Squared Error |
| MAE | Mean Absolute Error |
| R² | Coefficient of Determination |
| Ampere Per Cycle | Baseline ampere value per AC usage cycle |
| Prediction Period | Number of days to forecast |
| ml-cart | JavaScript CART regression library |
| Better Auth | Open-source framework-agnostic auth library |
| Neon | Serverless PostgreSQL platform |
| Drizzle ORM | TypeScript-native SQL ORM |
| next-intl | Next.js App Router i18n library |
| Shell & Section | Component pattern: shell orchestrates child sub-components |

### D. Priority Definitions

| Priority | Definition |
|----------|-----------|
| P0 | Launch blocker — must be complete before thesis submission |
| P1 | Required MVP — must be complete for a defensible submission |
| P2 | Enhancement — not required for thesis defense |

***

## 16. Logo Specification

### 16.1 Logo Definition

| Property | Value |
|----------|-------|
| Icon | `Zap` from `lucide-react` |
| Import | `import { Zap } from "lucide-react"` |
| Wordmark | `ELPRESY` in Space Grotesk, slightly wide tracking |
| Lockup | Icon left + wordmark right, horizontal |

### 16.2 Logo Component

```tsx
// filepath: src/components/landing/layout/logo.tsx
import { Zap } from "lucide-react";

interface LogoProps { size?: "sm" | "md" | "lg"; showWordmark?: boolean; }

const sizeMap = {
  sm: { icon: 16, text: "text-sm" },
  md: { icon: 20, text: "text-base" },
  lg: { icon: 28, text: "text-xl" },
};

export default function Logo({ size = "md", showWordmark = true }: LogoProps) {
  const { icon, text } = sizeMap[size];
  return (
    <div className="flex items-center gap-2">
      <Zap size={icon} className="text-primary fill-primary" strokeWidth={2.5} aria-hidden="true" />
      {showWordmark && (
        <span className={`font-space-grotesk font-semibold tracking-wide text-foreground ${text}`}>
          ELPRESY
        </span>
      )}
    </div>
  );
}
```

### 16.3 Color Rules

| Context | Icon | Wordmark |
|---------|------|---------|
| Default (dark bg) | `text-primary fill-primary` (`#C9A84C`) | `text-foreground` (`#FAFAFA`) |
| Active / hover | `text-[#F5C842]` (Bright Gold) | `text-foreground` |
| Monochrome | `text-foreground` | `text-foreground` |

### 16.4 Clear Space Rules

- Minimum clear space = height of the `Zap` icon on all four sides
- Never place logo against a background lighter than `#111113`
- Never place logo against a gold/accent background
- Never rotate, distort, recolor outside approved palette, or add drop shadows
- Never use wordmark without the icon
- Icon-only is permitted in constrained spaces (favicon, mobile menu) when the wordmark is illegible

### 16.5 Favicon

```typescript
// filepath: src/app/[locale]/layout.tsx
export const metadata: Metadata = {
  title: "ELPRESY — Electrical Predictions System",
  description: "Forecast your AC ampere usage with machine learning precision.",
  icons: { icon: "/favicon.svg" },
};
// Create public/favicon.svg: Zap SVG, fill="#C9A84C", stroke="none", 32×32px viewBox
```