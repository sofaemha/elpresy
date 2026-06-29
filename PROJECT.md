# ELPRESY - Project Codebase Documentation & Architectural Analysis

Welcome to the comprehensive, line-by-line developer guide and documentation for **ELPRESY** (Electrical Predictions System). This document is designed to provide an exhaustive analysis of every file located under the `/src` folder, detailing its exact contents, architectural purpose, usage, properties, attributes, hooks, and intricate design decisions. With this document, any AI agent or human developer can understand the entire project inside-out without needing to open the original source files.

---

## 1. Project Overview & Architectural Stack

**ELPRESY** is a premium, full-stack progressive web application designed as an undergraduate thesis project (*Skripsi / Tugas Akhir*) in the Informatics Program at Pancasakti University Tegal, 2026. Its primary goal is to predict and optimize daily electrical consumption (specifically Air Conditioning ampere usage) using a machine learning regressor (CART Decision Tree).

The application consists of two major areas:
1. **Landing Page**: A high-fidelity marketing site showcasing the project, with interactive ML demos.
2. **Application Dashboard**: A full authenticated application with prediction engine, history management, settings, and admin panel.

### The Technical Stack
1. **Next.js (v16 / App Router)**: Using standard file-based routing with internationalization under locale sub-directories, route groups `(app)`, `(auth)`, `(admin)`, and server actions.
2. **Tailwind CSS (v4)**: Leveraging the latest Tailwind engine featuring high-performance CSS themes, fluid sizing, inline configurations, custom keyframe animations, and HSL variables.
3. **next-intl**: Used for dual-language support (English `en` and Indonesian `id`), featuring deep translation interpolation, static locale routing, and seamless route proxies.
4. **Base UI (`@base-ui/react`)**: A zero-styled headless component library (formerly Radix UI's clean state machine architecture) used to build highly accessible, customizable dropdowns, sheets, accordions, tabs, alert dialogs, and menus.
5. **ml-cart**: A machine learning library used to run the **CART (Classification and Regression Trees)** Decision Tree Regressor — both client-side (simulated mode) and server-side (pre-trained model via `model.json`).
6. **Better Auth**: A modern authentication library providing email/password authentication with session management, role-based access control (`user` / `admin`), and React client hooks.
7. **Drizzle ORM + PostgreSQL (`pg`)**: Type-safe ORM with PostgreSQL for persistent data storage of users, sessions, accounts, verifications, and predictions.
8. **Recharts**: A composable charting library for rendering interactive area charts in the dashboard and prediction result views.
9. **jsPDF + jspdf-autotable**: Client-side PDF generation for exporting prediction history reports.
10. **Sonner**: A toast notification library for user feedback (success, error, loading states).

---

## 2. Directory Structure Map inside `src`

```
src/
├── proxy.ts                    # Middleware: i18n routing + auth route protection
├── app/
│   ├── layout.tsx              # Global Root Layout (Fonts, Metadata, Toaster)
│   ├── globals.css             # Tailwind v4 directives, custom themes, utility animations
│   ├── favicon.ico             # Application favicon
│   ├── actions/
│   │   └── predictions.ts      # Server actions: CRUD for predictions table
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts    # Better Auth catch-all API handler
│   │   ├── evaluate/
│   │   │   └── route.ts        # GET endpoint: dynamic evaluate active prediction metrics
│   │   └── predict/
│   │       └── route.ts        # POST endpoint: run server-side ML prediction
│   └── [locale]/
│       ├── layout.tsx          # Locale-specific i18n provider layout
│       ├── page.tsx            # Landing page (assembles landing blocks)
│       ├── (auth)/
│       │   ├── login/
│       │   │   └── page.tsx    # Login page (email + password)
│       │   └── register/
│       │       └── page.tsx    # Registration page (name + email + password)
│       ├── (app)/
│       │   ├── layout.tsx      # App layout with sidebar navigation
│       │   ├── dashboard/
│       │   │   └── page.tsx    # Dashboard: stats, trend chart, history table
│       │   ├── predict/
│       │   │   └── page.tsx    # Predict: training model + input + results
│       │   ├── evaluate/
│       │   │   └── page.tsx    # Evaluate: Model performance metrics based on active prediction
│       │   ├── history/
│       │   │   ├── page.tsx    # History: server component data fetcher
│       │   │   └── history-client.tsx  # History: client search, filter, pagination, export, delete
│       │   └── settings/
│       │       └── page.tsx    # Settings: profile, security, preferences
│       └── (admin)/
│           ├── layout.tsx      # Admin layout (shares sidebar)
│           └── admin/
│               └── page.tsx    # Admin panel: users, predictions, sessions tables
├── i18n/
│   ├── routing.ts              # next-intl locales and default configurations
│   ├── request.ts              # Dynamic asynchronous message loader
│   └── navigation.ts          # Navigation helper wraps (Link, useRouter, usePathname)
├── lib/
│   ├── utils.ts                # Tailwind CSS merge and clsx class utilities
│   ├── auth.ts                 # Better Auth server configuration
│   ├── auth-client.ts          # Better Auth React client hooks
│   ├── db/
│   │   ├── index.ts            # Drizzle ORM + pg Pool database connection
│   │   ├── schema.ts           # Database table definitions (users, sessions, accounts, verifications, predictions)
│   │   └── seed-admin.ts       # Script to assign admin role to a user by email
│   └── ml/
│       ├── predict.ts          # Server-side ML prediction using pre-trained model
│       ├── evaluate.ts         # Server-side model evaluation with split logic and metrics (MSE, MAE, R2)
│       ├── model.json          # Pre-trained CART Decision Tree model weights
│       └── data/
│           └── dummy/          # Dummy training data directory
└── components/
    ├── ui/                     # Modular Base UI custom design components
    │   ├── accordion.tsx       # Custom Base UI Accordion wrapper
    │   ├── alert-dialog.tsx    # Confirmation dialog with overlay + actions
    │   ├── badge.tsx           # Customizable span-level pill badge (CVA & useRender)
    │   ├── button.tsx          # High-flexibility client button (CVA & Clicks)
    │   ├── card.tsx            # Structured layout container (Header, Title, Footer)
    │   ├── dropdown-menu.tsx   # Full-featured dropdown menu (items, checkboxes, radio groups, submenus)
    │   ├── numeric-stepper.tsx # Increment/decrement number input with float precision
    │   ├── separator.tsx       # Accessible native decorative border
    │   ├── sheet.tsx           # Slide-out modal drawer overlay panels
    │   ├── sonner.tsx          # Sonner toast provider with themed icons
    │   └── tabs.tsx            # Segmented accessibility tab buttons and contents
    ├── dashboard/
    │   ├── dashboard.tsx       # Dashboard shell: stats, charts, history grid
    │   ├── layout/
    │   │   └── sidebar.tsx     # App sidebar: desktop collapsible + mobile sheet drawer
    │   └── section/
    │       ├── header.tsx      # Dashboard page header with badge + CTA
    │       ├── stats.tsx       # Three-column stat cards (total, last range, last date)
    │       ├── trend.tsx       # Recharts area chart for prediction trend over time
    │       ├── history.tsx     # Dashboard history table (recent predictions)
    │       ├── predict/
    │       │   ├── predict-training.tsx   # Training model type selector + simulator controls
    │       │   ├── predict-input.tsx      # Prediction input form (ampere, hours, period)
    │       │   └── predict-result.tsx     # Prediction results display + chart
    │       ├── evaluate/
    │       │   ├── active-prediction.tsx      # Evaluator active prediction trigger and stats display
    │       │   └── prediction-selector-dialog.tsx # Interactive dialog for searching and selecting past predictions
    │       └── admin/
    │           ├── users-table.tsx        # Admin: all registered users table
    │           ├── predictions-table.tsx  # Admin: all predictions (with user names)
    │           └── sessions-table.tsx     # Admin: all active sessions table
    ├── predict/
    │   └── result/
    │       └── chart.tsx       # Recharts area chart for prediction day-by-day data
    └── landing/                # High-fidelity blocks for sections
        ├── about.tsx           # Renders the Author profile section
        ├── features.tsx        # Renders the bento features grid
        ├── hero.tsx            # Renders the hero landing page (incorporating simulator)
        ├── preview.tsx         # Renders the virtual application browser mockup
        ├── research.tsx        # Renders the tabbed research bento layout
        ├── workflow.tsx        # Renders the how-it-works process steps
        ├── layout/
        │   ├── navbar.tsx      # Header section with scroll listener, language toggle
        │   └── footer.tsx      # Neon glowing bottom border and credit wrapper
        └── section/            # Decoupled component layers
            ├── author/
            │   └── profile.tsx     # Author profile details, bio, and affiliation
            ├── features/
            │   ├── header.tsx      # Title and subtitle block for features section
            │   └── grid.tsx        # 4-column dynamic grid displaying project features
            ├── footer/
            │   ├── content.tsx     # Desktop credit and hidden marquee assets
            │   └── mobile.tsx      # Optimized mobile footer credits
            ├── hero/
            │   ├── background.tsx  # Grid overlays and pulse gold ambient light halos
            │   └── content/
            │       ├── left.tsx    # Typography, badges, and primary action buttons
            │       └── right.tsx   # Dynamic Client Machine Learning simulator panel
            ├── navbar/
            │   ├── logo.tsx        # Clickable brand logo with lightning bolt icon
            │   ├── desktop.tsx     # Desktop nav links with IntersectionObserver tracking
            │   ├── actions.tsx     # Language globe switcher and CTA button
            │   └── mobile.tsx      # Slide-out sheet menu optimized for mobile screens
            ├── preview/
            │   ├── app.tsx         # Core visual tabs (Dashboard, Predict, Logs, Settings)
            │   ├── header.tsx      # Mockup visual section title and explanation
            │   ├── mockup.tsx      # Premium glassmorphic virtual OS browser chrome
            │   ├── proof.tsx       # Multi-icon horizontal trust markers
            │   └── app/
            │       ├── dashboard.tsx    # Visual charts and real-time stats overview
            │       ├── prediction.tsx   # Visual model parameter and forecast simulator
            │       ├── history.tsx      # Searchable, paginated prediction records table
            │       └── settings.tsx     # Core CART hyperparameters and researcher details
            ├── research/
            │   ├── discover.tsx    # Persona tabs (Engineers, Admins, etc.) bento box
            │   └── explore.tsx     # Advanced FAQ panel utilising customized Base UI accordions
            └── workflow/
                ├── header.tsx      # Workflow section title and process instructions
                ├── powered.tsx     # CART hyperparameter badge decoration
                └── steps.tsx       # Dash-connected 3-stage visual path steps
```

---

## 3. Root Files & Infrastructure Configuration

### `drizzle.config.ts`
* **Path**: [drizzle.config.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/drizzle.config.ts)
* **Purpose**: Configures Drizzle Kit for database migrations and schema management.
* **Detailed Contents**:
  - Loads environment variables from `.env.local` using `dotenv`.
  - Configures schema source at `./src/lib/db/schema.ts`.
  - Migration output directory: `./src/lib/db/migrations`.
  - Dialect: `postgresql`.
  - Connection via `DATABASE_URL` environment variable.

### `src/proxy.ts`
* **Path**: [src/proxy.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/proxy.ts)
* **Purpose**: Serves as the combined localized routing middleware **and** authentication guard. It intercepts all incoming requests to resolve the correct locale prefix (`/en` or `/id`) and enforces route-level access control.
* **Detailed Contents**:
  - Imports `createMiddleware` from `next-intl/middleware` and `auth` from `@/lib/auth`.
  - **Protected Routes**: `["/dashboard", "/predict"]` — require authenticated session.
  - **Admin Routes**: `["/admin"]` — require both authenticated session **and** `role === "admin"`.
  - For unauthenticated requests to protected/admin routes: redirects to `/{locale}/login`.
  - For non-admin users accessing admin routes: redirects to `/{locale}/dashboard`.
  - Delegates all other requests to the `intlMiddleware` for locale resolution.
* **Route Matcher**:
  - `["/((?!api|_next|_vercel|.*\\..*).*)" ]` — Runs middleware on all paths except API routes, system assets, and files with extensions.

### `src/lib/utils.ts`
* **Path**: [src/lib/utils.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/utils.ts)
* **Purpose**: A fundamental utility file providing Tailwind CSS merging. It combines dynamic Tailwind utility classes without style conflicts.
* **Detailed Contents**:
  - `clsx`: Used for conditionally constructing class names.
  - `twMerge`: Merges Tailwind classes, resolving conflicts (e.g., combining `px-2` and `px-4` into `px-4`).
  - Exports the standard helper function `cn(...inputs: ClassValue[])`.

---

## 4. Authentication System (Better Auth)

The application uses **Better Auth** for authentication, supporting email/password sign-up, sign-in, session management, profile updates, and role-based access control.

### `src/lib/auth.ts` (Server Configuration)
* **Path**: [src/lib/auth.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/auth.ts)
* **Purpose**: Configures the server-side Better Auth instance with database adapter, user schema, and authentication methods.
* **Detailed Contents**:
  - Uses `drizzleAdapter` with `pg` provider, mapping to schema tables: `users`, `sessions`, `accounts`, `verifications`.
  - **Additional User Fields**: `role` field with type `string`, required, defaulting to `"user"`.
  - **Authentication Methods**: `emailAndPassword` enabled with minimum password length of `8`.
  - **Trusted Origins**: Configured via `BETTER_AUTH_URL` environment variable.

### `src/lib/auth-client.ts` (React Client)
* **Path**: [src/lib/auth-client.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/auth-client.ts)
* **Purpose**: Creates the client-side auth instance for use in React components.
* **Detailed Contents**:
  - Creates client with `NEXT_PUBLIC_BETTER_AUTH_URL` (defaults to `http://localhost:3000`).
  - Exports destructured helpers: `signIn`, `signUp`, `signOut`, `useSession`, `updateUser`, `changePassword`.

### `src/app/api/auth/[...all]/route.ts`
* **Path**: [src/app/api/auth/[...all]/route.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/api/auth/%5B...all%5D/route.ts)
* **Purpose**: Catch-all API route that delegates all `/api/auth/*` requests to Better Auth's handler.
* **Detailed Contents**:
  - Exports `GET` and `POST` from `toNextJsHandler(auth)`.
  - Handles all auth endpoints: sign-in, sign-up, sign-out, session management, password change, etc.

---

## 5. Database Layer (Drizzle ORM + PostgreSQL)

### `src/lib/db/index.ts`
* **Path**: [src/lib/db/index.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/db/index.ts)
* **Purpose**: Establishes the database connection using `pg` Pool and Drizzle ORM.
* **Detailed Contents**:
  - Creates a `Pool` instance with `DATABASE_URL` from environment.
  - Exports `db` as a Drizzle instance with the full schema attached for relational queries.

### `src/lib/db/schema.ts`
* **Path**: [src/lib/db/schema.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/db/schema.ts)
* **Purpose**: Defines all database tables using Drizzle ORM's `pgTable` builder. Contains five tables that cover authentication, sessions, and domain-specific prediction data.
* **Tables**:

#### `users` (table: `"user"`)
| Column          | Type        | Constraints                         |
|-----------------|-------------|-------------------------------------|
| `id`            | `text`      | Primary key                         |
| `name`          | `text`      | Not null                            |
| `email`         | `text`      | Not null, unique                    |
| `emailVerified` | `boolean`   | Not null, default `false`           |
| `image`         | `text`      | Nullable                            |
| `role`          | `text`      | Not null, default `"user"` — values: `"user"` \| `"admin"` |
| `createdAt`     | `timestamp` | Not null, default now               |
| `updatedAt`     | `timestamp` | Not null, default now               |

#### `sessions` (table: `"session"`)
| Column      | Type        | Constraints                          |
|-------------|-------------|--------------------------------------|
| `id`        | `text`      | Primary key                          |
| `expiresAt` | `timestamp` | Not null                             |
| `token`     | `text`      | Not null, unique                     |
| `createdAt` | `timestamp` | Not null                             |
| `updatedAt` | `timestamp` | Not null                             |
| `ipAddress` | `text`      | Nullable                             |
| `userAgent` | `text`      | Nullable                             |
| `userId`    | `text`      | Not null, FK → `users.id`           |

#### `accounts` (table: `"account"`)
| Column                  | Type        | Constraints              |
|-------------------------|-------------|--------------------------|
| `id`                    | `text`      | Primary key              |
| `accountId`             | `text`      | Not null                 |
| `providerId`            | `text`      | Not null                 |
| `userId`                | `text`      | Not null, FK → `users.id`|
| `accessToken`           | `text`      | Nullable                 |
| `refreshToken`          | `text`      | Nullable                 |
| `idToken`               | `text`      | Nullable                 |
| `accessTokenExpiresAt`  | `timestamp` | Nullable                 |
| `refreshTokenExpiresAt` | `timestamp` | Nullable                 |
| `scope`                 | `text`      | Nullable                 |
| `password`              | `text`      | Nullable                 |
| `createdAt`             | `timestamp` | Not null                 |
| `updatedAt`             | `timestamp` | Not null                 |

#### `verifications` (table: `"verification"`)
| Column       | Type        | Constraints     |
|--------------|-------------|-----------------|
| `id`         | `text`      | Primary key     |
| `identifier` | `text`      | Not null        |
| `value`      | `text`      | Not null        |
| `expiresAt`  | `timestamp` | Not null        |
| `createdAt`  | `timestamp` | Nullable        |
| `updatedAt`  | `timestamp` | Nullable        |

#### `predictions` (table: `"predictions"`)
| Column             | Type      | Constraints                                      |
|--------------------|-----------|--------------------------------------------------|
| `id`               | `uuid`    | Primary key, default random                      |
| `userId`           | `text`    | Not null, FK → `users.id` (cascade delete)       |
| `amperePerCycle`   | `real`    | Not null                                         |
| `dailyUsageHours`  | `real`    | Not null                                         |
| `predictionPeriod` | `integer` | Not null                                         |
| `resultLower`      | `real`    | Not null                                         |
| `resultUpper`      | `real`    | Not null                                         |
| `totalAmpere`      | `real`    | Not null, default 0                              |
| `chartData`        | `jsonb`   | Nullable — `Array<{ day: number; ampere: number }>` |
| `createdAt`        | `timestamp`| Not null, default now                            |

* **Exported Types**:
  - `NewPrediction`: Inferred insert type from predictions table.
  - `Prediction`: Inferred select type from predictions table.

### `src/lib/db/seed-admin.ts`
* **Path**: [src/lib/db/seed-admin.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/db/seed-admin.ts)
* **Purpose**: A standalone script to promote an existing user to admin role by email.
* **Usage**: `npx tsx src/lib/db/seed-admin.ts` (after updating `adminEmail` constant).

---

## 6. Machine Learning Layer

### `src/lib/ml/predict.ts`
* **Path**: [src/lib/ml/predict.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/ml/predict.ts)
* **Purpose**: Server-side prediction engine using a pre-trained CART model loaded from `model.json`.
* **Detailed Contents**:
  - Loads the pre-trained model via `DTR.load(modelJSON)` at module initialization.
  - **`runPrediction(amperePerCycle, dailyUsageHours, predictionPeriod)`**:
    - Constructs an input matrix of `[ampere, hours, dayIndex]` for each day in the period.
    - Runs `reg.predict(inputMatrix)` to generate daily predictions.
    - Calculates `resultLower` (min × 0.9) and `resultUpper` (max × 1.1) bounds.
    - Returns `{ chartData, resultLower, resultUpper }` with `ChartDataPoint[]`.
* **Exported Interfaces**:
  - `ChartDataPoint`: `{ day: number; ampere: number }`.
  - `PredictionResult`: `{ chartData: ChartDataPoint[]; resultLower: number; resultUpper: number }`.

### `src/lib/ml/model.json`
* **Path**: [src/lib/ml/model.json](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/ml/model.json)
* **Purpose**: Pre-trained CART Decision Tree Regressor model weights (17KB). Loaded at server startup.

---

## 7. Server Actions & API Routes

### `src/app/actions/predictions.ts`
* **Path**: [src/app/actions/predictions.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/actions/predictions.ts)
* **Directive**: `"use server"`
* **Purpose**: Server actions for CRUD operations on the predictions table. All actions enforce authentication via session check.
* **Exported Functions**:
  1. **`getPredictions()`**: Fetches all predictions for the authenticated user, ordered by `createdAt` descending.
  2. **`deletePrediction(id: string)`**: Deletes a single prediction by ID (scoped to user). Revalidates `/history`.
  3. **`deletePredictions(ids: string[])`**: Bulk-deletes predictions by IDs (scoped to user). Revalidates `/history`.
  4. **`deleteAllPredictions()`**: Deletes all predictions for the authenticated user. Revalidates `/history`.
  5. **`savePrediction(data)`**: Inserts a new prediction record with the provided data. Revalidates `/history`. Returns the created prediction.
* **Authentication**:
  - All functions call `getUserId()` which uses `auth.api.getSession({ headers })` to resolve the session.
  - Throws `"Unauthorized"` error if no session is found.

### `src/app/api/predict/route.ts`
* **Path**: [src/app/api/predict/route.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/api/predict/route.ts)
* **Purpose**: POST API endpoint for running predictions with the pre-trained server-side model.
* **Detailed Contents**:
  - Validates inputs: `amperePerCycle` (0–50), `dailyUsageHours` (0–24), `predictionPeriod` (1–365, integer).
  - Calls `runPrediction()` from `@/lib/ml/predict`.
  - If the user has an authenticated session, automatically saves the prediction to the database.
  - Returns the prediction result as JSON.

### `src/app/api/evaluate/route.ts`
* **Path**: [src/app/api/evaluate/route.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/api/evaluate/route.ts)
* **Purpose**: GET API endpoint for evaluating the machine learning model against actual data.
* **Detailed Contents**:
  - Dynamically computes model performance metrics based on a user's selected "active prediction".
  - Accepts `?predictionId=...` in the query params.
  - Fetches the active prediction and extracts its `chartData` to use as actual values.
  - Returns calculated `mse`, `mae`, `rmse`, `r2`, and data size parameters.

---

## 8. Internationalization (i18n) Architecture

The project implements automated language detection and redirection. Translated texts are placed under the `messages/en.json` and `messages/id.json` files outside the `src` directory.

### `src/i18n/routing.ts`
* **Path**: [src/i18n/routing.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/routing.ts)
* **Purpose**: Defines the supported languages and the default configuration for the translation router.
* **Detailed Contents**:
  - `locales`: `["en", "id"]`.
  - `defaultLocale`: `"en"`.

### `src/i18n/request.ts`
* **Path**: [src/i18n/request.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/request.ts)
* **Purpose**: A server-side hook that asynchronously loads local translation JSON files depending on the requested locale segment.
* **Detailed Contents**:
  - Uses `getRequestConfig` from `next-intl/server`.
  - Falls back to `routing.defaultLocale` ("en") if locale is undefined or unsupported.
  - Dynamically imports `../../messages/${locale}.json`.

### `src/i18n/navigation.ts`
* **Path**: [src/i18n/navigation.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/navigation.ts)
* **Purpose**: Creates localized navigation utilities. Standard Next.js links don't automatically understand locale prefixes.
* **Exports**:
  1. `Link`: Localized alternative to `next/link`.
  2. `redirect`: Localized alternative to `next/navigation`'s redirect.
  3. `usePathname`: Active pathname hook that strips locale prefix.
  4. `useRouter`: Handles localized programmatic navigation.

---

## 9. Next.js Routing, Styling, and Global Layouts

### `src/app/globals.css`
* **Path**: [src/app/globals.css](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/globals.css)
* **Purpose**: The main design token sheet using **Tailwind CSS v4** directives.
* **Key Sections**:
  - **Tailwind imports**: `@import "tailwindcss";` and `@plugin "tailwindcss-animate";`.
  - **Custom Variant**: `@custom-variant dark (&:is(.dark *))` for dark mode scoping.
  - **Theme Directives (`@theme inline`)**:
    - Display Font: `--font-display: var(--font-space-grotesk)`.
    - Sans Font: `--font-sans: var(--font-dm-sans)`.
    - Brand colors: `--color-bg` (#09090B), `--color-surface` (#111113), `--color-surface-2` (#18181B).
    - Gold palette: `--color-gold` (#C9A84C), `--color-gold-light` (#F5C842), `--color-gold-dark` (#9A7A2E), `--color-gold-glow`.
    - Text hierarchy: `--color-text-primary` (#FAFAFA), `--color-text-muted` (#A1A1AA), `--color-text-faint` (#52525B).
    - Border tokens: `--color-border-gold`, `--color-border-gold-hover`.
    - **shadcn/ui semantic tokens**: Maps CSS variables for `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`.
    - **Radius scale**: `--radius-sm` through `--radius-4xl` computed from base `--radius`.
  - **`:root` Block**: Defines all CSS custom properties with dark-mode-first values. `--primary` is gold (#C9A84C) with black foreground.
  - **Custom Keyframes**: `shimmer` (background position animation) and `pulse-gold` (opacity fade).
  - **Utility Classes**: `.gold-shimmer` (5-stage gold gradient text effect), `.animate-pulse-gold`.
  - **Base Layer**: Universal border defaults and body styling.

### `src/app/layout.tsx`
* **Path**: [src/app/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/layout.tsx)
* **Purpose**: Root Next.js shell structure.
* **Detailed Contents**:
  - Loads Google fonts: `Space_Grotesk` (display) and `DM_Sans` (body), weights 300–700.
  - Exports `metadata` with title `"ELPRESY - Predict. Analyze. Optimize."`.
  - Configures `<html>` with dark theme, smooth scrolling, font CSS variables.
  - `<body>` applies sans-font, dark background, gold selection highlight.
  - **Includes `<Toaster richColors />`** from Sonner at the body level for global toast notifications.

### `src/app/[locale]/layout.tsx`
* **Path**: [src/app/[locale]/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/layout.tsx)
* **Purpose**: Locale sub-layout that fetches and provides translation resources.
* **Detailed Contents**:
  - Validates locale against `routing.locales` using `hasLocale`. Calls `notFound()` for unsupported locales.
  - Dynamically imports messages from `../../messages/${locale}.json`.
  - Wraps children in `<NextIntlClientProvider>` with locale and messages.

### `src/app/[locale]/page.tsx`
* **Path**: [src/app/[locale]/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/page.tsx)
* **Purpose**: Renders the landing page by assembling modular block components.
* **Components**:
  1. `<Navbar />` → `<Hero />` → `<Features />` → `<Workflow />` → `<Preview />` → `<Research />` → `<Author />` → `<Footer />`.

---

## 10. Application Route Groups

### Route Group: `(auth)` — Authentication Pages

#### `src/app/[locale]/(auth)/login/page.tsx`
* **Path**: [login/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28auth%29/login/page.tsx)
* **Directive**: `"use client"`
* **Purpose**: Login page with email/password form.
* **Key Behaviors**:
  - Uses `useSession()` to check if already authenticated → redirects to `/dashboard`.
  - Shows a gold spinner while session is loading.
  - On submit, calls `signIn.email({ email, password, callbackURL: "/dashboard" })`.
  - Displays localized error messages via `useTranslations("auth")`.
  - Includes link to `/register` page.

#### `src/app/[locale]/(auth)/register/page.tsx`
* **Path**: [register/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28auth%29/register/page.tsx)
* **Directive**: `"use client"`
* **Purpose**: Registration page with name, email, password, and confirm password fields.
* **Key Behaviors**:
  - Uses `useSession()` to redirect already-authenticated users.
  - Validates password confirmation match before calling `signUp.email()`.
  - Redirects to `/dashboard` on success.
  - Includes link to `/login` page.

---

### Route Group: `(app)` — Authenticated Application

#### `src/app/[locale]/(app)/layout.tsx`
* **Path**: [(app)/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/layout.tsx)
* **Purpose**: Shared layout for all authenticated app pages. Renders the sidebar navigation alongside page content.
* **Layout Structure**:
  - Flex container with `min-h-screen bg-bg`.
  - `<Sidebar />` component (fixed position).
  - Content area with `pt-14 lg:pt-0 lg:pl-16` offset for mobile top bar / desktop sidebar.

#### `src/app/[locale]/(app)/dashboard/page.tsx`
* **Path**: [dashboard/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/dashboard/page.tsx)
* **Purpose**: Server component that fetches predictions and renders the dashboard.
* **Key Behaviors**:
  - Authenticates via `auth.api.getSession()`. Redirects to `/login` if no session.
  - Queries last 20 predictions ordered by date descending.
  - Converts `Date` objects to ISO string format for client serialization.
  - Renders `<DashboardShell predictions={...} />`.
* **Metadata**: `"Dashboard — ELPRESY"`.

#### `src/app/[locale]/(app)/predict/page.tsx`
* **Path**: [predict/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/predict/page.tsx)
* **Directive**: `"use client"`
* **Purpose**: The core prediction page combining training model selection, input configuration, and results display.
* **Key Behaviors**:
  - **Dual Model Mode**: `"pretrained"` (uses server API `/api/predict`) or `"simulated"` (trains CART in browser).
  - **Training**: `generateData(months)` creates synthetic training data (ampere × hours + noise), trains `DecisionTreeRegression`.
  - **Prediction**: Validates inputs (ampere 0–50, hours 0–24, period 1–365), shows loading toast.
    - **Pretrained mode**: Calls `POST /api/predict` API.
    - **Simulated mode**: Runs prediction locally with `simulatedModel.predict()`, adds sinusoidal variance, saves via server action.
  - **Result Stats**: Computes total, working days, average daily, per-month metrics.
  - **Period Options**: `1mo` (22 days), `3mo` (66 days), `6mo` (132 days), or custom days.
  - **Layout**: Mobile — single column with gold gradient separators. Desktop — 12-column grid: controls (5 cols) + results (7 cols, sticky).
  - Three collapsible accordion sections: Training Data, Prediction Input, Prediction Results.

#### `src/app/[locale]/(app)/evaluate/page.tsx`
* **Path**: [evaluate/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/evaluate/page.tsx)
* **Directive**: `"use client"`
* **Purpose**: Model Evaluation page allowing users to assess model performance based on historical predictions.
* **Key Behaviors**:
  - **Active Prediction Selection**: Users can trigger `<PredictionSelectorDialog>` through `<ActivePrediction>` to pick a past prediction.
  - **Dynamic Metrics**: The chosen prediction acts as actual data values which the API uses to compute performance metrics (R², MAE, MSE, RMSE) in real-time.
  - **Validation Cards**: Displays pass/fail status for strict thresholds (e.g., R² ≥ 0.85, MAE ≤ 10%).

#### `src/app/[locale]/(app)/history/page.tsx` + `history-client.tsx`
* **Path**: [history/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/history/page.tsx) / [history-client.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/history/history-client.tsx)
* **Purpose**: Prediction history management with search, filtering, pagination, export, and deletion.
* **Architecture**: Server component (`page.tsx`) fetches data via `getPredictions()`, passes to client component.
* **Key Features**:
  - **Search**: Full-text search across configurable columns (date, ampere, hours, period, range).
  - **Column Filter**: Dropdown checkbox menu to select which columns are searchable.
  - **Pagination**: 10 items per page with previous/next navigation.
  - **Selection**: Individual and select-all checkboxes for batch operations.
  - **Export**: Download as CSV or PDF (uses `jsPDF` + `jspdf-autotable`). Filenames include date range.
  - **Deletion**: Single, selected, or all — each with AlertDialog confirmation.
  - All delete operations use server actions with path revalidation.

#### `src/app/[locale]/(app)/settings/page.tsx`
* **Path**: [settings/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28app%29/settings/page.tsx)
* **Directive**: `"use client"`
* **Purpose**: User settings page with three sections: Profile, Security, Preferences.
* **Sections**:
  1. **Profile**: Edit display name (via `updateUser()`). Email displayed but non-editable.
  2. **Security**: Change password (current + new + confirm) via `changePassword()` with `revokeOtherSessions: true`.
  3. **Preferences**: Language switcher (English/Indonesian) using locale routing.
* **Layout**: Mobile — tabs navigation. Desktop — bento grid (profile 2-col, preferences 1-col, security full-width).

---

### Route Group: `(admin)` — Admin Panel

#### `src/app/[locale]/(admin)/layout.tsx`
* **Path**: [(admin)/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28admin%29/layout.tsx)
* **Purpose**: Admin layout with shared sidebar (identical structure to app layout).

#### `src/app/[locale]/(admin)/admin/page.tsx`
* **Path**: [admin/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/%28admin%29/admin/page.tsx)
* **Purpose**: Server component rendering the admin panel. Restricted to users with `role === "admin"`.
* **Key Behaviors**:
  - Checks session role — returns "Access Denied" for non-admins.
  - Fetches all users, all predictions (with joined user names), and all sessions (with joined user names). Limited to 50 rows each.
  - Renders three table components: `<SessionsTable />`, `<PredictionsTable />`, `<UsersTable />`.
* **Metadata**: `"Admin Panel — ELPRESY"`.

---

## 11. Premium Headless UI Components (`src/components/ui/`)

These components wrap **Base UI** primitives. They provide accessible, zero-styled state machines with custom classes written in Tailwind CSS v4.

---

### UI Component 1: `accordion.tsx`
* **Path**: [src/components/ui/accordion.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/accordion.tsx)
* **Underlying Primitive**: `@base-ui/react/accordion`
* **Exposed Sub-Components**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.
* **Component Prop Interfaces & HTML Tags**:
  - `Accordion`: Wraps `AccordionPrimitive.Root` (`<div>` by default). Receives all `Root.Props`.
  - `AccordionItem`: Wraps `AccordionPrimitive.Item` (`<div>`). Receives `Item.Props`.
  - `AccordionTrigger`: Wraps `AccordionPrimitive.Trigger` (`<button>`). Receives `Trigger.Props`.
  - `AccordionContent`: Wraps `AccordionPrimitive.Panel` (`<div>`). Receives `Panel.Props`.
* **Key Styling**:
  - Item: `not-last:border-b data-open:bg-muted/50`.
  - Trigger: Contains Lucide chevron icons that toggle via `group-aria-expanded/accordion-trigger:hidden`.
  - Content: Smooth height animation via `animate-accordion-down` / `animate-accordion-up` and CSS variable `--accordion-panel-height`.

---

### UI Component 2: `alert-dialog.tsx`
* **Path**: [src/components/ui/alert-dialog.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/alert-dialog.tsx)
* **Underlying Primitive**: `@base-ui/react/alert-dialog`
* **Exposed Sub-Components**: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogMedia`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`.
* **Custom Attributes**:
  - `AlertDialogContent`: `size?: "default" | "sm"` — controls max-width (`xs`/`64` at base, `sm` at desktop).
* **Key Styling**:
  - Overlay: Fixed black/80 with backdrop blur, fade in/out transitions.
  - Content: Centered modal with zoom + fade animations.
  - Header: CSS Grid with `has-data-[slot=...]` selectors for adaptive layouts.
  - Action: Renders as `<Button>`. Cancel: Renders via `render={<Button variant="outline" />}` using polymorphic rendering.

---

### UI Component 3: `badge.tsx`
* **Path**: [src/components/ui/badge.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/badge.tsx)
* **Underlying Primitive**: Uses Base UI `useRender` and `mergeProps`.
* **Variants**: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.
* **Polymorphic Rendering**: Uses `useRender` hook with `defaultTagName: "span"`, allowing render prop overrides (e.g. `render={<a href="#" />}`).

---

### UI Component 4: `button.tsx`
* **Path**: [src/components/ui/button.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/button.tsx)
* **Underlying Primitive**: `@base-ui/react/button`
* **Variants**: `default` (gold), `outline`, `secondary`, `ghost`, `destructive`, `link`.
* **Sizes**: `default` (h-7), `xs` (h-5), `sm` (h-6), `lg` (h-8), `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
* **Micro-interactions**: `active:not-aria-[haspopup]:translate-y-px` (1px press feedback), auto SVG sizing.

---

### UI Component 5: `card.tsx`
* **Path**: [src/components/ui/card.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/card.tsx)
* **Exposed Sub-Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.
* **Custom**: `size?: "default" | "sm"`. Uses CSS Ring borders, Container Queries for adaptive header layout, auto image rounding.

---

### UI Component 6: `dropdown-menu.tsx`
* **Path**: [src/components/ui/dropdown-menu.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/dropdown-menu.tsx)
* **Underlying Primitive**: `@base-ui/react/menu`
* **Exposed Sub-Components**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`.
* **Custom Attributes**:
  - `DropdownMenuContent`: `align`, `alignOffset`, `side`, `sideOffset` props forwarded to `Positioner`.
  - `DropdownMenuItem`: `variant?: "default" | "destructive"`, `inset?: boolean`.
* **Key Styling**: Zoom + fade animations on open/close, directional slide-in based on `data-[side=...]`, popover background with ring border.

---

### UI Component 7: `numeric-stepper.tsx`
* **Path**: [src/components/ui/numeric-stepper.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/numeric-stepper.tsx)
* **Underlying Primitive**: Pure React HTML structure (custom component).
* **Props**: `id`, `value`, `min`, `max`, `step`, `unit`, `onChange`, `disabled`, `className`.
* **Key Features**:
  - Float precision: Calculates decimal places from `step` prop to prevent floating point errors.
  - Three-part layout: Decrement button | Number input + unit | Increment button.
  - Hides native browser spinners via `[appearance:textfield]` and `-webkit-inner-spin-button`.

---

### UI Component 8: `separator.tsx`
* **Path**: [src/components/ui/separator.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/separator.tsx)
* **Underlying Primitive**: `@base-ui/react/separator`
* **Orientation**: `"horizontal"` (default) or `"vertical"`. Dynamic sizing via `data-horizontal` / `data-vertical` selectors.

---

### UI Component 9: `sheet.tsx`
* **Path**: [src/components/ui/sheet.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/sheet.tsx)
* **Underlying Primitive**: `@base-ui/react/dialog` (polymorphically styled as drawer).
* **Exposed Sub-Components**: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`.
* **Custom**: `side?: "top" | "right" | "bottom" | "left"`, `showCloseButton?: boolean`.
* **Key Styling**: Multi-directional slide animations, glassmorphic backdrop overlay.

---

### UI Component 10: `sonner.tsx`
* **Path**: [src/components/ui/sonner.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/sonner.tsx)
* **Underlying Primitive**: `sonner` library + `next-themes`.
* **Purpose**: Themed toast notification provider with custom Lucide icons for each type (success, info, warning, error, loading).
* **Styling**: Uses CSS variables mapped to design system tokens (popover background/foreground, border, radius).

---

### UI Component 11: `tabs.tsx`
* **Path**: [src/components/ui/tabs.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/tabs.tsx)
* **Underlying Primitive**: `@base-ui/react/tabs`
* **Exposed Sub-Components**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
* **Variants**: `TabsList` supports `default` (segmented pill) and `line` (underline border) styles.
* **Key Styling**: Dynamic flex orientations via `data-horizontal:flex-col`, custom active indicator line using `::after` pseudo-element.

---

## 12. Dashboard Components (`src/components/dashboard/`)

### `dashboard.tsx` (Dashboard Shell)
* **Path**: [src/components/dashboard/dashboard.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/dashboard.tsx)
* **Directive**: `"use client"`
* **Purpose**: Client component that receives prediction data and renders the complete dashboard view.
* **Layout**: Vertical stack with header, stat cards, then a 5-column grid (2 cols for charts, 3 cols for history).
* **Derived Data**:
  - Sorts predictions by date for trend data (ascending) and display (descending).
  - Computes stats: total count, last prediction range, last prediction date.
  - Extracts chart data from latest prediction for inline preview.

### `layout/sidebar.tsx` (App Sidebar Navigation)
* **Path**: [src/components/dashboard/layout/sidebar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/layout/sidebar.tsx)
* **Directive**: `"use client"`
* **Purpose**: Responsive sidebar navigation shared across app and admin layouts.
* **Navigation Items**: Dashboard, New Prediction, History, Settings, + Admin (conditionally if `role === "admin"`).
* **Desktop Sidebar**:
  - Fixed `w-16` collapsed, expands to `w-64` on hover (`transition-[width] duration-300`).
  - Text labels hidden by default, revealed via `group-hover/sidebar:opacity-100`.
  - Active indicator: Gold left border bar + gold background tint.
* **Mobile Top Bar**:
  - Fixed header with logo + hamburger menu → opens `<Sheet side="left">` with full navigation.
* **Bottom Actions**: Log Out (red hover state), Back to Landing Page.
* **Authentication**: Uses `useSession()` to check admin role, `signOut()` for logout.

### `section/header.tsx` (Dashboard Header)
* **Path**: [src/components/dashboard/section/header.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/section/header.tsx)
* **Purpose**: Page header with title, "Model Active" badge, and "New Prediction" CTA button.

### `section/stats.tsx` (Stat Cards)
* **Path**: [src/components/dashboard/section/stats.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/section/stats.tsx)
* **Purpose**: Three-column grid of stat cards showing: Total Predictions, Last Range (gold accent), Last Date.
* **Key Styling**: Gold glow on hover, icon in a bordered container, uppercase tracking-widest labels.

### `section/trend.tsx` (Trend Chart)
* **Path**: [src/components/dashboard/section/trend.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/section/trend.tsx)
* **Directive**: `"use client"`
* **Purpose**: Recharts `<AreaChart>` displaying prediction upper values over time.
* **Key Features**:
  - Gold gradient fill (`linearGradient` from 45% to 0% opacity).
  - Custom tooltip with glassmorphic styling.
  - Date formatting: `dd/mm` on X axis.
  - Empty state message when no data.

### `section/history.tsx` (Dashboard History Table)
* **Path**: [src/components/dashboard/section/history.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/section/history.tsx)
* **Purpose**: Compact recent predictions table for the dashboard view.

### `section/predict/` (Predict Sub-Components)
* **`predict-training.tsx`**: Training model type selector (pretrained vs simulated), month slider, generate data button, data statistics display.
* **`predict-input.tsx`**: Prediction input form with `<NumericStepper>` controls for ampere and hours, period type radio buttons, predict button.
* **`predict-result.tsx`**: Prediction results display with chart, stat cards (working days, average daily, per-month), and lower/upper bounds.

### `section/admin/` (Admin Tables)
* **`users-table.tsx`**: Client component displaying all registered users with role, creation date.
* **`predictions-table.tsx`**: Client component displaying all predictions with associated user names.
* **`sessions-table.tsx`**: Client component displaying all active sessions with user names, IP addresses, and expiration.

---

## 13. Prediction Chart Component

### `src/components/predict/result/chart.tsx`
* **Path**: [src/components/predict/result/chart.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/predict/result/chart.tsx)
* **Directive**: `"use client"`
* **Purpose**: Reusable Recharts `<AreaChart>` for day-by-day prediction data.
* **Key Features**:
  - Configurable height (default 160px).
  - X-axis shows week markers (`M1`, `M2`, ...) at 7-day intervals.
  - Gold gradient fill with monotone curve type.
  - Glassmorphic tooltip with day label.

---

## 14. Landing Page Blocks (`src/components/landing/`)

---

### Block 1: `about.tsx` (Author Block)
* **Path**: [src/components/landing/about.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/about.tsx)
* **Purpose**: Landing page author block with internationalized strings.
* **Contents**: Section `#about` with university logo background at 5% opacity, renders `<Profile t={t} />`.

---

### Block 2: `features.tsx` (Features Block)
* **Path**: [src/components/landing/features.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/features.tsx)
* **Purpose**: Renders technical feature highlights of the CART prediction model.
* **Contents**: Section `#features` combining `<Header t={t} />` + `<Grid t={t} />`.

---

### Block 3: `hero.tsx` (Hero Page Block)
* **Path**: [src/components/landing/hero.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/hero.tsx)
* **Purpose**: Core landing page with grid overlays, ambient gold glow, and two-column layout.
* **Layout**: Left column (typography + CTAs) + Right column (interactive ML simulator).

---

### Block 4: `preview.tsx` (Application Preview Block)
* **Path**: [src/components/landing/preview.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/preview.tsx)
* **Purpose**: Interactive preview of the application UI with virtual browser mockup.
* **Contents**: Section `#application` combining `<Header>`, `<Mockup>`, `<Proof>`.

---

### Block 5: `research.tsx` (Research & Explore Block)
* **Path**: [src/components/landing/research.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/research.tsx)
* **Purpose**: Research findings, CART methodology, and persona benefits.
* **Contents**: Section `#research` with `<Explore>` (accordions) and `<Discover>` (tabbed bento box).

---

### Block 6: `workflow.tsx` (Workflow Block)
* **Path**: [src/components/landing/workflow.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/workflow.tsx)
* **Purpose**: Three-step process walkthrough.
* **Contents**: Section `#workflow` combining `<Header>`, `<Steps>`, `<Powered>`.

---

### Block 7: `layout/navbar.tsx` (Header Navigation)
* **Path**: [src/components/landing/layout/navbar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/navbar.tsx)
* **Purpose**: Responsive header with scroll-based styling, language toggle, and IntersectionObserver active tracking.
* **Navigation Links**: `#thesis`, `#features`, `#workflow`, `#application`, `#research`, `#about`.
* **Scroll State**: Glassmorphic background + compressed padding when `scrollY > 20`.

---

### Block 8: `layout/footer.tsx` (Bottom Layout Footer)
* **Path**: [src/components/landing/layout/footer.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/footer.tsx)
* **Purpose**: Footer with neon gold top border (gradient line + blur halo).

---

## 15. Landing Page Section Components (`src/components/landing/section/`)

### `author/profile.tsx`
* Renders researcher profile card with glassmorphic background and gold gradient top border.

### `features/header.tsx` + `features/grid.tsx`
* Header: Left-aligned constrained title. Grid: 4-column bento layout with large engine card (2×2 span), hover radial gold highlights, and decorative CART tree bars.

### `footer/content.tsx` + `footer/mobile.tsx`
* Desktop footer (hidden on mobile) and mobile footer (hidden on desktop). Both display credit text with ELPRESY branding.

### `hero/background.tsx`
* `<Background>`: Subtle grid pattern via CSS linear gradients (3% opacity). `<Ambient>`: 500×500 gold blur circle pulsing continuously.

### `hero/content/left.tsx`
* Gradient headings (white → zinc, gold shimmer, gray), gold CTA button with glow shadow, ghost secondary button.

### `hero/content/right.tsx`
* **Most complex landing component**: Client-side ML simulator with `DecisionTreeRegression`, SVG bezier chart (`buildPath`), `NumericStepper`, collapsible grid-rows accordions.

### `navbar/logo.tsx`, `navbar/desktop.tsx`, `navbar/actions.tsx`, `navbar/mobile.tsx`
* Logo with Zap icon, desktop nav with IntersectionObserver, language globe switcher + CTA, mobile sheet menu.

### `preview/app.tsx`, `preview/header.tsx`, `preview/mockup.tsx`, `preview/proof.tsx`
* Tab-based app preview (Dashboard, Predict, Logs, Settings), section title, glassmorphic browser chrome, trust markers.

### `preview/app/dashboard.tsx`, `preview/app/prediction.tsx`, `preview/app/history.tsx`, `preview/app/settings.tsx`
* Static visual mockups of the actual application pages: stat cards, SVG chart, prediction form, search table, CART hyperparameters.

### `research/discover.tsx` + `research/explore.tsx`
* Persona tabs bento grid with dynamic seeded images + FAQ accordion panel with custom chevron rotation.

### `workflow/header.tsx`, `workflow/powered.tsx`, `workflow/steps.tsx`
* Section title, CART model badge, three-step process cards with connecting dashed gold line.

---

## 16. Environment Variables

The application requires the following environment variables (stored in `.env.local`):

| Variable                     | Purpose                                      |
|------------------------------|----------------------------------------------|
| `DATABASE_URL`               | PostgreSQL connection string for Drizzle ORM |
| `BETTER_AUTH_SECRET`         | Secret key for Better Auth session signing   |
| `BETTER_AUTH_URL`            | Base URL for Better Auth server-side config  |
| `NEXT_PUBLIC_BETTER_AUTH_URL`| Base URL for Better Auth client-side config  |

---

## 17. Developer Guide & Usage Reference

### Running the Application
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run Biome linter
pnpm format     # Format code with Biome
```

### Database Setup
```bash
# Push schema to database
npx drizzle-kit push

# Generate migration
npx drizzle-kit generate

# Run migration
npx drizzle-kit migrate

# Promote a user to admin
npx tsx src/lib/db/seed-admin.ts
```

### Adding New App Pages
1. Create a new directory under `src/app/[locale]/(app)/your-page/`.
2. Add `page.tsx` — the route is automatically protected by middleware.
3. Update the `NAV_ITEMS` array in [sidebar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/dashboard/layout/sidebar.tsx).
4. Add translation keys to `messages/en.json` and `messages/id.json`.

### Adding New Landing Sections
1. Create a new component in `src/components/landing/`.
2. Add it to the page composition in [page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/page.tsx).
3. Update the `Links` array in [navbar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/navbar.tsx).

### Using Server Actions
```tsx
import { savePrediction, getPredictions, deletePrediction } from "@/app/actions/predictions";

// Save a prediction (requires authentication)
const result = await savePrediction({
  amperePerCycle: 8.0,
  dailyUsageHours: 9,
  predictionPeriod: 22,
  resultLower: 64.8,
  resultUpper: 79.2,
  chartData: [{ day: 1, ampere: 72.0 }, ...],
});

// Get all predictions for current user
const predictions = await getPredictions();

// Delete a prediction
await deletePrediction("uuid-here");
```

### Using Authentication Hooks
```tsx
import { signIn, signUp, signOut, useSession, updateUser, changePassword } from "@/lib/auth-client";

// Check session
const { data: session, isPending } = useSession();

// Sign in
await signIn.email({ email, password, callbackURL: "/dashboard" });

// Sign up
await signUp.email({ name, email, password, callbackURL: "/dashboard" });

// Sign out
await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });

// Update profile
await updateUser({ name: "New Name" });

// Change password
await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
```

### Utilizing Headless UI Components

#### Button Usage
```tsx
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

<Button variant="default" size="lg" onClick={handleSave}>
  <PlusIcon /> {/* Sized automatically to 4x4 */}
  <span>Save Prediction</span>
</Button>
```

#### Badge Usage
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="outline">CART Hyperparameter</Badge>
<Badge variant="link" render={<a href="https://github.com" target="_blank" />}>View Source</Badge>
```

#### Sheet Panel Usage
```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger>Open Drawer</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Log Details</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

#### Alert Dialog Usage
```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Dropdown Menu Usage
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>Options</DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    <DropdownMenuCheckboxItem checked={true} onCheckedChange={handleChange}>
      Show Column
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Numeric Stepper Usage
```tsx
import { NumericStepper } from "@/components/ui/numeric-stepper";

<NumericStepper
  id="ampere"
  value={8.0}
  min={0.1}
  max={50}
  step={0.1}
  unit="A"
  onChange={setAmpere}
/>
```
