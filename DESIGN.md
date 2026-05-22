# DESIGN.md

## Product Context

**ELPRESY** (Electrical Predictions System) is a machine learning-powered web application for predicting daily AC ampere usage, presented as an Indonesian undergraduate thesis project (Skripsi). The design must communicate technical credibility, analytical clarity, and premium execution without drifting into exaggerated startup aesthetics or unsupported academic claims. [file:18][file:21]

The current project design is now more concretely defined than before. `PROJECT.md` establishes the active design system already reflected in the implementation, while `GUIDE.md` defines the original design DNA and non-negotiable visual prohibitions, and `STRUCTURE.md` defines the architectural and code organization standards that the UI should continue to follow. This document merges those three sources into one authoritative design specification. [file:18][file:19][file:21]

Where the project files provide explicit implementation facts, those facts are treated as fixed rules. Where they do not define something precisely, this document marks it as an open or configurable decision rather than fabricating specifics. [file:18][file:19][file:21]

## Design Positioning

### Core Experience
The application uses a **premium, dark-mode exclusive aesthetic** that is intended to feel sophisticated, technological, and highly analytical. The design direction combines luxury cues with machine-precision cues so the product feels refined, credible, and data-oriented rather than casual, playful, or generic. [file:21]

The original design DNA remains fully relevant: dominant deep black, gold and amber accents, Space Grotesk plus DM Sans typography, generous editorial spacing, subtle gold borders, and restrained motion. The benchmark mood remains “Bloomberg Terminal meets Rolex website,” which means precision and premium polish must coexist in the interface. [file:18]

### Brand Character
The interface should consistently feel:
- **Premium**: achieved through restraint, spacing, typography, and surface quality. [file:18][file:21]
- **Technical**: achieved through structured layouts, clear hierarchy, data-forward presentation, and disciplined interaction behavior. [file:18][file:21]
- **Analytical**: achieved through compositional clarity and avoidance of decorative clutter. [file:21]
- **Serious**: appropriate for an academic and technical product rather than a speculative AI concept page. [file:18][file:21]

### Dark Mode Policy
The project is explicitly **dark-mode exclusive**. This is not a dual-theme system with a light alternative defined in the provided files. Any future addition of a light theme would require separate design token rules and contrast auditing because current color roles are authored around dark surfaces and gold emphasis. [file:21]

## Visual Theme and Atmosphere

### Atmosphere
The interface should feel spacious, breathable, and immersive. `PROJECT.md` defines layouts with large paddings such as `pt-20`, full-height sections like `min-h-[100dvh]`, and centered container constraints such as `container mx-auto px-6`, which together create a composed and premium visual rhythm. [file:21]

Ambient visual behavior is part of the current design language. Background components such as `<Background />` and `<Ambient />`, along with custom CSS animations like `gold-shimmer` and `pulse-gold`, create a subtle “breathing” effect that makes the page feel active without becoming flashy or noisy. [file:21]

### Density
The intended density is **spacious and breathable**, not compact or dashboard-cramped. Elements should have room to sit independently so the dark background contributes to hierarchy rather than becoming empty filler. [file:18][file:21]

### Luxury Without Excess
Luxury here does not mean ornament overload. It means strong contrast, careful material layering, refined borders, thoughtful glow usage, disciplined typography, and deliberate spacing. Decorative excess, especially effects that imitate common AI SaaS marketing patterns, should be avoided. [file:18][file:21]

## Color System

The current project design provides a much more concrete palette than the earlier source files. These values should be treated as the current working token system.

### Base and Background Colors

| Role | Token / Meaning | Value |
|------|------------------|-------|
| Primary app background | Deep Space Black | `#09090B` [file:21] |
| Elevated surfaces | Charcoal Black | `#111113` [file:21] |
| Secondary / muted surfaces | Matte Black | `#18181B` [file:21] |

#### Usage Rules
- **Deep Space Black (`#09090B`)** is the dominant canvas and should remain the main field for the application and landing experience. [file:18][file:21]
- **Charcoal Black (`#111113`)** should be used for elevated surfaces such as cards and popovers so they separate subtly from the primary background. [file:21]
- **Matte Black (`#18181B`)** should support secondary layers, muted panels, or UI zones that need slight tonal distinction without disrupting the dark hierarchy. [file:21]

### Gold and Highlight Colors

| Role | Token / Meaning | Value |
|------|------------------|-------|
| Core brand / primary gold | Muted Gold | `#C9A84C` [file:18][file:21] |
| Bright highlight gold | Bright Gold | `#F5C842` [file:18][file:21] |
| Deep shadow gold | Deep Gold | `#9A7A2E` [file:21] |
| Subtle border gold | Faint Gold | `rgba(201, 168, 76, 0.15)` [file:21] |
| Hover / ring glow gold | Glowing Gold | `rgba(201, 168, 76, 0.35)` [file:21] |
| Additional accent reference | Gold variant | `#D4AF37` [file:18] |

#### Usage Rules
- `#C9A84C` is the main accent and should anchor brand emphasis, primary actions, and active states. [file:18][file:21]
- `#F5C842` should be reserved for brighter hover states, shimmer effects, and stronger highlights where more luminance is needed. [file:18][file:21]
- `#9A7A2E` can support shadow depth or less-active gold states, helping preserve tonal hierarchy inside the gold family. [file:21]
- Faint and glowing gold alpha values should define borders, outlines, hover states, and focus rings instead of neutral gray whenever premium emphasis is intended. [file:18][file:21]
- Gold should remain an accent system rather than becoming a dominant fill across large surfaces. Overuse weakens sophistication and makes the design feel loud. [file:18][file:21]

### Typography and Functional Colors

| Role | Value |
|------|-------|
| Primary text / foreground | `#FAFAFA` [file:21] |
| Muted text | `#A1A1AA` [file:21] |
| Faint / disabled text | `#52525B` [file:21] |
| Destructive state | `oklch(0.577 0.245 27.325)` [file:21] |

#### Usage Rules
- Primary reading text should stay near off-white for strong contrast against deep black backgrounds. [file:21]
- Secondary descriptions and supporting labels should use the cool gray layer to preserve hierarchy without losing readability. [file:21]
- Faint text should be used sparingly for disabled states, watermark-like details, or low-priority metadata. [file:21]
- Error and destructive states should use the dedicated destructive color and should not be approximated using gold variants. [file:21]

## Typography System

### Font Pairing
The project uses:
- **Space Grotesk** for display, headings, and primary data numbers. [file:18][file:21]
- **DM Sans** for body text, descriptions, buttons, and UI labels. [file:18][file:21]

This pairing reinforces the product’s mix of technical sharpness and readable usability. Space Grotesk introduces character and precision, while DM Sans maintains clarity in interactive and informational text. [file:18][file:21]

### Variable References
`PROJECT.md` defines the font variables as:
- `--font-space-grotesk` for display typography, [file:21]
- `--font-dm-sans` for body and UI typography. [file:21]

### Usage Rules
- Use **Space Grotesk** for hero headlines, section headings, major data figures, and any large-value numeric display. [file:18][file:21]
- Use **DM Sans** for paragraphs, navigation items, buttons, helper text, descriptions, labels, and dense UI copy. [file:18][file:21]
- Keep display typography impactful but controlled. The design should feel editorial, not theatrical. [file:18][file:21]
- Text selection should use a translucent gold highlight with white text, replacing the browser-default blue. [file:21]

### Scale and Tone
The source files do not provide a full type ramp with exact pixel sizes or line-height tokens for every heading level. However, they do indicate that small readable text patterns such as `text-xs/relaxed` are used heavily in buttons and UI contexts, which implies a preference for compact but legible microcopy styling. [file:21]

## Shape, Radius, and Surface Rules

### Radius System
The current project defines a baseline radius of `0.625rem` through `--radius`, with scaled variants extending up to `--radius-4xl`, described as `2.6 * radius` for larger layout elements. [file:21]

### Practical Radius Rules
- Standard controls and components should feel gently rounded, not sharply square and not overly pill-shaped. [file:21]
- `rounded-md` is specifically called out for buttons and maps effectively to a `0.5rem` feel in the current system. [file:21]
- Larger containers can use higher-radius variants where a softer premium silhouette is useful, but shape language should stay consistent across the system. [file:21]

### Surface Layering
- Cards and elevated panels should sit on **Charcoal Black (`#111113`)** above the **Deep Space Black (`#09090B`)** background. [file:21]
- Secondary layers can use **Matte Black (`#18181B`)** to create depth without introducing strong contrast breaks. [file:21]
- Borders should default to the faint gold border token rather than neutral gray. [file:18][file:21]

## Buttons and Interactive Elements

### Button Rules
Buttons are built with Base UI primitives, specifically `@base-ui/react/button`, within the project’s component system. Primary buttons use solid Muted Gold backgrounds with black text, while outline buttons use faint gold borders that glow on hover. [file:21]

### Interaction Rules
- Buttons should use `transition-all` for smooth but restrained transitions. [file:21]
- A subtle `active:translate-y-px` behavior provides tactile physical feedback and should be preserved where it does not harm accessibility. [file:21]
- Focus rings should use the glowing gold ring system such as `focus-visible:ring-ring/30`. [file:21]
- All interactions must remain compatible with `prefers-reduced-motion`. [file:18]

### What Buttons Must Not Become
Buttons must not use gradient fills, because gradient buttons are explicitly prohibited in the original design rules. [file:18] Button styling should feel premium through material, border, spacing, text contrast, and motion discipline rather than color theatrics. [file:18][file:21]

## Motion and Animation

### Approved Motion Language
The approved motion style is subtle, purposeful, and premium. Source-approved patterns include fade-in on scroll, smooth hover states, shimmering gold text effects, and a slow pulse-gold ambient opacity animation. [file:18][file:21]

### Current Custom Animation Patterns
The project explicitly includes:
- `.gold-shimmer` for a moving metallic text gradient effect, [file:21]
- `.animate-pulse-gold` for slow opacity breathing between approximately 8% and 18%, typically used in ambient visuals or glowing indicators. [file:21]

### Motion Guardrails
- Motion must support hierarchy, state feedback, or atmosphere. [file:18][file:21]
- Motion must not become decorative overload. [file:18][file:21]
- `prefers-reduced-motion` must always be respected. [file:18]
- Large flashy transitions, excessive parallax, or ornamental animation loops are outside the stated design language.

## Layout System

### Spatial Strategy
The application favors generous vertical spacing, full-height sections, and structured container widths. `PROJECT.md` specifically references `pt-20`, `min-h-[100dvh]`, and `container mx-auto px-6`, which should be treated as representative spatial patterns for the current design language. [file:21]

### Grid Strategy
Responsive grids are standard, with examples such as `grid lg:grid-cols-2 gap-16`. This indicates that desktop layouts should often use clean two-column structures while mobile layouts should stack naturally without losing hierarchy. [file:21]

### Layout Intent
- Use width intentionally on desktop rather than centering everything in one narrow column. [file:18][file:21]
- Preserve breathing room between sections and content clusters. [file:18][file:21]
- Avoid the repeated “centered-everything” pattern prohibited in the guide. [file:18]
- Avoid cookie-cutter three-column feature grids, even when presenting features or benefits. [file:18]

### Scroll Behavior
Smooth scrolling is enforced at the document level using `scroll-smooth` and `data-scroll-behavior="smooth"`. This should remain part of the interaction baseline unless a specific performance or accessibility reason requires adjustment. [file:21]

## Background and Ambient Layers

The current design explicitly uses background and ambient components. These are not optional decorative extras; they are part of the current atmosphere model and should be implemented carefully through dedicated visual sub-components rather than mixed into content logic. [file:19][file:21]

### Background Layer Rules
- Background effects should sit behind content and never reduce text clarity. [file:19][file:21]
- Ambient treatments should create depth and motion subtlety rather than visual distraction. [file:18][file:21]
- The structure pattern in `STRUCTURE.md` specifically recommends isolating visual layers into sub-components such as `Background`, `Ambient`, and `Gradients`, often within a `background.tsx` file. [file:19]

## Architecture and File Structure Alignment

### App Architecture
The project uses **Next.js App Router** with a `src/app` structure and locale-based routing under `src/app/[locale]/`. Internationalization is handled with `next-intl`, and routing support lives in `src/i18n/`. [file:21]

### Component Organization
The project separates:
- `src/components/ui/` for low-level primitives such as buttons, cards, and badges, [file:21]
- `src/components/landing/` for composed marketing and landing page sections, [file:21]
- nested section sub-components such as `section/hero/content/left.tsx` for complex sectional decomposition. [file:19][file:21]

### Shell and Section Pattern
All complex sections should continue to follow the “Shell & Section” pattern. The parent shell owns layout, high-level state, localization, and client-only directives where necessary, while child components handle focused visual or content responsibilities. [file:19]

### Breakdown Patterns
Recommended section breakdown categories remain:
- visual layers: `Background`, `Ambient`, `Gradients`, [file:19]
- content layers: `Left`, `Right`, `Actions`, `Logo`, [file:19]
- responsive navigation variants: `Desktop`, `Mobile`. [file:19]

This pattern is especially well aligned with the current ambient-rich hero and navbar structure. [file:19][file:21]

## Naming and Coding Standards

### Naming Rules
The current design implementation must continue to follow these standards:
- component filenames must be lowercase, [file:19]
- component functions and imports must use PascalCase, [file:19]
- state variables and event handlers must use camelCase, [file:19]
- significant arrays or static objects may use PascalCase, [file:19]
- translation access should use `const t = useTranslations("namespace")`. [file:19]

### Import Order
Imports should follow this order:
1. React hooks, [file:19]
2. Next-Intl and navigation, [file:19]
3. local sub-components in visual hierarchy order, [file:19]
4. external libraries and assets. [file:19]

### Code Quality Constraints
The original guide still defines these implementation constraints:
- complete production-ready code only, [file:18]
- line-1 filepath comments when generating files, [file:18]
- strict TypeScript with no `any`, [file:18]
- Tailwind CSS v4 utility classes only, no raw inline styles, [file:18]
- semantic HTML sections such as `header`, `main`, `section`, `footer`, and `nav`. [file:18]

## Localization Rules

Internationalization is not optional in the current project. `next-intl` is part of the architecture, locale-based routing is in place, and `STRUCTURE.md` requires all strings in new sections to use `next-intl`. [file:19][file:21]

### Localization Practices
- fetch translation context in the shell using `useTranslations`, [file:19]
- pass translation object `t` into children that need it, [file:19]
- centralize locale toggles and related handlers in the parent shell, then pass them down as props. [file:19]

This avoids duplicated translation hooks and keeps design behavior structurally clean. [file:19]

## Semantic and Accessibility Rules

### Semantic HTML
All generated sections must use semantic HTML, including `header`, `main`, `section`, `footer`, and `nav`. This is both a quality rule and a design-system rule because content hierarchy and accessibility are core to the project’s credibility. [file:18]

### Responsiveness
All components must be responsive from **375px to 1440px+**. Mobile-first implementation is required, and desktop enhancement should add structure rather than simply enlarge mobile layouts. [file:18]

### Motion Accessibility
All motion must respect `prefers-reduced-motion`. Ambient effects, hover transitions, shimmer states, and fade-in behaviors must degrade gracefully for users who prefer reduced movement. [file:18][file:21]

### Contrast Expectations
Although the files do not state numeric WCAG targets, the dark interface and gold-accent system imply a strong need for deliberate contrast control. Primary text, muted text, focus states, and borders must all remain legible against dark surfaces. This is a required implementation safeguard.

## Anti-Patterns and Hard Prohibitions

The following are explicitly forbidden and remain forbidden even if the current project evolves:
- gradient buttons, [file:18]
- glowing blobs as decoration, [file:18]
- centered-everything layouts, [file:18]
- icon-in-colored-circle patterns, [file:18]
- cookie-cutter three-column feature grids. [file:18]

Additional guardrails derived from the current project direction:
- do not overuse luminous gold until the interface feels flashy, [file:18][file:21]
- do not let ambient effects interfere with readability, [file:21]
- do not introduce light-mode assumptions into dark-exclusive components, [file:21]
- do not style the page like a generic AI startup template. [file:18]

## Section-Level Design Guidance

### Navbar
The navigation should feel persistent, refined, and technically composed. Because `STRUCTURE.md` recommends separate `Desktop` and `Mobile` sub-components for navigation, that pattern should be maintained when the navbar contains responsive behavior such as menus or locale toggles. [file:19]

### Hero
The hero is likely the strongest expression of the design system and should combine premium typography, ambient background treatment, spacious layout, and clear value communication. A two-column responsive structure is appropriate if supported by content, especially given the project’s standard `grid lg:grid-cols-2 gap-16` layout pattern. [file:21]

### Supporting Sections
Supporting sections should continue to avoid default marketing clichés. Better patterns include editorial splits, staggered blocks, asymmetric content modules, data-led explanation rows, and focused cards that preserve spaciousness and hierarchy. [file:18][file:21]

### Cards and Content Blocks
Cards should feel elevated through surface contrast, border quality, and spacing rather than through excessive shadow or glossy effects. Their visual job is to organize information, not to compete with the page itself. [file:21]

### Footer
The footer should inherit the same dark premium tone, gold-border subtlety, and typographic discipline as the rest of the application. It should feel integrated into the system rather than appended as a generic footer template. [file:18][file:21]

## Decision Hierarchy

When making design or implementation decisions, use this order of authority:
1. Current concrete design rules from `PROJECT.md`. [file:21]
2. Original visual DNA and prohibitions from `GUIDE.md`. [file:18]
3. Structural and coding rules from `STRUCTURE.md`. [file:19]
4. Accessibility, readability, and factual restraint.
5. If a detail is missing, mark it as configurable rather than inventing it.

## Unknowns That Must Not Be Fabricated

Even with `PROJECT.md`, some important project details are still not explicitly defined in the attached files. These must remain open unless the project owner confirms them:
- exact content architecture for every landing page section,
- official brand voice and copywriting tone beyond the visual mood,
- real prediction methodology details,
- validated metrics or accuracy claims,
- actual dataset size and provenance,
- legal/privacy messaging requirements,
- complete token scale for spacing and typography,
- chart and data-visualization style rules,
- logo construction and clear-space rules,
- exact CTA labels and conversion goals,
- whether public users, academic reviewers, or both are the primary audience.

## Options for Missing Decisions

Where the current design system is clear but product communication is still undefined, these are safe option paths the project owner can choose from:

### Option A: Academic-first
- Prioritize thesis credibility, methodology explanation, and evidence presentation.
- Reduce promotional language.
- Emphasize system purpose, research framing, and validation sections.

### Option B: Product-first
- Prioritize clarity, usability, and approachable messaging for broader users.
- Emphasize prediction value, UI flow, and practical outcomes.
- Keep academic context secondary.

### Option C: Hybrid
- Present the product as a polished technical tool backed by academic work.
- Balance clarity, trust, and sophistication.
- This is the safest default if no audience decision has been made.

## Implementation Checklist

Use this checklist whenever updating or generating UI that should match the current project design:
- Maintain dark-mode exclusive styling. [file:21]
- Use Deep Space Black, Charcoal Black, and Matte Black according to their surface roles. [file:21]
- Use gold accents with restraint and clear hierarchy. [file:18][file:21]
- Use Space Grotesk for display and DM Sans for body/UI. [file:18][file:21]
- Preserve ambient visual layers through dedicated background components. [file:19][file:21]
- Use subtle gold borders and gold-based focus rings. [file:18][file:21]
- Keep buttons gently rounded, tactile, and non-gradient. [file:18][file:21]
- Respect `prefers-reduced-motion`. [file:18]
- Use full semantic HTML structure. [file:18]
- Keep all component filenames lowercase. [file:19]
- Use the shell-and-section pattern for complex sections. [file:19]
- Use `next-intl` for all strings in new sections. [file:19][file:21]
- Preserve mobile-first responsiveness from 375px to 1440px+. [file:18]
- Avoid generic AI SaaS templates and banned layout patterns. [file:18]

## Final Principle

A correct ELPRESY design should feel like a premium analytical system already grounded in a real implementation, not a speculative style exercise. It should be dark, precise, spacious, gold-accented, and technically organized, while remaining honest about any product or research details that have not yet been explicitly defined. [file:18][file:19][file:21]
