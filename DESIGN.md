# Design System: ELPRESY

## 1. Visual Theme & Atmosphere
The application adopts a **premium, dark-mode exclusive aesthetic**. It aims to feel sophisticated, technological, and highly analytical (aligning with its purpose: Electrical Predictions System).
- **Density:** Spacious and breathable. Layouts utilize large paddings (`pt-20`), full-height sections (`min-h-[100dvh]`), and container-based constraints (`container mx-auto px-6`).
- **Mood:** Luxurious and technical. The deep space black backgrounds paired with luminous gold accents create a sense of high value, precision, and modern data-driven intelligence.
- **Atmosphere:** Dynamic but subtle. There are ambient background components (`<Background />`, `<Ambient />`) and custom CSS animations like `gold-shimmer` and `pulse-gold` that give the interface a "breathing", active feel without overwhelming the user.

## 2. Color Palette & Roles

### Base & Backgrounds
* **Deep Space Black** (`#09090B`): Used for the primary app background (`--background`, `--color-bg`).
* **Charcoal Black** (`#111113`): Used for elevated surfaces like cards and popovers (`--card`, `--popover`, `--color-surface`).
* **Matte Black** (`#18181B`): Used for secondary elements, muted backgrounds, and slight contrast layers (`--secondary`, `--muted`, `--accent`, `--color-surface-2`).

### Accents & Highlights
* **Muted Gold / Primary** (`#C9A84C`): The core brand color. Used for primary buttons, active states, and core branding elements (`--primary`, `--color-gold`).
* **Bright Gold** (`#F5C842`): Used for hover states, shimmer gradients, and intense highlights (`--color-gold-light`).
* **Deep Gold** (`#9A7A2E`): Used for deeper shadows or inactive gold states (`--color-gold-dark`).
* **Faint Gold** (`rgba(201, 168, 76, 0.15)`): Used for subtle borders and input outlines, giving them a slight premium tint instead of plain gray (`--border`, `--input`, `--color-border-gold`).
* **Glowing Gold** (`rgba(201, 168, 76, 0.35)`): Used for focus rings and hover borders (`--ring`, `--color-border-gold-hover`).

### Typography Colors
* **Off-White** (`#FAFAFA`): Used for primary text and high-contrast foregrounds (`--foreground`, `--color-text-primary`).
* **Cool Gray** (`#A1A1AA`): Used for muted text, descriptions, and secondary labels (`--muted-foreground`, `--color-text-muted`).
* **Dark Gray** (`#52525B`): Used for faint text, disabled states, or subtle watermarks (`--color-text-faint`).

### Functional Colors
* **Destructive Red** (`oklch(0.577 0.245 27.325)`): Used for error states and destructive actions (`--destructive`).

## 3. Typography Rules
The typography pairs a geometric display font with a highly legible sans-serif body font, reinforcing the technical yet accessible nature of the application.

* **Display/Headings (Space Grotesk):** 
  - Variable: `--font-space-grotesk`
  - Usage: Titles, hero headers, and primary data numbers. Provides a modern, slightly quirky, and highly technical appearance.
* **Body/UI Text (DM Sans):**
  - Variable: `--font-dm-sans`
  - Usage: Body copy, button labels, descriptions, and general UI text. Ensures maximum readability at small sizes (`text-xs/relaxed` used heavily in buttons).
* **Selection:** Text selection is customized to use a translucent gold background (`selection:bg-gold/30`) with white text, overriding default browser blue.

## 4. Component Stylings

* **Buttons:**
  - **Shape:** Gently rounded (`rounded-md`, which maps to `0.8 * 0.625rem = 0.5rem`).
  - **Style:** Utilizes Base UI primitives (`@base-ui/react/button`). Primary buttons use solid Muted Gold (`bg-primary`) with black text. Outline buttons use Faint Gold borders that glow on hover.
  - **Interaction:** Uses `transition-all` with subtle `active:translate-y-px` for physical feedback. Focus rings are customized to use Glowing Gold (`focus-visible:ring-ring/30`).
* **Containers/Cards:**
  - **Shape:** Standard components utilize a baseline radius of `0.625rem` (`--radius`), scaling up to `2.6 * radius` for larger layout elements (`--radius-4xl`).
  - **Borders:** All elements default to the Faint Gold border (`border-border`).
  - **Background:** Cards sit on `Charcoal Black`, providing subtle elevation from the `Deep Space Black` background.
* **Animations:**
  - **Shimmer:** A `.gold-shimmer` utility applies a moving linear gradient across text, creating a metallic shine effect.
  - **Pulse:** An `.animate-pulse-gold` utility slowly fades opacity between 8% and 18%, used for ambient backgrounds or glowing indicators.

## 5. Layout Principles

* **Architecture:** 
  - The project is built on Next.js App Router, using the `src/app` directory.
  - Internationalization (i18n) is integrated via `next-intl`, with routing handled in `src/i18n/` and locale-based pathing (`src/app/[locale]/`).
* **Grid & Structure:**
  - Responsive grids are standard (`grid lg:grid-cols-2 gap-16`), optimizing for large desktop displays while stacking naturally on mobile.
  - The UI uses Tailwind CSS v4 features (inline themes, `@custom-variant`, `@import "tailwindcss"`).
* **Component Organization:**
  - `src/components/ui/`: Contains low-level primitives (buttons, cards, badges) built with shadcn/ui and Base UI (Mira style).
  - `src/components/landing/`: Contains complex, composed sections for the marketing/landing pages, broken down into atomic parts (e.g., `section/hero/content/left.tsx`).
* **Scroll & Viewport:**
  - Smooth scrolling is enforced at the document level (`scroll-smooth`, `data-scroll-behavior="smooth"`).
