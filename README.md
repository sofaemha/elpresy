# PRD.md - Product Requirements Document

**Project**: ELPRESY (Electrical Predictions System)
**Version**: 2.0
**Status**: Active Development
**Institution**: Informatics Program, Pancasakti University Tegal, 2026
**Document Type**: Product Requirements Document with Architecture Guidelines

---

## Table of Contents

1. Project Overview
2. Goals and Objectives
3. Technical Stack
4. Architecture Overview
5. Improved Directory Structure
6. Style System Rules
7. Script Utility Rules
8. Component Rules
9. Agent and Developer Workflow Rules
10. Feature Requirements
11. API Specification
12. Database Schema
13. Environment Configuration
14. Developer Guide

---

## 1. Project Overview

ELPRESY is a premium full-stack progressive web application built as an undergraduate thesis project (Skripsi/Tugas Akhir). Its primary purpose is to predict and optimize daily electrical consumption, specifically Air Conditioning ampere usage, using a machine learning regressor based on the CART (Classification and Regression Trees) Decision Tree algorithm.

The application has two primary areas:

**Landing Page**: A marketing site showcasing the project with interactive ML demos, feature highlights, and research findings.

**Application Dashboard**: A fully authenticated dashboard with a prediction engine, history management, model evaluation tools, user settings, and an admin panel.

---

## 2. Goals and Objectives

### Primary Goals

- Allow authenticated users to generate AC ampere consumption predictions for configurable periods
- Support two prediction modes: pretrained server-side model and browser-side simulated model
- Provide model evaluation metrics (R2, MAE, MSE, RMSE) based on selected historical predictions
- Enable prediction history management with search, filtering, export (CSV/PDF), and deletion
- Support dual-language interface (English and Indonesian)

### Structural Goals (v2.0 Additions)

- Enforce a single-file-per-feature rule across all components and utilities
- Move all CSS variables out of component files and into a dedicated `style` folder
- Move all reusable JS/TS functions out of component files and into a dedicated `script` folder
- Prevent duplicate utility logic from being created across the codebase
- Establish a clear agent and developer protocol via AGENT.md, SKILLS.md, PRD.md, and RULES.md
- Make the codebase fully navigable by any AI agent or human developer using only these four documents

---

## 3. Technical Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js (App Router) | v16 | File-based routing, server components, server actions |
| Styling | Tailwind CSS | v4 | Utility-first CSS with HSL custom properties |
| UI Primitives | Base UI (`@base-ui/react`) | latest | Headless accessible components |
| i18n | next-intl | latest | Dual-language support (en, id) |
| Machine Learning | ml-cart | latest | CART Decision Tree Regressor |
| Authentication | Better Auth | latest | Email/password auth, session management, RBAC |
| Database ORM | Drizzle ORM + pg | latest | Type-safe PostgreSQL queries |
| Charts | Recharts | latest | Area charts for predictions and trends |
| PDF Export | jsPDF + jspdf-autotable | latest | Client-side PDF generation |
| Toast Notifications | Sonner | latest | Success, error, loading feedback |
| Linter/Formatter | Biome | latest | Code linting and formatting |
| Package Manager | pnpm | latest | Fast, disk-efficient package management |

---

## 4. Architecture Overview

### Request Flow

A request enters via the middleware (`src/proxy.ts`), which:
1. Resolves the locale prefix (en or id)
2. Checks session for protected routes (/dashboard, /predict, /history, /settings)
3. Checks admin role for admin routes (/admin)
4. Redirects unauthenticated users to /{locale}/login
5. Redirects non-admin users from admin routes to /{locale}/dashboard

### Rendering Strategy

- Landing pages: Server Components with Client Components for interactive ML simulator and scroll effects
- Dashboard pages: Server Components for data fetching, Client Components for interactivity
- History: Server/Client split (server fetches, client handles search, filter, paginate, export)
- Prediction: Client Component (requires real-time state for form + results)
- Admin panel: Server Component

### Data Flow

```
User Input -> Client Component -> Server Action or API Route -> Drizzle ORM -> PostgreSQL
                                                           -> ML Engine (predict.ts)
                                                           -> Better Auth (session)
```

---

## 5. Improved Directory Structure

This is the target structure for v2.0. The additions are the `style` and `script` folders at the same level as `app`, `components`, and `lib`.

```
src/
  proxy.ts                      - Middleware: i18n routing and auth route protection

  app/
    layout.tsx                  - Root layout (fonts, metadata, toaster)
    globals.css                 - Tailwind directives and @import from style folder
    favicon.ico
    actions/
      predictions.ts            - Server actions: CRUD for predictions table
    api/
      auth/
        [...all]/
          route.ts              - Better Auth catch-all API handler
      evaluate/
        route.ts                - GET: compute model evaluation metrics
      predict/
        route.ts                - POST: run server-side ML prediction
    [locale]/
      layout.tsx                - i18n provider layout
      page.tsx                  - Landing page composition
      (auth)/
        login/
          page.tsx              - Login page
        register/
          page.tsx              - Registration page
      (app)/
        layout.tsx              - App layout with sidebar
        dashboard/
          page.tsx              - Dashboard server component
        predict/
          page.tsx              - Prediction page client component
        evaluate/
          page.tsx              - Model evaluation page
        history/
          page.tsx              - History server component
          history-client.tsx    - History client (search, filter, paginate, export, delete)
        settings/
          page.tsx              - User settings (profile, security, preferences)
      (admin)/
        layout.tsx              - Admin layout
        admin/
          page.tsx              - Admin panel server component

  components/
    ui/
      accordion.tsx
      alert-dialog.tsx
      badge.tsx
      button.tsx
      card.tsx
      dropdown-menu.tsx
      numeric-stepper.tsx
      separator.tsx
      sheet.tsx
      sonner.tsx
      tabs.tsx
    dashboard/
      dashboard.tsx             - Dashboard shell component
      layout/
        sidebar.tsx             - Responsive sidebar navigation
      section/
        header.tsx              - Dashboard page header
        stats.tsx               - Stat cards (total, last range, last date)
        trend.tsx               - Recharts area chart (prediction trend)
        history.tsx             - Recent predictions table
        predict/
          training.tsx  - Training model selector and simulator controls
          input.tsx     - Prediction input form (ampere, hours, period)
          result.tsx    - Prediction results and chart
        evaluate/
          active-prediction.tsx - Evaluator active prediction trigger and display
          selector-dialog.tsx - Dialog for selecting past predictions
        admin/
          users-table.tsx       - All registered users table
          predictions-table.tsx - All predictions with user names
          sessions-table.tsx    - All active sessions table
    predict/
      result/
        chart.tsx               - Day-by-day prediction area chart
    landing/
      about.tsx
      features.tsx
      hero.tsx
      preview.tsx
      research.tsx
      workflow.tsx
      layout/
        navbar.tsx
        footer.tsx
      section/
        author/
          profile.tsx
        features/
          header.tsx
          grid.tsx
        footer/
          content.tsx
          mobile.tsx
        hero/
          background.tsx
          content/
            left.tsx
            right.tsx
        navbar/
          logo.tsx
          desktop.tsx
          actions.tsx
          mobile.tsx
        preview/
          app.tsx
          header.tsx
          mockup.tsx
          proof.tsx
          app/
            dashboard.tsx
            prediction.tsx
            history.tsx
            settings.tsx
        research/
          discover.tsx
          explore.tsx
        workflow/
          header.tsx
          powered.tsx
          steps.tsx

  i18n/
    routing.ts
    request.ts
    navigation.ts

  lib/
    utils.ts                    - Tailwind class merge (cn)
    auth.ts                     - Better Auth server configuration
    auth-client.ts              - Better Auth React client hooks
    db/
      index.ts                  - Drizzle ORM + pg Pool connection
      schema.ts                 - All table definitions
      seed-admin.ts             - Admin role seeder script
      migrations/               - Auto-generated by drizzle-kit
    ml/
      predict.ts                - Server-side CART prediction engine
      evaluate.ts               - Server-side evaluation metrics
      model.json                - Pre-trained CART model weights
      data/
        dummy/                  - Dummy training data files

  style/                        - NEW: All CSS variables and theme tokens
    tokens-color.css            - Background, surface, text, and border color tokens
    tokens-typography.css       - Font family tokens
    tokens-spacing.css          - Radius and spacing tokens
    palette-gold.css            - Gold brand color palette
    animations.css              - Custom keyframes (shimmer, pulse-gold)
    theme-dark.css              - Dark mode variable overrides
    theme-shadcn.css            - Shadcn semantic token mappings
    utilities.css               - Custom utility classes (gold-shimmer, animate-pulse-gold)

  script/                       - NEW: Reusable JS/TS utility functions (one per file)
    training-data.ts   - Generates synthetic training data for simulated model
    chart-data.ts         - Transforms prediction output into chart-ready format
    compute-prediction.ts - Computes total, working days, avg daily, per-month stats
    export-pdf.ts               - Exports prediction history as PDF using jsPDF
    export-csv.ts               - Exports prediction history as CSV
    round-float.ts              - Rounds float to N decimal places based on step value
    format-date.ts              - Formats a Date object for localized display
```

---

## 6. Style System Rules

### 6.1 No CSS Variables in Component Files

CSS variables must never be defined inside component files, including files inside `components/ui/`. The shadcn/ui integration previously relied on CSS variables defined in `globals.css` directly. In v2.0, all variable definitions are moved to `src/style/`.

### 6.2 globals.css Structure

After migration, `src/app/globals.css` must look like this:

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@import "../style/tokens-color.css";
@import "../style/tokens-typography.css";
@import "../style/tokens-spacing.css";
@import "../style/palette-gold.css";
@import "../style/animations.css";
@import "../style/theme-dark.css";
@import "../style/theme-shadcn.css";
@import "../style/utilities.css";

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

### 6.3 Style File Contents

**tokens-color.css** - contains:
- `--color-bg`
- `--color-surface`
- `--color-surface-2`
- `--color-text-primary`
- `--color-text-muted`
- `--color-text-faint`
- `--color-border-gold`
- `--color-border-gold-hover`

**palette-gold.css** - contains:
- `--color-gold`
- `--color-gold-light`
- `--color-gold-dark`
- `--color-gold-glow`

**tokens-typography.css** - contains:
- `--font-display`
- `--font-sans`

**tokens-spacing.css** - contains:
- `--radius` (base value)
- `--radius-sm` through `--radius-4xl`

**theme-shadcn.css** - contains:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`
- `--border`, `--input`, `--ring`

**animations.css** - contains:
- `@keyframes shimmer`
- `@keyframes pulse-gold`
- `@keyframes accordion-down`
- `@keyframes accordion-up`

**utilities.css** - contains:
- `.gold-shimmer`
- `.animate-pulse-gold`

**theme-dark.css** - contains:
- Dark-mode-scoped overrides for all variables in the root block

---

## 7. Script Utility Rules

### 7.1 Extraction Targets

The following logic must be extracted from its current location and placed in `src/script/`:

**generate-training-data.ts**
- Extracted from: `app/[locale]/(app)/predict/page.tsx`
- Current behavior: `generateData(months)` creates synthetic ampere x hours + noise data
- New export: `generateTrainingData(months: number): TrainingDataPoint[]`

**build-chart-data.ts**
- Extracted from: `components/predict/result/chart.tsx`
- Current behavior: transforms raw prediction output to chart-ready format
- New export: `buildChartData(data: ChartDataPoint[]): FormattedChartPoint[]`

**compute-prediction-stats.ts**
- Extracted from: `app/[locale]/(app)/predict/page.tsx`
- Current behavior: computes total, working days, avg daily, per-month stats from chartData
- New export: `computePredictionStats(chartData: ChartDataPoint[], period: number): PredictionStats`

**export-pdf.ts**
- Extracted from: `app/[locale]/(app)/history/history-client.tsx`
- Current behavior: uses jsPDF + jspdf-autotable to generate a PDF of prediction history
- New export: `exportPdf(predictions: Prediction[], filename: string): void`

**export-csv.ts**
- Extracted from: `app/[locale]/(app)/history/history-client.tsx`
- Current behavior: serializes predictions to CSV and triggers download
- New export: `exportCsv(predictions: Prediction[], filename: string): void`

**round-float.ts**
- Extracted from: `components/ui/numeric-stepper.tsx`
- Current behavior: calculates decimal places from step prop to prevent floating point errors
- New export: `roundFloat(value: number, step: number): number`

**format-date.ts**
- New utility for consistent date formatting across dashboard, history, and admin tables
- New export: `formatDate(date: Date | string, locale?: string): string`

### 7.2 Import Pattern After Extraction

After extraction, all usages inside components must import from the script path:

```tsx
import { computePredictionStats } from "@/script/compute-prediction-stats";
import { exportPdf } from "@/script/export-pdf";
import { roundFloat } from "@/script/round-float";
```

---

## 8. Component Rules

### 8.1 Single Feature Per File

Each component file exports exactly one component. The file name must match the component name in lowercase kebab-case.

Examples:
- `PredictInput` -> `predict-input.tsx`
- `PredictionSelectorDialog` -> `prediction-selector-dialog.tsx`
- `UsersTable` -> `users-table.tsx`

### 8.2 Internal Sub-Components

Small helper components used only within a parent component may exist as non-exported functions in the same file. They must not be exported.

### 8.3 No Inline Logic

Component files must not contain:
- Business logic that could be abstracted into a script utility
- CSS variable definitions
- Multiple exported components

---

## 9. Agent and Developer Workflow Rules

### 9.1 Protocol File Locations

The four protocol files live at the project root, the same level as `package.json`, `drizzle.config.ts`, and other root config files:

```
ELPRESY/             - project root
  AGENT.md           - agent flow protocol
  SKILLS.md          - utilities and capabilities registry
  PRD.md             - product requirements document (this file)
  RULES.md           - file and folder creation rules
  package.json
  drizzle.config.ts
  next.config.ts
  src/
    ...
```

These files are NOT inside `src/`. They are project-level documents, not source code.

### 9.2 Mandatory File Reading

Any agent or developer starting work on this codebase must read these files in order:
1. AGENT.md
2. SKILLS.md
3. PRD.md (this file)
4. RULES.md

### 9.2 Confirmation Before Action

Confirmation from the user is required before:
- Creating any new file or folder
- Adding a CSS variable to any style file
- Creating a new script utility
- Modifying the directory structure
- Updating any of the four protocol files

### 9.3 After Creating a Style File

Immediately import the new file in `src/app/globals.css` following the import order defined in RULES.md.

### 9.4 After Creating a Script File

Immediately register the new function in SKILLS.md under the "Registered Script Utilities" section.

### 9.5 Communication Style

All documentation, comments, and messages written by agents must:
- Use plain hyphens (-) not long dashes
- Use standard ASCII only in file names
- Avoid filler phrases like "As an AI language model", "It is worth noting that", "In conclusion"
- Write in direct, technical language
- Ask a question rather than making an assumption

---

## 10. Feature Requirements

### 10.1 Authentication

- Email and password registration with minimum 8-character password
- Session-based login with redirect to /dashboard on success
- Logout with session revocation
- Profile update (name only; email is immutable)
- Password change with current password verification and optional session revocation
- Role-based access: user and admin roles

### 10.2 Prediction Engine

- Two modes: pretrained (server-side CART model) and simulated (browser-side CART training)
- Inputs: ampere per cycle (0 to 50 A), daily usage hours (0 to 24), prediction period (1 to 365 days)
- Period presets: 1 month (22 days), 3 months (66 days), 6 months (132 days), custom
- Output: daily ampere values, lower bound (min x 0.9), upper bound (max x 1.1)
- Automatic save to database when user is authenticated (pretrained mode)
- Manual save from client in simulated mode via server action
- Result display: area chart, stat cards (working days, avg daily, per-month, bounds)

### 10.3 History Management

- Table of all past predictions ordered by date descending
- Full-text search across date, ampere, hours, period, range
- Column filter (select which columns are searchable)
- Pagination (10 items per page)
- Row selection (individual and select-all)
- Export selected as CSV or PDF with date-range filename
- Delete single, selected batch, or all (each with confirmation dialog)
- All delete operations revalidate /history path

### 10.4 Model Evaluation

- Select any past prediction as the "active" evaluation reference
- Active prediction's chartData serves as the actual values
- Metrics computed by GET /api/evaluate: MSE, MAE, RMSE, R2
- Validation cards: pass/fail badges for R2 >= 0.85, MAE <= 10%

### 10.5 User Settings

- Profile: update display name
- Security: change password
- Preferences: switch language (English/Indonesian)
- Layout: tabs on mobile, bento grid on desktop

### 10.6 Admin Panel

- Accessible only to users with role = "admin"
- Three tables: users (50 max), predictions with user names (50 max), sessions with user names (50 max)
- Read-only view (no admin actions in v2.0)

### 10.7 Landing Page

Sections in order:
- Navbar (scroll-aware, language toggle, IntersectionObserver active tracking)
- Hero (two-column: typography + interactive ML simulator)
- Features (bento grid of CART model highlights)
- Workflow (3-step process with connecting dashed gold line)
- Preview (virtual browser mockup with tabbed app preview)
- Research (tabbed bento + FAQ accordion)
- Author (researcher profile with university logo)
- Footer (neon gold top border, credit text)

### 10.8 Internationalization

- Supported locales: en (English), id (Indonesian)
- Default locale: en
- All user-facing strings use next-intl translation keys
- Language switching available in navbar (landing) and settings (app)
- Locale prefix in URL: /en/dashboard, /id/dashboard

---

## 11. API Specification

### POST /api/predict

**Purpose**: Run server-side CART prediction using pre-trained model.

Request body:
```json
{
  "amperePerCycle": 8.0,
  "dailyUsageHours": 9,
  "predictionPeriod": 22
}
```

Validation:
- `amperePerCycle`: number, 0 to 50
- `dailyUsageHours`: number, 0 to 24
- `predictionPeriod`: integer, 1 to 365

Response (success):
```json
{
  "chartData": [{ "day": 1, "ampere": 72.0 }],
  "resultLower": 64.8,
  "resultUpper": 79.2
}
```

Side effect: If the request has a valid session, the prediction is automatically saved to the database.

---

### GET /api/evaluate

**Purpose**: Compute model evaluation metrics using a selected historical prediction as reference.

Query params: `?predictionId=<uuid>`

Response (success):
```json
{
  "mse": 4.2,
  "mae": 1.8,
  "rmse": 2.05,
  "r2": 0.91,
  "dataSize": 22
}
```

---

### GET + POST /api/auth/[...all]

Delegated to Better Auth handler. Handles all auth operations.

---

## 12. Database Schema

### Table: user

| Column | Type | Notes |
|---|---|---|
| id | text | Primary key |
| name | text | Not null |
| email | text | Not null, unique |
| emailVerified | boolean | Default false |
| image | text | Nullable |
| role | text | Default "user", values: "user" or "admin" |
| createdAt | timestamp | Default now |
| updatedAt | timestamp | Default now |

### Table: session

| Column | Type | Notes |
|---|---|---|
| id | text | Primary key |
| expiresAt | timestamp | Not null |
| token | text | Not null, unique |
| createdAt | timestamp | Not null |
| updatedAt | timestamp | Not null |
| ipAddress | text | Nullable |
| userAgent | text | Nullable |
| userId | text | Not null, FK to user.id |

### Table: account

Standard Better Auth account table for OAuth provider support (unused in v1, reserved for future).

### Table: verification

Standard Better Auth email verification table.

### Table: predictions

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, random default |
| userId | text | Not null, FK to user.id, cascade delete |
| amperePerCycle | real | Not null |
| dailyUsageHours | real | Not null |
| predictionPeriod | integer | Not null |
| resultLower | real | Not null |
| resultUpper | real | Not null |
| totalAmpere | real | Not null, default 0 |
| chartData | jsonb | Nullable, array of {day, ampere} objects |
| createdAt | timestamp | Not null, default now |

---

## 13. Environment Configuration

Create a `.env.local` file at the project root with the following variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for session signing |
| `BETTER_AUTH_URL` | Server-side base URL for Better Auth |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Client-side base URL for Better Auth |

---

## 14. Developer Guide

### Running the Application

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run Biome linter
pnpm format     # Format code with Biome
```

### Database Commands

```bash
npx drizzle-kit push       # Push schema to database
npx drizzle-kit generate   # Generate migration files
npx drizzle-kit migrate    # Apply migrations
npx tsx src/lib/db/seed-admin.ts   # Promote a user to admin
```

### Adding a New App Page

1. Create `src/app/[locale]/(app)/your-page/page.tsx`
2. The route is automatically protected by middleware
3. Add the route to the `NAV_ITEMS` array in `components/dashboard/layout/sidebar.tsx`
4. Add translation keys to `messages/en.json` and `messages/id.json`

### Adding a New CSS Variable

1. Identify which style file the variable belongs to (see RULES.md section 4)
2. Check if the file already exists in `src/style/`
3. Add the variable to the correct file, or create a new file and register it in `globals.css`
4. Confirm the action with the user if creating a new file
5. Update SKILLS.md if a new style file was created

### Adding a New Script Utility

1. Check SKILLS.md to confirm no equivalent function exists
2. Create `src/script/your-function-name.ts` with exactly one exported function
3. Confirm the action with the user before creating the file
4. Register the new function in SKILLS.md under "Registered Script Utilities"

### Adding a New Landing Section

1. Create a new block component in `src/components/landing/`
2. Add it to the page composition in `src/app/[locale]/page.tsx`
3. Update the `Links` array in `src/components/landing/layout/navbar.tsx`
4. Add translation keys to both message files

### Using Existing Script Utilities

```tsx
import { computePredictionStats } from "@/script/compute-prediction-stats";
import { exportPdf } from "@/script/export-pdf";
import { formatDate } from "@/script/format-date";
import { roundFloat } from "@/script/round-float";
```

### Using Existing Server Actions

```tsx
import { savePrediction, getPredictions, deletePrediction } from "@/app/actions/predictions";

const predictions = await getPredictions();
const result = await savePrediction({ amperePerCycle: 8.0, dailyUsageHours: 9, ... });
await deletePrediction("uuid-here");
```

### Using Authentication

```tsx
import { signIn, signOut, useSession, updateUser, changePassword } from "@/lib/auth-client";

const { data: session, isPending } = useSession();
await signIn.email({ email, password, callbackURL: "/dashboard" });
await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
await updateUser({ name: "New Name" });
await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
```

---

## Changelog

### v2.0 (Current)

- Added `src/style/` folder for all CSS variables
- Added `src/script/` folder for all reusable utility functions
- Defined extraction targets from existing inline logic
- Established AGENT.md, SKILLS.md, PRD.md, RULES.md protocol
- Added auto-categorization checklist in RULES.md
- Prohibited CSS variables in shadcn component wrappers
- Prohibited multiple exported functions per script file
- Added confirmation requirement for all structural changes

### v1.0

- Initial codebase with full authentication, prediction, history, evaluation, and admin features
- Dual-language support (English and Indonesian)
- Tailwind CSS v4 with inline custom theme configuration
- Base UI headless component library integration
