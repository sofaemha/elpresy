# ELPRESY - Project Codebase Documentation & Architectural Analysis

Welcome to the comprehensive, line-by-line developer guide and documentation for **ELPRESY** (Electrical Predictions System). This document is designed to provide an exhaustive analysis of every file located under the `/src` folder, detailing its exact contents, architectural purpose, usage, properties, attributes, hooks, and intricate design decisions. With this document, any AI agent or human developer can understand the entire project inside-out without needing to open the original source files.

---

## 1. Project Overview & Architectural Stack

**ELPRESY** is a premium, client-side progressive web application designed as an undergraduate thesis project (*Skripsi / Tugas Akhir*) in the Informatics Program at Pancasakti University Tegal, 2026. Its primary goal is to predict and optimize daily electrical consumption (specifically Air Conditioning ampere usage) using a machine learning regressor.

### The Technical Stack
1. **Next.js (v15 / App Router)**: Using standard file-based routing with internationalization under locale sub-directories.
2. **Tailwind CSS (v4)**: Leveraging the latest Tailwind engine featuring high-performance CSS themes, fluid sizing, inline configurations, custom keyframe animations, and HSL variables.
3. **next-intl**: Used for dual-language support (English `en` and Indonesian `id`), featuring deep translation interpolation, static locale routing, and seamless route proxies.
4. **Base UI (`@base-ui/react`)**: A zero-styled headless component library (formerly Radix UI's clean state machine architecture) used to build highly accessible, customizable dropdowns, sheets, accordions, and tabs.
5. **ml-cart**: A machine learning library used to run the **CART (Classification and Regression Trees)** Decision Tree Regressor directly on the client's browser, enabling real-time, zero-latency training and forecasting.

---

## 2. Directory Structure Map inside `src`

```
src/
├── proxy.ts                  # next-intl localized route proxy middleware
├── tsconfig.json             # TypeScript configuration for paths and modules
├── app/
│   ├── layout.tsx            # Global Root Layout (Fonts, Metadata, HTML Wrapper)
│   ├── globals.css           # Tailwind v4 directives, custom themes, utility animations
│   └── [locale]/
│       ├── layout.tsx        # Locale-specific client provider layout
│       └── page.tsx          # Main Entry point (Landing page construction)
├── i18n/
│   ├── routing.ts            # next-intl locales and default configurations
│   ├── request.ts            # Dynamic asynchronous message loader
│   └── navigation.ts         # Navigation helper wraps (Link, useRouter, usePathname)
├── lib/
│   └── utils.ts              # Tailwind CSS merge and clsx class utilities
└── components/
    ├── ui/                   # Modular Base UI custom design components
    │   ├── accordion.tsx     # Custom Base UI Accordion wrapper
    │   ├── badge.tsx         # Customizable span-level pill badge (CVA & useRender)
    │   ├── button.tsx        # High-flexibility client button (CVA & Clicks)
    │   ├── card.tsx          # Structured layout container (Header, Title, Footer)
    │   ├── separator.tsx     # Accessible native decorative border
    │   ├── sheet.tsx         # Slide-out modal drawer overlay panels
    │   └── tabs.tsx          # Segmented accessibility tab buttons and contents
    └── landing/              # High-fidelity blocks for sections
        ├── about.tsx         # Renders the Author profile section
        ├── features.tsx      # Renders the bento features grid
        ├── hero.tsx          # Renders the hero landing page (incorporating simulator)
        ├── preview.tsx       # Renders the virtual application browser mockup
        ├── research.tsx      # Renders the tabbed research bento layout
        ├── workflow.tsx      # Renders the how-it-works process steps
        ├── layout/
        │   ├── navbar.tsx    # Header section with scroll listener, language toggle
        │   └── footer.tsx    # Neon glowing bottom border and credit wrapper
        └── section/          # Decoupled component layers
            ├── author/
            │   └── profile.tsx    # Author profile details, bio, and affiliation
            ├── features/
            │   ├── header.tsx     # Title and subtitle block for features section
            │   └── grid.tsx       # 4-column dynamic grid displaying project features
            ├── footer/
            │   ├── content.tsx    # Desktop credit and hidden marquee assets
            │   └── mobile.tsx     # Optimized mobile footer credits
            ├── hero/
            │   ├── background.tsx # Grid overlays and pulse gold ambient light halos
            │   └── content/
            │       ├── left.tsx   # Typography, badges, and primary action buttons
            │       └── right.tsx  # Dynamic Client Machine Learning simulator panel
            ├── navbar/
            │   ├── logo.tsx       # Clickable brand logo with lightning bolt icon
            │   ├── desktop.tsx    # Desktop nav links with IntersectionObserver tracking
            │   ├── actions.tsx    # Language globe switcher and CTA button
            │   └── mobile.tsx     # Slide-out sheet menu optimized for mobile screens
            ├── preview/
            │   ├── app.tsx        # Core visual tabs (Dashboard, Predict, Logs, Settings)
            │   ├── header.tsx     # Mockup visual section title and explanation
            │   ├── mockup.tsx     # Premium glassmorphic virtual OS browser chrome
            │   ├── proof.tsx      # Multi-icon horizontal trust markers
            │   └── app/
            │       ├── dashboard.tsx   # Visual charts and real-time stats overview
            │       ├── prediction.tsx  # Visual model parameter and forecast simulator
            │       ├── history.tsx     # Searchable, paginated prediction records table
            │       └── settings.tsx    # Core CART hyperparameters and researcher details
            ├── research/
            │   ├── discover.tsx   # Persona tabs (Engineers, Admins, etc.) bento box
            │   └── explore.tsx    # Advanced FAQ panel utilising customized Base UI accordions
            └── workflow/
                ├── header.tsx     # Workflow section title and process instructions
                ├── powered.tsx    # CART hyperparameter badge decoration
                └── steps.tsx      # Dash-connected 3-stage visual path steps
```

---

## 3. Root Files & Infrastructure Configuration

### `src/proxy.ts`
* **Path**: [src/proxy.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/proxy.ts)
* **Purpose**: Serves as the localized routing middleware. It intercepts all incoming requests to the Next.js app to automatically attach or resolve the correct locale routing prefix (`/en` or `/id`).
* **Detailed Contents**:
  - Imports `createMiddleware` from `next-intl/middleware`.
  - Imports the `routing` configuration object from `@/i18n/routing`.
  - Exports a `proxy` variable initialized as the generated middleware.
  - Exports a `config` object with a `matcher` array that defines which URL routes should run this middleware.
  - The regex matcher excludes standard API routes, system assets (`_next`, `_vercel`), and files with explicit extensions (e.g. `favicon.ico`, `.png`, `.svg` via `.*\..*`).
* **Attributes & Custom Matchers**:
  - `matcher`: `["/((?!api|_next|_vercel|.*\\..*).*)"]` (Runs middleware on all paths except those matched in the negative lookahead).

### `src/lib/utils.ts`
* **Path**: [src/lib/utils.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/lib/utils.ts)
* **Purpose**: A fundamental utility file providing Tailwind CSS merging. It combines dynamic Tailwind utility classes without style conflicts.
* **Detailed Contents**:
  - `clsx`: Used for conditionally constructing class names.
  - `twMerge`: Merges Tailwind classes, resolving conflicts (e.g., combining `px-2` and `px-4` into `px-4`).
  - Exports the standard helper function `cn(...inputs: ClassValue[])`.

---

## 4. Internationalization (i18n) Architecture

The project implements automated language detection and redirection. Translated texts are placed under the `messages/en.json` and `messages/id.json` files outside the `src` directory.

### `src/i18n/routing.ts`
* **Path**: [src/i18n/routing.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/routing.ts)
* **Purpose**: Defines the supported languages and the default configuration for the translation router.
* **Detailed Contents**:
  - Defines the translation configuration using `defineRouting` from `next-intl/routing`.
  - `locales`: Supports two languages, `["en", "id"]`.
  - `defaultLocale`: Defaults to `"en"`.

### `src/i18n/request.ts`
* **Path**: [src/i18n/request.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/request.ts)
* **Purpose**: A server-side hook that asynchronously loads local translation JSON files depending on the requested locale segment.
* **Detailed Contents**:
  - Uses `getRequestConfig` from `next-intl/server` to fetch parameters.
  - Inspects the variable `requestLocale`. If it's undefined or not supported in `routing.locales`, it defaults back to `routing.defaultLocale` ("en").
  - Dynamically imports translation resource files from `../../messages/${locale}.json`.

### `src/i18n/navigation.ts`
* **Path**: [src/i18n/navigation.ts](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/i18n/navigation.ts)
* **Purpose**: Creates localized navigation utilities. Standard Next.js links and routing elements do not automatically understand locale prefixes. This file overrides default components so that routes automatically append the active language directory.
* **Detailed Contents**:
  - Uses `createNavigation` from `next-intl/navigation` with the config object `routing`.
  - Exports four key client wrappers:
    1. `Link`: Localized alternative to `next/link`.
    2. `redirect`: Localized alternative to `next/navigation`'s redirect.
    3. `usePathname`: Active pathname hook that strips out the `/en/` or `/id/` prefix.
    4. `useRouter`: Handles navigation programmatic operations (e.g. `router.push('/about')` matches the correct locale).

---

## 5. Next.js Routing, Styling, and Global Layouts

### `src/app/globals.css`
* **Path**: [src/app/globals.css](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/globals.css)
* **Purpose**: The main design token sheet. It uses **Tailwind CSS v4** directives and specifies global styles, layout structures, HSL custom properties, CSS animations, and gradient utilities.
* **Key Sections & Inline Customizations**:
  - **Tailwind imports**: `@import "tailwindcss";` and `@plugin "tailwindcss-animate";`.
  - **Theme Directives (`@theme inline`)**: Injecting design system values into the standard Tailwind library:
    - Display Font: `--font-display: var(--font-space-grotesk)` (Space Grotesk).
    - Sans Font: `--font-sans: var(--font-dm-sans)` (DM Sans).
    - Deep HSL variables representing the brand colors:
      - `--color-bg`: `#09090B` (zinc-950 dark background).
      - `--color-surface`: `#111113` (elevated surface container).
      - `--color-surface-2`: `#18181B` (brighter secondary surface).
      - `--color-gold`: `#C9A84C` (brand thesis gold accent).
      - `--color-gold-light`: `#F5C842` (neon gold highlight).
      - `--color-gold-dark`: `#9A7A2E` (shadow gold).
      - `--color-gold-glow`: `rgba(201, 168, 76, 0.12)` (radial gradient background glow).
      - Text hierarchy: Primary (`#FAFAFA`), Muted (`#A1A1AA`), Faint (`#52525B`).
      - `--color-border-gold`: `rgba(201, 168, 76, 0.15)` (ultra-thin elegant gold lines).
      - `--color-border-gold-hover`: `rgba(201, 168, 76, 0.35)`.
  - **Core Custom Keyframes**:
    1. `@keyframes shimmer`: Animates background coordinates.
    2. `@keyframes pulse-gold`: Fades a gold element's opacity back and forth from `0.08` to `0.18`.
  - **Global CSS Utility Classes**:
    - `.gold-shimmer`: Applies a five-stage linear gold-to-white gradient (`#C9A84C` -> `#F5C842` -> `#FFF8E1` -> `#F5C842` -> `#C9A84C`), clips it to text, and animates it forever via `shimmer 4s ease-in-out infinite`.
    - `.animate-pulse-gold`: Triggers the glowing pulse loop on abstract ambient backdrops.
    - `@layer base`: Applies standard custom resets. Universal borders default to the custom `--border` token, and `body` automatically applies anti-aliasing and the background/text tokens.

### `src/app/layout.tsx`
* **Path**: [src/app/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/layout.tsx)
* **Purpose**: Serves as the root Next.js shell structure that renders HTML, loads fonts, defines core SEO metadata, and wraps the global layout.
* **Detailed Contents**:
  - Loads Google fonts dynamically using Next.js optimization:
    - `Space_Grotesk`: Display font loaded with weights `300` to `700`, defined as CSS variable `--font-space-grotesk`.
    - `DM_Sans`: Body font loaded with weights `300` to `700`, defined as CSS variable `--font-dm-sans`.
  - Exports the default `metadata` configuration containing search-engine indexable parameters (`ELPRESY - Predict. Analyze. Optimize.` title, and description indicating an undergraduate thesis project).
  - Configures `<html>` with localized language defaults, setting smooth scrolling, dark themes, and applying font variable classes.
  - The standard `<body>` tags apply the standard sans-font, absolute dark zinc background (`bg-bg`), primary text, and gold-tinted selection backgrounds.

### `src/app/[locale]/layout.tsx`
* **Path**: [src/app/[locale]/layout.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/layout.tsx)
* **Purpose**: A localized sub-layout that fetches localization JSON resources and initializes the multi-language context provider for child routes.
* **Detailed Contents**:
  - Evaluates URL path locales against `routing.locales` using `hasLocale` from `next-intl`.
  - If a user enters an unlisted locale segment (e.g. `/fr`), it immediately calls the `notFound()` router route.
  - Dynamically imports translation message files client-side.
  - Returns the child components wrapped inside the `<NextIntlClientProvider>` with the active locale and parsed translation dictionary keys.

### `src/app/[locale]/page.tsx`
* **Path**: [src/app/[locale]/page.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/app/%5Blocale%5D/page.tsx)
* **Purpose**: Renders the complete application home/landing page. It assembles custom decoupled block components in sequential order.
* **Detailed Contents**:
  - Implements a semantic `<main>` tag container with absolute min-height and dark backgrounds.
  - Incorporates the modular blocks:
    1. `<Navbar />` (Header layout).
    2. `<Hero />` (Interactive Machine Learning simulator).
    3. `<Features />` (Bento layout grid).
    4. `<Workflow />` (How it works steps).
    5. `<Preview />` (Dynamic application preview tab boards).
    6. `<Research />` (Advanced FAQs and Discover bento tab panel).
    7. `<Author />` (Researcher information and credits block).
    8. `<Footer />` (Bottom credit bars).

---

## 6. Premium Headless UI Components (`src/components/ui/`)

These components wrap **Base UI** primitives. They provide accessible, zero-styled state machines with custom classes written in Tailwind CSS v4.

---

### UI Component 1: `accordion.tsx`
* **Path**: [src/components/ui/accordion.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/accordion.tsx)
* **Underlying Primitive**: `@base-ui/react/accordion`
* **Exposed Sub-Components**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.
* **Component Prop Interfaces & HTML Tags**:
  - `Accordion`: Wraps `AccordionPrimitive.Root` (`<div>` by default). Receives all `Root.Props` (e.g. `value`, `onValueChange`, `openMultiple`, `disabled`).
  - `AccordionItem`: Wraps `AccordionPrimitive.Item` (`<div>`). Receives `Item.Props` (e.g. `value`, `disabled`).
  - `AccordionTrigger`: Wraps `AccordionPrimitive.Trigger` (`<button>`). Receives `Trigger.Props`.
  - `AccordionContent`: Wraps `AccordionPrimitive.Panel` (`<div>`). Receives `Panel.Props`.

#### Class Styling, States, and Selectors
* **`Accordion`**:
  - `flex w-full flex-col overflow-hidden rounded-md border`
  - Encapsulates children inside an absolute structural border container.
* **`AccordionItem`**:
  - `not-last:border-b data-open:bg-muted/50`
  - Utilizes standard Base UI states: `data-open` triggers a dynamic background shift to 50% opacity, and `not-last:border-b` ensures internal item dividers do not bleed outside the bottom border boundary.
* **`AccordionTrigger`**:
  - `group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-2 text-left text-xs/relaxed font-medium transition-all outline-none hover:underline`
  - Contains two Lucide icons: `ChevronDownIcon` (visible when closed, hidden when expanded via `group-aria-expanded/accordion-trigger:hidden`) and `ChevronUpIcon` (visible when expanded via `group-aria-expanded/accordion-trigger:inline`).
  - Implements selector `**:data-[slot=accordion-trigger-icon]:ml-auto` to automatically right-align trigger icons.
* **`AccordionContent`**:
  - `overflow-hidden px-2 text-xs/relaxed data-open:animate-accordion-down data-closed:animate-accordion-up`
  - Controls heights using Tailwind-based custom keyframes (`animate-accordion-down`, `animate-accordion-up`).
  - Uses CSS variable `--accordion-panel-height` to resolve dynamic heights of internal text blocks.
  - Automatically targets text lists and anchors via custom rules: `[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4`.

---

### UI Component 2: `badge.tsx`
* **Path**: [src/components/ui/badge.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/badge.tsx)
* **Underlying Primitive**: Uses Base UI dynamic render utilities: `@base-ui/react/merge-props`, `@base-ui/react/use-render`.
* **Component Prop Interfaces & HTML Tags**:
  - `Badge`: Integrates `cva` (Class Variance Authority) classes. Receives `useRender.ComponentProps<"span">` and `VariantProps<typeof badgeVariants>`.
* **Custom Attributes & Properties**:
  - `variant`:
    - `default`: Brand Gold background with black contrast text (`bg-primary text-primary-foreground`).
    - `secondary`: Slate-zinc dark block (`bg-secondary text-secondary-foreground`).
    - `destructive`: Red-tinted warning state (`bg-destructive/10 text-destructive`).
    - `outline`: Fine golden border with faint gold background (`border-border bg-input/20`).
    - `ghost`: Transparent layout with hover highlights.
    - `link`: Interactive text link featuring underline offsets.
  - `render`: An optional prop that allows replacing the underlying tag using polymorphic rendering.

#### Dynamic Rendering Mechanics (`useRender`)
Rather than returning a hardcoded `<span>`, the component invokes Base UI's React `useRender` hook:
```typescript
return useRender({
  defaultTagName: "span",
  props: mergeProps<"span">({ className: cn(badgeVariants({ variant }), className) }, props),
  render,
  state: { slot: "badge", variant },
});
```
This enables polymorphic overriding (e.g. `<Badge render={<a href="#" />}>` retains the entire CVA badge style while rendering as an anchor tag `<a>`).

---

### UI Component 3: `button.tsx`
* **Path**: [src/components/ui/button.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/button.tsx)
* **Underlying Primitive**: `@base-ui/react/button`
* **Component Prop Interfaces & HTML Tags**:
  - `Button`: Wraps `ButtonPrimitive` (`<button>` with native keyboard interaction). Receives `ButtonPrimitive.Props` (e.g. `onPress`, `disabled`, `focusable`) and `VariantProps<typeof buttonVariants>`.
* **Custom Attributes & Properties**:
  - `variant`:
    - `default` (Gold background, black text, primary visual weight).
    - `outline` (Muted thin borders, light highlights).
    - `secondary` (Zinc background block).
    - `ghost` (Hover states only).
    - `destructive` (Red outline warning state).
    - `link` (Gold text with click underlines).
  - `size`: Supports multiple sizes (`default` h-7, `xs` h-5, `sm` h-6, `lg` h-8), and corresponding icon square bounds (`icon` size-7, `icon-xs` size-5, `icon-sm` size-6, `icon-lg` size-8).

#### Class Styling, Micro-interactions, and Selectors
* **Stepper Transform**:
  - `active:not-aria-[haspopup]:translate-y-px`
  - Adds a subtle downward 1px vertical translation on click to provide organic haptic-like physical feedback.
* **Auto-Icon Sizing**:
  - `[&_svg:not([class*='size-'])]:size-4` (and size-specific variations).
  - Dynamically targets nested SVG graphic icons (e.g., Lucide items) to scale them to exact specifications without manually adding width/height classes to the icons.
* **Aria States styling**:
  - `disabled:pointer-events-none disabled:opacity-50`
  - `aria-invalid:border-destructive aria-invalid:ring-2`
  - Standardizes validation error visuals by listening directly to React/ARIA state machine properties.

---

### UI Component 4: `card.tsx`
* **Path**: [src/components/ui/card.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/card.tsx)
* **Underlying Primitive**: Pure React HTML structure.
* **Exposed Sub-Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.
* **Component Prop Interfaces & HTML Tags**:
  - All sub-components wrap standard React layout elements (`React.ComponentProps<"div">`).
  - `Card`: Incorporates an optional attribute `size?: "default" | "sm"`.

#### Class Styling, Layout Mechanics, and Selectors
* **Adaptive Card**:
  - `group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10`
  - Renders as a structured box using CSS Ring borders rather than standard borders.
  - Automatically shapes image items placed directly inside its bounds: `*:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg has-[>img:first-child]:pt-0`.
* **Dynamic Grid Header**:
  - `group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg px-4 ...`
  - Leverages modern **CSS Container Queries** (`@container/card-header`).
  - Dynamically changes layout rules depending on its child tags: `has-data-[slot=card-action]:grid-cols-[1fr_auto]` (forces columns when an action button exists) and `has-data-[slot=card-description]:grid-rows-[auto_auto]`.
* **Footer Dividers**:
  - Card header uses `.border-b:pb-4` and Card footer uses `.border-t:pt-4`.
  - Adding `border-t` or `border-b` class triggers spacing styles that seamlessly align content blocks.

---

### UI Component 5: `separator.tsx`
* **Path**: [src/components/ui/separator.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/separator.tsx)
* **Underlying Primitive**: `@base-ui/react/separator`
* **Component Prop Interfaces & HTML Tags**:
  - `Separator`: Wraps `SeparatorPrimitive` (`<div>` with `aria-orientation`). Receives `SeparatorPrimitive.Props`.
* **Custom Attributes & Properties**:
  - `orientation`: `"horizontal"` (default) or `"vertical"`.

#### Layout Mechanics & Accessibility
* **Dynamic Sizing**:
  - `bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch`
  - Resolves standard layout lines without requiring separate classes for horizontal or vertical orientations.
  - Base UI ensures assistive screen readers ignore decorative separators by setting `aria-hidden="true"`.

---

### UI Component 6: `sheet.tsx`
* **Path**: [src/components/ui/sheet.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/sheet.tsx)
* **Underlying Primitive**: `@base-ui/react/dialog` (polymorphically styled as a drawer panel).
* **Exposed Sub-Components**: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`.
* **Component Prop Interfaces & HTML Tags**:
  - `SheetContent`: Receives `SheetPrimitive.Popup.Props` and two custom attributes:
    - `side?: "top" | "right" | "bottom" | "left"` (defines slide entry vector).
    - `showCloseButton?: boolean` (defaults to true).

#### Slide Animations, Overlay backdrop, and Layout Selectors
* **Glassmorphic Overlay backdrop**:
  - `fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs`
  - Renders a semi-transparent dark overlay.
  - Implements Base UI transition states `data-starting-style` and `data-ending-style` to apply smooth hardware-accelerated fade transitions.
* **Responsive Multi-Directional Popup Drawer**:
  - `fixed z-50 flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg transition duration-200 ease-in-out`
  - Utilizes conditional translation coordinates depending on the specified `side` property:
    - `right`: Slide from positive X (`data-ending-style:translate-x-[2.5rem]`, width 75% on mobile, max-width `sm` on desktop).
    - `left`: Slide from negative X (`data-ending-style:translate-x-[-2.5rem]`).
    - `top` / `bottom`: Slide from negative or positive Y directions.

---

### UI Component 7: `tabs.tsx`
* **Path**: [src/components/ui/tabs.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/ui/tabs.tsx)
* **Underlying Primitive**: `@base-ui/react/tabs`
* **Exposed Sub-Components**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
* **Component Prop Interfaces & HTML Tags**:
  - `Tabs`: Wraps `TabsPrimitive.Root`. Receives `TabsPrimitive.Root.Props` (e.g. `value`, `onValueChange`).
  - `TabsList`: Receives `TabsPrimitive.List.Props` and `VariantProps<typeof tabsListVariants>`. Supports variants: `default` or `line`.
  - `TabsTrigger`: Wraps `TabsPrimitive.Tab`. Receives `TabsPrimitive.Tab.Props` (e.g. `value`, `disabled`).

#### Responsive Layout Orientations, Active States, and Borders
* **Dynamic Flex Orientations**:
  - `group/tabs flex gap-2 data-horizontal:flex-col`
  - Uses CSS custom selectors (`data-horizontal:flex-col`) to adjust block layout directions based on component configuration.
* **Dynamic List Indicators**:
  - `tabsListVariants`:
    - `default`: Segmented pill box style (`bg-muted`).
    - `line`: Minimalist underline style with custom borders (`bg-transparent border-b`).
* **Micro-interactions & Inline Indicators**:
  - Trigger active styling uses high-fidelity custom rules:
    ```css
    after:absolute after:bg-foreground after:opacity-0 after:transition-opacity
    group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5
    group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5
    group-data-[variant=line]/tabs-list:data-active:after:opacity-100
    ```
    This renders a custom active marker line under the active tab on horizontal layouts, and to the right on vertical layouts, aligning perfectly with standard Next.js transition behaviors.

---

## 7. Main Blocks (`src/components/landing/`)

---

### Block 1: `about.tsx` (Author Block)
* **Path**: [src/components/landing/about.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/about.tsx)
* **Purpose**: Serves as the landing page author block. It handles internationalization strings and passes them to section profile templates.
* **Detailed Contents**:
  - Initializes local translations dictionary `useTranslations("author")`.
  - Renders a `<section>` container using ID `#about` with a deep dark zinc background (`bg-surface-2`).
  - **Premium Abstract Background Deco**:
    - Places an absolute pointer-events-disabled full-screen background overlay.
    - Implements an image logo tag (`/upst.png` - Pancasakti University logo) styled with low opacity (`opacity-5`) and dynamic scaling: `scale-175 sm:scale-125 md:scale-135 lg:scale-150 xl:scale-175`.
  - Renders `<Profile t={t} />`, passing down the translation function `t` as a prop.

---

### Block 2: `features.tsx` (Features Block)
* **Path**: [src/components/landing/features.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/features.tsx)
* **Purpose**: Renders the core system feature sections, showcasing technical highlights of the CART prediction model.
* **Detailed Contents**:
  - Declares the standard landing block container under element ID `#features` with background class `bg-surface-2`.
  - Combines two clean templates:
    1. `<Header t={t} />` (Section Title and description blocks).
    2. `<Grid t={t} />` (Dynamic Bento grid layout with icons and custom visualizations).

---

### Block 3: `hero.tsx` (Hero Page Block)
* **Path**: [src/components/landing/hero.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/hero.tsx)
* **Purpose**: The core landing page landing block. It loads visual grid overlays, ambient gold glow spots, and structures the landing layout.
* **Detailed Contents**:
  - Set up with element ID `#thesis`, spanning full-screen bounds (`min-h-[100dvh]`).
  - Automatically loads background components `<Background />` and `<Ambient />`.
  - Implements a two-column responsive desktop layout (`grid lg:grid-cols-2`):
    - **Left Column**: Typography, thesis credentials, and CTA buttons (`<Left t={t} />`).
    - **Right Column**: Interactive client-side machine learning simulator (`<Right />`).

---

### Block 4: `preview.tsx` (Application Preview Block)
* **Path**: [src/components/landing/preview.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/preview.tsx)
* **Purpose**: Renders an interactive preview of the application's user interface.
* **Detailed Contents**:
  - Implements element ID `#application`, styled with dark backgrounds (`bg-surface`).
  - Structures three templates in vertical order:
    1. `<Header t={t} />` (Section headings).
    2. `<Mockup />` (Virtual browser chassis containing the preview app).
    3. `<Proof t={t} />` (Horizontal row of trust markers and framework credits).

---

### Block 5: `research.tsx` (Research & Explore Block)
* **Path**: [src/components/landing/research.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/research.tsx)
* **Purpose**: Structures research findings, details regarding CART methodology, and persona benefits.
* **Detailed Contents**:
  - Implements the landing block container with ID `#research` and background `bg-bg`.
  - Contains two primary subsections:
    - `Explore` (custom accordion panels, currently commented out in favor of clean layout presentation).
    - `Discover` (an interactive tabbed bento box, fully rendered).
  - Maximizes grid layout limits using the class `mx-auto max-w-[1200px] px-6 md:px-12 lg:px-16 py-16`.

---

### Block 6: `workflow.tsx` (Workflow Block)
* **Path**: [src/components/landing/workflow.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/workflow.tsx)
* **Purpose**: Outlines the three simple steps to use the system.
* **Detailed Contents**:
  - Located under element ID `#workflow` with background `bg-bg`.
  - Integrates three templates in standard vertical sequence:
    1. `<Header t={t} />`
    2. `<Steps t={t} />`
    3. `<Powered t={t} />` (CART configuration badge display).

---

### Block 7: `layout/navbar.tsx` (Header Navigation)
* **Path**: [src/components/landing/layout/navbar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/navbar.tsx)
* **Purpose**: Handles responsive header layout rendering, window scroll offsets, and active state transitions.
* **Detailed Contents**:
  - Renders a fixed `<header>` container with custom state styles:
    - **Scrolled state** (`scrollY > 20`): Applies background `bg-surface/80`, 50% opacity borders, glassmorphic filters (`backdrop-blur-md`), and compresses padding (`py-3`).
    - **Default state**: Transparent background with taller padding (`py-5`).
  - Contains the landing navigation routing config links:
    - `#thesis` (Thesis / Home).
    - `#features` (Features).
    - `#workflow` (Workflow).
    - `#application` (Application Preview).
    - `#research` (Research).
    - `#about` (About / Author).
  - **Automated Language Toggle (`toggleLocale`)**:
    - Switches between languages. It reads the active translation prefix (`en` or `id`) and invokes `router.replace(pathname, { locale: next })` using the customized navigation helpers.
  - Combines logo, desktop navigation, and slide-out mobile drawer sub-components.

---

### Block 8: `layout/footer.tsx` (Bottom Layout Footer)
* **Path**: [src/components/landing/layout/footer.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/footer.tsx)
* **Purpose**: Renders the footer with a neon-glowing top border.
* **Detailed Contents**:
  - **Neon Gold Top Border & Ambient Halo**:
    - Creates a glowing border effect using two absolute DIV layers:
      1. **Core Line**: A 1px high horizontal line spanning the container width (`bg-gradient-to-r from-transparent via-gold/70 to-transparent`).
      2. **Outer Halo Glow**: An absolute blur element that adds depth (`w-2/3 h-[2px] bg-gold blur-[8px] opacity-60`).
  - Renders `<Content t={t} />` (desktop layout) and `<Mobile t={t} />` (mobile layout).

---

## 8. Detailed Section Analysis (`src/components/landing/section/`)

---

### Section 1: `author/profile.tsx`
* **Path**: [src/components/landing/section/author/profile.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/author/profile.tsx)
* **Purpose**: Renders the researcher profile card.
* **Usage**: `<Profile t={t} />` (Expects the next-intl translation function as the `t` attribute).
* **Key Visual Elements**:
  - Renders a stylized badge: `badge` with gold background, custom outline, and rounded borders.
  - Renders a glassmorphic main card: `bg-surface border border-border rounded-2xl p-8 md:p-12`.
  - **Highlight Top Border Line**: Uses an absolute DIV to project a gradient gold line at the top edge (`bg-gradient-to-r from-transparent via-gold to-transparent opacity-50`).

---

### Section 2: `features/header.tsx`
* **Path**: [src/components/landing/section/features/header.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/features/header.tsx)
* **Purpose**: Renders the features section header.
* **Usage**: `<Header t={t} />` (Requires standard translation dictionary `t`).
* **Detailed Contents**:
  - Creates a left-aligned container constrained to `max-w-2xl` for optimal reading width.
  - Displays the title (`text-3xl md:text-4xl font-display font-bold`) and descriptive text (`text-lg text-text-muted`).

---

### Section 3: `features/grid.tsx`
* **Path**: [src/components/landing/section/features/grid.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/features/grid.tsx)
* **Purpose**: Renders the bento grid showcasing system features.
* **Usage**: `<Grid t={t} />`
* **Layout Grid Mechanics**:
  - Implements a dynamic responsive layout structure: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`.
  - **Large Bento Card (Engine Card)**:
    - Spans two columns and two rows on larger screens (`lg:col-span-2 lg:row-span-2`).
    - Implements custom interactive states: on hover, the border dims and a radial gold highlight appears (`group-hover:from-gold/[0.04]`).
    - Incorporates a premium radial background light glow (`bg-gold/[0.06] blur-[80px] group-hover:bg-gold/[0.12]`).
    - **Decorative Mini-Visual**: Renders an abstract representation of a CART decision tree at the bottom of the card using a series of horizontally-aligned gold pills of varying widths:
      ```typescript
      const BARS = [{ w: "w-16", h: "h-1" }, { w: "w-10", h: "h-1" }, { w: "w-24", h: "h-1" }, ...]
      ```
  - **Standard Grid Cards**:
    - The remaining columns display features like Charts, History Logs, Export Data, and Multi-language support.
    - Each card includes a dynamic hover highlight overlay and is equipped with a distinct Lucide icon.

---

### Section 4: `footer/content.tsx`
* **Path**: [src/components/landing/section/footer/content.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/footer/content.tsx)
* **Purpose**: Renders the desktop footer.
* **Usage**: `<Content t={t} />`

#### Important Code Details & commented-out Blocks
Inside the source code, there is a `MarqueeContent` function defined but **not rendered** in the return statement:
```typescript
const MarqueeContent = () => (
  <>
    <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
      {t("marqueeUniversity")}
    </span>
    <span className="text-gold text-3xl lg:text-5xl"><Sparkles className="size-15 fill-gold" /></span>
    <span className="text-5xl lg:text-7xl font-display font-bold text-white uppercase px-12">
      {t("marqueeProgram")}
    </span>
    <span className="text-gold text-3xl lg:text-5xl"><Sparkles className="size-15 fill-gold" /></span>
  </>
);
```
Instead, the desktop footer returns a clean, centered text layout that displays the thesis credit string (`t("credit")`) alongside the gold brand tag `ELPRESY`.
* **Important Class Selectors**:
  - `hidden md:flex`: The component is completely hidden on small screens and displayed only on screens wider than `768px` (desktop view).

---

### Section 5: `footer/mobile.tsx`
* **Path**: [src/components/landing/section/footer/mobile.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/footer/mobile.tsx)
* **Purpose**: Renders the mobile footer.
* **Usage**: `<Mobile t={t} />`
* **Important Class Selectors**:
  - `flex flex-col md:hidden`: Styled as the direct counterpart to the desktop footer content. It is visible on small screens and completely hidden on screens wider than `768px`. It centers credit typography for mobile devices.

---

### Section 6: `hero/background.tsx`
* **Path**: [src/components/landing/section/hero/background.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/hero/background.tsx)
* **Purpose**: Renders the background effects for the hero block.
* **Exposed Elements**: `Background`, `Ambient`.
* **Usage**: `<Background />` and `<Ambient />`.
* **Graphic Styling Details**:
  - `Background`: Implements a subtle grid layout effect using CSS linear gradients:
    ```typescript
    backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
    backgroundSize: "4rem 4rem"
    ```
    The overlay is set to low opacity (`opacity-[0.03]`) and ignores pointer events (`pointer-events-none`).
  - `Ambient`: Renders a large background spot light overlay (`w-[500px] h-[500px] bg-gold rounded-full blur-[200px]`) that pulses continuously using the `.animate-pulse-gold` utility class.

---

### Section 7: `hero/content/left.tsx`
* **Path**: [src/components/landing/section/hero/content/left.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/hero/content/left.tsx)
* **Purpose**: Renders the primary headings and action items on the left side of the hero section.
* **Usage**: `<Left t={t} />`
* **Key Typography & visual styles**:
  - **Decorative Gold Line**: A small horizontal gold divider (`h-[1px] w-12 bg-gold mb-6`).
  - **Gradient Headings**: The primary header wraps three multi-language title lines:
    1. First line: Zinc white gradient (`text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500`).
    2. Second line: The glowing gold shimmer (`class="gold-shimmer"`).
    3. Third line: A muted gray gradient (`text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600`).
  - **Call to Action Buttons**:
    - Primary Button: Solid gold button featuring Lucide's `ArrowRight` icon. Includes a custom gold glow box shadow (`shadow-[0_0_20px_rgba(201,168,76,0.25)]`) that expands on hover.
    - Secondary Button: Ghost button styled with custom hover backgrounds (`hover:bg-gold/10 hover:text-gold`).

---

### Section 8: `hero/content/right.tsx` (Client-side Machine Learning Simulator)
* **Path**: [src/components/landing/section/hero/content/right.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/hero/content/right.tsx)
* **Purpose**: The most complex component in the codebase. It features client-side model training using CART, dynamic numerical adjustments, and interactive custom SVG charts with bezier-curve logic.
* **Usage**: `<Right />`

#### 1. Machine Learning Integration (`ml-cart` & `generateData`)
The simulator utilizes an in-browser Machine Learning Decision Tree Regressor:
* **Imports**: `import { DecisionTreeRegression } from "ml-cart";`
* **Dynamic Training Data Generation**:
  - When the developer click "Generate Training Data", the component invokes the `generateData` function:
    ```typescript
    function generateData(months: TrainMonth) {
      const x: number[][] = [], y: number[] = [];
      for (let i = 0; i < months * WORKING_DAYS_PER_MONTH; i++) {
        const a = +(6 + Math.random() * 4).toFixed(1); // Ampere input features
        const h = +(4 + Math.random() * 8).toFixed(1); // Hours input features
        x.push([a, h]);
        y.push(+(a * h + (Math.random() - 0.5) * 1.4).toFixed(1)); // Target variable: (Ampere * Hours) + noise
      }
      return { x, y };
    }
    ```
  - It generates a custom data array based on the selected training duration (`1`, `2`, or `3` months, where each month contains `22` working days).
* **Model Training**:
  - Initializes a new `DecisionTreeRegression` model with hyperparameter rules: `new DecisionTreeRegression({ maxDepth: 5, minNumSamples: 2 })`.
  - Invokes `model.train(data.x, data.y)` to train the model directly in the client's browser.

#### 2. Advanced SVG Chart Mathematics (`buildPath`)
Once trained, entering inputs (`ampere` and `hours`) and clicking `Predict` runs a real-time forecast. The component plots the results on a custom SVG line chart powered by coordinate mapping algorithms:
* **Bezier Curve Construction**:
  - The `buildPath` function translates numerical prediction coordinates into SVG path coordinates:
    ```typescript
    function buildPath(pts: number[], W: number, H: number) {
      if (pts.length < 2) return { area: "", line: "", last: null };
      const min = Math.min(...pts), max = Math.max(...pts), range = max - min || 1, pad = 8;
      const coords = pts.map((v, i) => ({
        x: (i / (pts.length - 1)) * W,
        y: pad + ((max - v) / range) * (H - pad * 2), // Maps inputs to SVG canvas coordinates
      }));
      const segs: string[] = [];
      coords.forEach((p, i) => {
        if (i === 0) { segs.push(`M${p.x},${p.y}`); return; }
        const pr = coords[i - 1], mx = (pr.x + p.x) / 2;
        segs.push(`C${mx},${pr.y} ${mx},${p.y} ${p.x},${p.y}`); // Cubic Bezier segment curve
      });
      const line = segs.join(" ");
      const last = coords[coords.length - 1];
      return { area: `${line} L${last.x},${H} L0,${H} Z`, line, last };
    }
    ```
  - It maps values into a drawing box (`400px` by `120px`), calculates dynamic margins, and renders a smooth cubic Bezier path using `C` instructions.
  - Returns both a solid `line` path and a closed `area` path for rendering gradient background fills.

#### 3. Stepper Logic & Interactive Accordions
* **`NumericStepper` Component**:
  - Eliminates browser default input behaviors.
  - Dynamically calculates float precision based on the `step` attribute:
    ```typescript
    const dec = String(step).includes(".") ? String(step).split(".")[1].length : 0;
    ```
    This ensures that when incrementing/decrementing, float values remain clean (e.g. `8.0` + `0.1` -> `8.1` rather than `8.1000000000004` due to floating point limits).
* **Collapsible Accordions**:
  - Renders three main collapsible panels (Training Data, Prediction Inputs, and Prediction Results) using React state-driven CSS transitions:
    ```typescript
    className={`grid transition-all duration-300 ease-in-out ${trainOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    ```
    Using `grid-rows-[0fr]` -> `grid-rows-[1fr]` alongside an inner overflow-hidden wrapper enables smooth height expansion transitions without hardcoding element heights.

---

### Section 9: `navbar/logo.tsx`
* **Path**: [src/components/landing/section/navbar/logo.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/navbar/logo.tsx)
* **Purpose**: Renders the clickable brand logo.
* **Usage**: `<Logo />`
* **Detailed Contents**:
  - Uses the localized `<Link>` routing helper to redirect to the home page `/`.
  - Integrates Lucide's `Zap` lightning bolt icon, styled with smooth gold hover transitions (`group-hover:text-gold-light transition-colors`).

---

### Section 10: `navbar/actions.tsx`
* **Path**: [src/components/landing/section/navbar/actions.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/navbar/actions.tsx)
* **Purpose**: Renders navigation action controls for larger screens.
* **Usage**: `<Actions toggleLocale={toggleLocale} t={t} />`
* **Detailed Contents**:
  - Implements the language switcher button equipped with a Lucide `Globe` icon.
  - Renders a primary "Get Started" button wrapped in the custom `<Button>` primitive component, styled with custom hover states (`hover:bg-gold hover:text-black`).

---

### Section 11: `navbar/desktop.tsx`
* **Path**: [src/components/landing/section/navbar/desktop.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/navbar/desktop.tsx)
* **Purpose**: Renders navigation links for desktop screens, featuring scroll-tracking state changes.
* **Usage**: `<Desktop Links={Links} />`

#### Intersection Observer Scroll-Tracking
The component automatically updates the active navigation link based on the user's scroll position:
* **Active Section Detection**:
  - Uses an `IntersectionObserver` to track which landing page block is currently visible in the viewport:
    ```typescript
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 } // Narrow scroll-tracking window
    );
    ```
  - **`rootMargin` Configuration**:
    - Specifying `-40% 0px -50% 0px` centers a narrow 10% detection zone in the upper-middle of the screen.
    - When a section boundary scrolls into this zone, it immediately updates the `activeSection` state, ensuring highly accurate active state transitions.
  - Intercepts clicks on link anchors (`handleClick`), executing smooth transitions using `target.scrollIntoView({ behavior: "smooth" })`.

---

### Section 12: `navbar/mobile.tsx`
* **Path**: [src/components/landing/section/navbar/mobile.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/navbar/mobile.tsx)
* **Purpose**: Renders the slide-out navigation menu for mobile screens.
* **Usage**: `<Mobile Links={Links} toggleLocale={toggleLocale} locale={locale} t={t} />`
* **Detailed Contents**:
  - Combines three modular sub-components:
    1. `<Container>`: Wraps the slide-out navigation panel in the custom `<Sheet>` component primitive, setting properties to slide in from the right edge (`side="right"`).
    2. `<Items>`: Iterates through navigation anchors for mobile screens.
    3. `<Actions>`: Displays the mobile-friendly language switcher and action buttons.

---

### Section 13: `preview/app.tsx`
* **Path**: [src/components/landing/section/preview/app.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/app.tsx)
* **Purpose**: Manages the sidebar navigation and page routing inside the virtual application mockup.
* **Usage**: `<App />`
* **Detailed Contents**:
  - Renders a multi-column application layout (`flex min-h-[520px]`).
  - **Sidebar Panel**:
    - Fixed left panel styled with low-contrast dark backgrounds (`bg-[#0e0e10] border-r`).
    - Maps the four system core visual areas: Dashboard, Run Predictions, Prediction History, and Configuration.
    - Renders active states using gold highlights: `bg-gold/10 text-gold`.
    - Sidebar footer displays the project version tag `v1.0.0 • CART Model` in monospace typography.
  - **Dynamic Page Content**:
    - Embeds page panels dynamically based on the active tab state:
      - `dashboard` -> `<DashboardArea t={t} />`
      - `predictions` -> `<PredictionArea t={t} />`
      - `history` -> `<HistoryArea t={t} />`
      - `settings` -> `<SettingsArea t={t} />`

---

### Section 14: `preview/header.tsx`
* **Path**: [src/components/landing/section/preview/header.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/header.tsx)
* **Purpose**: Renders the header for the preview mockup section.
* **Usage**: `<Header t={t} />`
* **Detailed Contents**:
  - Creates a centered container restricted to `max-w-2xl` to ensure optimal reading width on larger screens.

---

### Section 15: `preview/mockup.tsx`
* **Path**: [src/components/landing/section/preview/mockup.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/mockup.tsx)
* **Purpose**: Renders a premium, glassmorphic virtual OS browser chassis to contain the application preview mockup.
* **Usage**: `<Mockup />`
* **Key Visual Elements**:
  - **Gold Ambient Glow**: Projects a golden glow backdrop behind the frame:
    ```typescript
    className="absolute -inset-4 bg-gold/[0.04] blur-[60px]"
    ```
  - **Virtual Browser Chrome**:
    - Renders three OS window control buttons (red, yellow, and green dots).
    - Renders a mock address bar styled with an active secure icon marker (emerald dot) and the monospace URL address `elpresy.app/dashboard`.
  - Embeds the main `<App />` component.

---

### Section 16: `preview/proof.tsx`
* **Path**: [src/components/landing/section/preview/proof.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/proof.tsx)
* **Purpose**: Renders a horizontal row of trust markers and core framework credentials.
* **Usage**: `<Proof t={t} />`
* **Detailed Contents**:
  - Centers a row of three clean trust indicators equipped with custom icons:
    1. **Open Source**: Lucide `CheckCircle2` icon.
    2. **Model Accuracy**: Lucide `ShieldCheck` icon.
    3. **Next.js Infrastructure**: Lucide `Code2` icon.

---

### Section 17: `preview/app/dashboard.tsx`
* **Path**: [src/components/landing/section/preview/app/dashboard.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/app/dashboard.tsx)
* **Purpose**: Renders the dashboard page inside the virtual application mockup.
* **Usage**: `<DashboardArea t={t} />`
* **Detailed Contents**:
  - **Interactive Page Header**: Displays the section title and subtext alongside a custom status badge (`Model Active`).
  - **Stat Cards Grid**: Renders three key system metrics cards (Total Predictions `1,248`, Last Ampere predicted `8.4 A`, and Average Daily usage `7.9 A`) with green/red indicator values.
  - **7-day Usage Trend Chart**:
    - Renders a high-fidelity SVG Area Chart:
      - Uses a linear gradient overlay (`#C9A84C` to transparent) to create a glowing area fill effect.
      - Draws a smooth bezier-curve line using cubic bezier coordinates (`C` parameters).
      - Adds a glowing circle dot at the final coordinate point.
  - **Recent Predictions Table**:
    - Iterates through a mock logs array (`PREDICTIONS_DATA`), rendering tabular metrics: prediction ID, date, ampere load, daily hours, final predicted Ah usage with custom directional trend indicators (using the sub-component `<TrendIcon />`), and a `DONE` status badge.

---

### Section 18: `preview/app/history.tsx`
* **Path**: [src/components/landing/section/preview/app/history.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/app/history.tsx)
* **Purpose**: Renders the prediction log search panel inside the virtual application mockup.
* **Usage**: `<HistoryArea t={t} />`
* **Detailed Contents**:
  - **Header Actions**: Integrates interactive export buttons to download log reports in CSV or PDF format.
  - **Search & Filters**: Displays a mock search bar (`Search by ID or date...`) alongside a filter configuration dropdown.
  - **Paginated Logs Table**:
    - Iterates through the mock logs array (`HISTORY_DATA`), rendering clean tabular rows.
    - **Pagination Bar**: Renders page numbers (`1`, `2`, `3`) with gold border highlights on the active page block, alongside record indicators (`Showing 1–6 of 1,248`).

---

### Section 19: `preview/app/prediction.tsx`
* **Path**: [src/components/landing/section/preview/app/prediction.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/app/prediction.tsx)
* **Purpose**: Renders the forecast simulator page inside the virtual application mockup.
* **Usage**: `<PredictionArea t={t} />`
* **Detailed Contents**:
  - **Input Configuration Card**: Renders custom visual steppers for the two primary CART features: Ampere Per Cycle (`8.0 A`) and Daily Usage Hours (`9.0 hrs/day`).
  - **Run Prediction CTA**: Renders a large gold action button equipped with a Lucide `Play` icon.
  - **Latest Prediction Results**:
    - Renders a comprehensive results summary: predicted daily usage (`71.7 Ah`) alongside three custom metric cards (Working Days `22d`, Per Month average `71.7 Ah`, and Model Confidence score `94%`).
  - **Recent Simulator Runs**: Displays a history table showing past simulator outputs.

---

### Section 20: `preview/app/settings.tsx`
* **Path**: [src/components/landing/section/preview/app/settings.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/preview/app/settings.tsx)
* **Purpose**: Renders system configuration and researcher profile cards.
* **Usage**: `<SettingsArea t={t} />`
* **Detailed Contents**:
  - **CART Hyperparameters Card**: Displays the core mathematical constants used by the model:
    - Algorithm: `CART Decision Tree`
    - Max Depth: `5`
    - Min Samples: `2`
    - Gain Function: `Regression`
    - Split Function: `Mean`
  - **System Preferences Card**: Displays selectable language options (English, Indonesian) and file export formats (CSV, PDF), with gold border highlights on the active settings.
  - **Researcher Profile Card**: Displays researcher details (name, Pancasakti University Tegal, Informatics program, 2026 academic year).

---

### Section 21: `research/discover.tsx`
* **Path**: [src/components/landing/section/research/discover.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/research/discover.tsx)
* **Purpose**: A comprehensive research block that structures resources, access info, and features dynamic persona preview tabs.
* **Usage**: `<Discover />`

#### Persona Tabs & Bento Grid Mechanics
The component uses a bento grid structure to display different content based on the active user persona tab (Administrators, Operators, Engineers, Students):
* **Headless Tabs trigger**: Renders a flat text-tab selector using custom Base UI rules:
  ```typescript
  className="w-full justify-start h-auto border-b border-border-gold overflow-x-auto"
  ```
* **Bento Grid Container**:
  - Implements a asymmetric grid layout: `grid grid-cols-1 lg:grid-cols-[40%_60%] rounded-b-2xl overflow-hidden border-x border-b border-border-gold`.
  - **Left Card (Brand Gold)**:
    - Colored entirely in brand gold (`bg-gold text-bg`).
    - **Dynamic Seeded Image**: Displays an image from Picsum. It dynamically varies the image seed based on the active tab using the `TAB_SEEDS` dictionary to ensure relevant visual mockups:
      ```typescript
      const TAB_SEEDS = { students: "elpresy-students", administrators: "elpresy-admin", ... }
      ```
    - **Image Tooltips & Actions**: Incorporates dynamic graphic overlay controls: zoom-in/zoom-out buttons, and a "Save to Workspace" bookmark button.
    - Displays the main persona heading, explanation subtext, and custom CTA action link.
  - **Right Column (Two Stacked Cards)**:
    - Card 1: Resources list (`bg-surface-2`) displaying a vertical stack of links (`LINKS`) wrapped in subtle hover overlays (`hover:bg-[rgba(201,168,76,0.05)]`).
    - Card 2: System Access details (`bg-[#27272A]`) explaining integration steps.

---

### Section 22: `research/explore.tsx`
* **Path**: [src/components/landing/section/research/explore.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/research/explore.tsx)
* **Purpose**: Renders the FAQ section using highly-customized Base UI accordions.
* **Usage**: `<Explore />`

#### Customized Base UI Accordion Configuration
The component overrides standard Base UI accordion styles to fit a minimalist, flat layout design:
* **Overriding Styles & Selectors**:
  - Sets the Accordion wrapper borders to zero: `className="border-0 rounded-none divide-y divide-border-gold overflow-hidden"`.
  - **Trigger Custom Chevrons**:
    - The primitive `<AccordionTrigger>` component includes standard chevrons.
    - The component hides these standard chevrons using a target CSS selector:
      ```typescript
      className="... **:data-[slot='accordion-trigger-icon']:hidden"
      ```
    - It then inserts a custom Lucide `ChevronDown` icon inside the trigger. This custom icon is styled to rotate 180 degrees when expanded: `group-aria-expanded/accordion-trigger:rotate-180`.
  - **Array Default Value**:
    - Under Base UI, the accordion's `defaultValue` prop expects an array of strings rather than a single string:
      ```typescript
      defaultValue={["item-engine"]}
      ```

---

### Section 23: `workflow/header.tsx`
* **Path**: [src/components/landing/section/workflow/header.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/workflow/header.tsx)
* **Purpose**: Renders the workflow section header.
* **Usage**: `<Header t={t} />`

---

### Section 24: `workflow/powered.tsx`
* **Path**: [src/components/landing/section/workflow/powered.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/workflow/powered.tsx)
* **Purpose**: Renders the model credit badge.
* **Usage**: `<Powered t={t} />`
* **Detailed Contents**:
  - Displays a centered monospace tag (`bg-surface-2 border border-border text-sm`) indicating that the system is powered by the CART Decision Tree Regression model.

---

### Section 25: `workflow/steps.tsx`
* **Path**: [src/components/landing/section/workflow/steps.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/section/workflow/steps.tsx)
* **Purpose**: Renders the three sequential steps to use the system.
* **Usage**: `<Steps t={t} />`
* **Key Visual Elements**:
  - **Connecting Step Line (Desktop)**:
    - Renders a horizontal dashed gold line behind the steps on desktop screens:
      ```typescript
      className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-gold/30 -z-10"
      ```
  - **Step Cards**:
    - Displays three step cards (01, 02, 03).
    - Step numbers are wrapped in large circular containers (`w-24 h-24 rounded-full`) that glow on hover.

---

## 9. Developer Guide & Usage Reference

When writing features or modifying pages, refer to these code usage patterns:

### Adding New Nav links
Update the `Links` array in [navbar.tsx](file:///d:/Kuliah/Skripsi/Aplikasi/v1/src/components/landing/layout/navbar.tsx):
```typescript
const Links = [
  { label: t("newLink"), href: "#new-section" },
];
```
*Note: Make sure to add the corresponding `id="new-section"` to the target section element so that the scroll-tracking observer in `desktop.tsx` detects it correctly.*

### Utilizing Headless UI components
Use the custom primitives located in `src/components/ui/` for accessible, styled components:

#### 1. Button Usage
```tsx
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

<Button variant="default" size="lg" onClick={handleSave}>
  <PlusIcon /> {/* Sized automatically to 4x4 */}
  <span>Save Prediction</span>
</Button>
```

#### 2. Badge Usage
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="outline">
  CART Hyperparameter
</Badge>
```

#### 3. Polymorphic Badge rendering (rendering as an anchor tag `<a>`)
```tsx
<Badge variant="link" render={<a href="https://github.com" target="_blank" />}>
  View Source Code
</Badge>
```

#### 4. Sheet Panel Usage
```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger>Open Drawer</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Log Details</SheetTitle>
      <SheetDescription>Verify prediction metrics</SheetDescription>
    </SheetHeader>
    {/* Drawer Content */}
  </SheetContent>
</Sheet>
```
