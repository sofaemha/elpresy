# DESIGN.md — ELPRESY Design System

> **Authority:** This document is the single source of truth for all visual, structural, and behavioral decisions on the ELPRESY landing page. When generating code or UI, treat every rule here as a hard constraint unless explicitly marked as `[OPEN DECISION]`. Do not invent, assume, or hallucinate values for unmarked entries.

---

## 1. Product Definition

**Product:** ELPRESY (Electrical Predictions System)
**Type:** Machine learning-powered web application
**Function:** Predicts daily AC ampere usage
**Context:** Indonesian undergraduate thesis project (Skripsi)

**Design mandate:** The interface must communicate technical credibility, analytical precision, and premium execution. It must be suitable for academic evaluation while remaining immediately comprehensible to a technical audience. Generic AI SaaS aesthetics are prohibited — if a generated component resembles a startup template, it must be redesigned.

---

## 2. Theme and Atmosphere

| Property | Specification |
|----------|---------------|
| Mode | Dark-mode exclusive. No light theme. |
| Density | Spacious and breathable. Use large paddings (`pt-20`), full-height sections (`min-h-[100dvh]`), and container-based width constraints (`container mx-auto px-6`). |
| Mood | Luxurious and analytical. Deep black backgrounds paired with luminous gold accents must communicate high value, precision, and data-driven intelligence. |
| Atmosphere | Dynamic but restrained. Ambient components (`<Background />`, `<Ambient />`) and custom animations (`gold-shimmer`, `pulse-gold`) create a subtle "breathing" quality. Effects must not overwhelm content. |
| Benchmark | Bloomberg Terminal meets Rolex website — precision and premium coexist. |

---

## 3. Color System

### 3.1 CSS Custom Properties

All color values below are active in the project's CSS token layer. Use the token name in Tailwind when available; use the raw value only when a utility is not available.

#### Base Surfaces

| Token | Value | Role |
|-------|-------|------|
| `--background` / `--color-bg` | `#09090B` | Primary app background (dominant canvas) |
| `--card` / `--popover` / `--color-surface` | `#111113` | Elevated surfaces: cards, popovers |
| `--secondary` / `--muted` / `--accent` / `--color-surface-2` | `#18181B` | Secondary surfaces, muted panels, contrast layers |

#### Gold Accent Family

| Token | Value | Role |
|-------|-------|------|
| `--primary` / `--color-gold` | `#C9A84C` | Core brand color. Primary buttons, active states, key branding elements. |
| `--color-gold-light` | `#F5C842` | Hover states, shimmer gradients, intense highlights. |
| `--color-gold-dark` | `#9A7A2E` | Shadow depth, inactive gold states. |
| `--border` / `--input` / `--color-border-gold` | `rgba(201, 168, 76, 0.15)` | Subtle border and input outlines. Replaces neutral gray in premium contexts. |
| `--ring` / `--color-border-gold-hover` | `rgba(201, 168, 76, 0.35)` | Focus rings and hover border glow. |

Additional reference accent (from design DNA): `#D4AF37`.

#### Text Colors

| Token | Value | Role |
|-------|-------|------|
| `--foreground` / `--color-text-primary` | `#FAFAFA` | Primary reading text, high-contrast foregrounds. |
| `--muted-foreground` / `--color-text-muted` | `#A1A1AA` | Descriptions, secondary labels, supporting copy. |
| `--color-text-faint` | `#52525B` | Disabled states, watermarks, low-priority metadata. |

#### Functional Colors

| Token | Value | Role |
|-------|-------|------|
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error states, destructive actions only. |

### 3.2 Color Usage Rules

- `#09090B` is the dominant canvas. It must remain the primary background at all times.
- Gold accents must function as emphasis signals, not flood-fill. Overuse degrades the premium quality.
- All borders and outlines default to the faint gold token (`rgba(201, 168, 76, 0.15)`) rather than neutral gray.
- Focus rings use the glowing gold token (`rgba(201, 168, 76, 0.35)`).
- Destructive states must use `--destructive` exclusively — never approximate with gold variants.
- A light mode is not defined. Do not introduce light-mode assumptions into any component.
- Text selection overrides the browser default: use `selection:bg-gold/30` with white text (`selection:text-white`).

---

## 4. Typography System

### 4.1 Typefaces

| Font | CSS Variable | Role |
|------|-------------|------|
| Space Grotesk | `--font-space-grotesk` | Display text, section headings, hero headlines, primary data figures. |
| DM Sans | `--font-dm-sans` | Body copy, button labels, navigation items, descriptions, UI labels, dense text. |

### 4.2 Typography Rules

- **Space Grotesk** is reserved for high-hierarchy type: hero headings, section titles, large numeric data displays.
- **DM Sans** governs all remaining text including body paragraphs, navigation, buttons, helper text, and microcopy. `text-xs/relaxed` is used heavily in button and label contexts.
- Do not substitute fonts. Do not introduce a third typeface.
- Typography must feel editorial and precise — not oversized for spectacle.
- Text blocks require comfortable line length and generous line height. Cramped stacking is prohibited.

---

## 5. Spacing and Layout

### 5.1 Spatial Rules

- Sections must use full-height viewports where appropriate: `min-h-[100dvh]`.
- Top padding should be generous: reference `pt-20` as the standard section start.
- Container widths are constrained and centered: `container mx-auto px-6`.
- Spacing must let the dark background breathe — negative space is an active visual element, not wasted area.

### 5.2 Grid and Composition

- Standard responsive grid: `grid lg:grid-cols-2 gap-16`. Desktop two-column layouts stack naturally on mobile.
- Avoid mechanically symmetric or centered-everything compositions.
- Asymmetric and offset layouts are preferred when they improve editorial sophistication.
- Do not use cookie-cutter three-column feature grids.

### 5.3 Responsive Range

- All components must be fully responsive from **375px to 1440px+**.
- Mobile-first implementation is required.
- Desktop breakpoints should add structure and spatial expansion, not merely scale up the mobile layout.

### 5.4 Scroll Behavior

- Smooth scrolling is enforced at the document level via `scroll-smooth` and `data-scroll-behavior="smooth"`.
- This must not be removed unless a documented performance or accessibility justification is provided.

---

## 6. Shape and Surface System

### 6.1 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` | Baseline radius for standard components |
| `--radius-4xl` | `~1.625rem` (`2.6 * --radius`) | Larger layout containers, prominent cards |

- Standard interactive components use `rounded-md` (maps to ~`0.5rem` in this system).
- Shape language must remain consistent. Do not mix sharp squares with heavy pill shapes without intentional reason.

### 6.2 Surface Layering

Surfaces are stacked across three distinct dark layers:

1. **Base canvas** — `#09090B` (Deep Space Black): the full-page background.
2. **Elevated surface** — `#111113` (Charcoal Black): cards, popovers, interactive panels.
3. **Secondary surface** — `#18181B` (Matte Black): muted zones, secondary controls, low-contrast layers.

All surfaces default to `border-border` (faint gold). Borders define material boundaries; they are not decorative.

### 6.3 Shadows

- Shadows are permitted only as warm amber-tinted glows on key interactive elements.
- Shadows are **not decorative**. They must communicate elevation, emphasis, or active state.
- Decorative glow blobs are explicitly prohibited.

---

## 7. Component Specifications

### 7.1 Buttons

| Property | Specification |
|----------|---------------|
| Primitive | `@base-ui/react/button` |
| Shape | `rounded-md` |
| Primary style | `bg-primary` (Muted Gold `#C9A84C`) with black text |
| Outline style | Faint Gold border (`border-border`), glows to `--ring` on hover |
| Transition | `transition-all` |
| Active feedback | `active:translate-y-px` |
| Focus ring | `focus-visible:ring-ring/30` (Glowing Gold) |

**Prohibited button patterns:**
- Gradient fills on buttons — hard prohibition.
- Neon or saturated glow effects on buttons.

### 7.2 Cards and Containers

| Property | Specification |
|----------|---------------|
| Background | `#111113` (Charcoal Black) |
| Border | `border-border` (Faint Gold `rgba(201, 168, 76, 0.15)`) |
| Radius | `--radius` (`0.625rem`) baseline; `--radius-4xl` for larger containers |

Cards achieve elevation through surface color contrast and border quality, not through heavy shadows or glossy treatments.

### 7.3 Animations

| Class | Behavior | Usage |
|-------|----------|-------|
| `.gold-shimmer` | Moving linear gradient across text — metallic shine effect | Headline text, key callouts |
| `.animate-pulse-gold` | Slow opacity fade between 8% and 18% | Ambient backgrounds, glowing indicators |

**Animation rules:**
- All animations must respect `prefers-reduced-motion` — implement `@media (prefers-reduced-motion: reduce)` overrides unconditionally.
- Fade-in on scroll and smooth hover transitions are approved patterns.
- Motion must serve hierarchy, atmosphere, or state feedback. Purely decorative animation is prohibited.

### 7.4 Background and Ambient Components

Visual layer sub-components (`<Background />`, `<Ambient />`) are architectural elements, not styling shortcuts. They must:
- be implemented as dedicated sub-components (typically in `background.tsx`),
- sit below all content layers without reducing text legibility,
- be isolated from content and state logic per the Shell & Section pattern.

---

## 8. Architecture and File Organization

### 8.1 Framework and Tooling

| Layer | Specification |
|-------|---------------|
| Framework | Next.js 16 App Router, `src/app` directory |
| Language | TypeScript — strict mode, no `any` |
| Styling | Tailwind CSS v4 — utility classes only, no raw inline styles |
| Component library | shadcn/ui + Base UI (Mira style) |
| i18n | `next-intl`, locale-based routing at `src/app/[locale]/`, i18n config at `src/i18n/` |

### 8.2 Folder Structure

| Path | Contents |
|------|----------|
| `src/components/ui/` | Low-level primitives: buttons, cards, badges |
| `src/components/landing/layout/` | Reusable layout components persisting across pages (Navbar, Footer) |
| `src/components/landing/` | Page-specific section root files |
| `src/components/landing/section/[parent]/[sub].tsx` | Sub-components for complex sections |
| `src/components/landing/section/[parent]/content/[sub].tsx` | Deep sub-components for high-complexity sections |

**Example:** `src/components/landing/section/hero/content/left.tsx`

### 8.3 Shell & Section Pattern

All complex sections must follow this pattern:

**Shell responsibilities (main section file):**
- Add `"use client"` only when hooks or event listeners are required.
- Fetch translations: `const t = useTranslations("namespace")`.
- Manage high-level state (scroll position, menu toggle, etc.).
- Define the layout grid and orchestrate sub-components.

**Section breakdown categories:**
- Visual: `Background`, `Ambient`, `Gradients` → typically `background.tsx`
- Content: `Left`, `Right`, `Actions`, `Logo`
- Responsive nav: `Desktop`, `Mobile`

### 8.4 Naming Conventions

| Target | Convention | Example |
|--------|-----------|---------|
| Component filenames | Strictly lowercase | `hero.tsx`, `navbar.tsx` |
| Component functions and imports | PascalCase | `export default function Navbar()` |
| State variables and handlers | camelCase | `scrolled`, `handleScroll`, `toggleLocale` |
| Static data arrays/objects | PascalCase | `const Links = [...]` |
| Translation access | `const t = useTranslations("namespace")` | — |

### 8.5 Import Order

Imports must follow this order in every file:
1. React hooks (`useState`, `useEffect`)
2. Next-Intl and navigation (`useLocale`, `useTranslations`, `useRouter`)
3. Local sub-components — sorted by visual hierarchy: Background → Content → Utility
4. External libraries and assets

---

## 9. Localization Rules

- `next-intl` is required for all user-facing strings in every new section.
- Fetch `t` once in the parent shell: `const t = useTranslations("namespace")`.
- Pass `t` down to children that require it as a prop — do not call `useTranslations` redundantly in child components.
- Centralize locale toggle handlers (`toggleLocale`) in the parent shell and pass them to children as props.

```tsx
// Parent shell
const t = useTranslations("hero");
<Left t={t} />
<Actions toggleLocale={toggleLocale} t={t} />

// Child
export default function Left({ t }: { t: ReturnType<typeof useTranslations> }) {
  return <h1>{t("title")}</h1>;
}
```

---

## 10. Semantic HTML Requirements

Every section must use correct semantic HTML elements:

| Element | Usage |
|---------|-------|
| `<header>` | Page or section header |
| `<nav>` | Navigation blocks |
| `<main>` | Primary page content wrapper |
| `<section>` | Distinct content sections |
| `<footer>` | Page footer |

Semantic structure is a non-negotiable implementation quality requirement, not an aesthetic preference.

---

## 11. Code Generation Rules

When generating code for this project, enforce the following without exception:

1. Output complete, production-ready code — never truncate with comments like `// rest of code here`.
2. Label every file with its full path on line 1: `// filepath: src/components/landing/hero.tsx`.
3. Use strict TypeScript — `any` is prohibited.
4. All components must be fully responsive from 375px to 1440px+.
5. All animations must include `prefers-reduced-motion` overrides.
6. Use Tailwind CSS v4 utility classes exclusively — no raw inline styles.
7. All sections must use semantic HTML.
8. After generating code, append a `## What was generated` summary section.

---

## 12. Prohibited Patterns

The following are hard prohibitions. They must not appear in any generated design or code, regardless of context:

- Gradient-fill buttons
- Glowing decorative blobs (ambient glow as background art)
- Centered-everything layouts as a recurring structural pattern
- Icon-in-colored-circle badge patterns
- Cookie-cutter three-column feature grids
- Generic AI SaaS visual shorthand (neural network backgrounds, floating orbs, etc.)
- Raw inline styles
- Light-mode color assumptions in dark-exclusive components
- `any` types in TypeScript
- Truncated or incomplete code output

---

## 13. Section-Level Design Guidance

### Navbar
- Persistent across pages. Must feel structured and refined, not oversized or promotional.
- Implement `Desktop` and `Mobile` as separate sub-components when the menu includes interactive elements (locale toggle, mobile drawer).
- Scroll state management (`scrolled`, `handleScroll`) belongs in the shell.

### Hero
- The primary expression of the design system. Must combine Space Grotesk display type, ambient background treatment, and spacious two-column layout.
- Reference grid: `grid lg:grid-cols-2 gap-16`, stacking to single column on mobile.
- Sub-component structure: `Background` (ambient layer) + `Left` (headline, CTA) + `Right` (visual/data element).

### Feature / Supporting Sections
- Must not use default three-column grids.
- Preferred alternatives: editorial split layouts, staggered card rows, asymmetric content modules, timeline-style explanation blocks.
- Each section must maintain the spatial breathing room established by the spacing system.

### Cards
- Elevated via surface color contrast (`#111113` vs `#09090B`) and faint gold borders.
- Do not compensate for weak hierarchy with heavy shadows or glossy surfaces.

### Footer
- Inherits the full dark premium system. Must not resemble a generic boilerplate footer.
- Uses the same semantic, typographic, and border conventions as all other sections.

---

## 14. Open Decisions

The following items are **not defined** in the source project files. Do not fabricate values for these. Either request clarification from the project owner or treat the relevant section as configurable:

- `[OPEN DECISION]` Official brand voice and copywriting tone
- `[OPEN DECISION]` Final landing page section list and information architecture
- `[OPEN DECISION]` Primary target audience (academic reviewers vs. public users vs. hybrid)
- `[OPEN DECISION]` Prediction methodology details and validated accuracy metrics
- `[OPEN DECISION]` Dataset scope and provenance
- `[OPEN DECISION]` Legal or privacy messaging requirements
- `[OPEN DECISION]` Full typographic scale (exact size ramp, line-height tokens per heading level)
- `[OPEN DECISION]` Chart and data-visualization style rules
- `[OPEN DECISION]` Logo construction and clear-space rules
- `[OPEN DECISION]` Final CTA wording and conversion goal
- `[OPEN DECISION]` Primary language scope: Indonesian, English, or bilingual

---

## 15. Implementation Checklist

Use this checklist before finalizing any generated section or component:

**Visual:**
- [ ] Dark-mode exclusive — no light-mode surface assumptions
- [ ] Background uses `#09090B`; cards use `#111113`; secondary layers use `#18181B`
- [ ] Gold accent applied with restraint as emphasis, not flood-fill
- [ ] All borders use faint gold token (`rgba(201, 168, 76, 0.15)`)
- [ ] Focus rings use glowing gold token (`rgba(201, 168, 76, 0.35)`)
- [ ] Shadows are functional (elevation/state), not decorative

**Typography:**
- [ ] Space Grotesk for display/headings only
- [ ] DM Sans for body, UI, and microcopy
- [ ] Text selection overrides browser default with `selection:bg-gold/30 selection:text-white`

**Motion:**
- [ ] All animations have `prefers-reduced-motion` override
- [ ] No purely decorative animation loops

**Layout:**
- [ ] Mobile-first, responsive from 375px to 1440px+
- [ ] Generous spacing — sections breathe
- [ ] No centered-everything layout patterns
- [ ] No three-column cookie-cutter grids

**Architecture:**
- [ ] All filenames are lowercase
- [ ] Component functions use PascalCase
- [ ] State/handlers use camelCase
- [ ] Imports follow prescribed order
- [ ] Complex sections use Shell & Section pattern
- [ ] Background/ambient effects isolated in dedicated sub-components
- [ ] All strings use `next-intl`
- [ ] `t` and handlers passed as props from shell to children

**Code quality:**
- [ ] Strict TypeScript — no `any`
- [ ] Tailwind CSS v4 utilities only — no inline styles
- [ ] Semantic HTML structure enforced
- [ ] Complete, untruncated code output
- [ ] File path comment on line 1 of every generated file

---

## 16. Authority and Priority

When a conflict arises between rules or sources, apply this priority order:

1. Concrete, token-level rules from `PROJECT.md` (active implementation)
2. Visual DNA and hard prohibitions from `GUIDE.md` (non-negotiable constraints)
3. Structural and coding standards from `STRUCTURE.md` (architectural rules)
4. Accessibility, contrast, and semantic correctness (universal requirements)
5. If a detail is absent from all sources, mark it as `[OPEN DECISION]` — never invent a value
