# Installed Skills

Below is the list of installed skills in the `.agents/skills` directory, formatted in a highly structured, YAML-based schema inspired by `pnpm-lock.yaml`.

```yaml
skillsVersion: '1.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

skills:
  canvas-design:
    specifier: workspace:*
    location: .agents/skills/canvas-design
    description: >
      Create beautiful visual art in .png and .pdf documents using design philosophy.
      You should use this skill when the user asks to create a poster, piece of art,
      design, or other static piece. Create original visual designs, never copying
      existing artists' work to avoid copyright violations.

  color-palette:
    specifier: workspace:*
    location: .agents/skills/color-palette
    description: >
      Generate complete, accessible colour palettes from a single brand hex.
      Produces 11-shade scale (50-950), semantic tokens, dark mode variants,
      Tailwind v4 CSS output, WCAG contrast checks. Use whenever the user
      supplies a brand hex and asks for a palette, mentions setting up a design
      system, wants Tailwind theme colours from a brand colour, or asks to
      check colour accessibility / contrast.

  design-md:
    specifier: workspace:*
    location: .agents/skills/design-md
    description: >
      Analyze Stitch projects and synthesize a semantic design system into
      DESIGN.md files.

  frontend-design:
    specifier: workspace:*
    location: .agents/skills/frontend-design
    description: >
      Create distinctive, production-grade frontend interfaces with high design
      quality. Use this skill when the user asks to build web components, pages,
      artifacts, posters, or applications (examples include websites, landing
      pages, dashboards, React components, HTML/CSS layouts, or when styling/
      beautifying any web UI). Generates creative, polished code and UI design
      that avoids generic AI aesthetics.

  next-best-practices:
    specifier: workspace:*
    location: .agents/skills/next-best-practices
    description: >
      Next.js best practices - file conventions, RSC boundaries, data patterns,
      async APIs, metadata, error handling, route handlers, image/font
      optimization, bundling.

  prisma-cli:
    specifier: workspace:*
    location: .agents/skills/prisma-cli
    description: >
      Prisma CLI commands reference covering all available commands, options,
      and usage patterns. Use when running Prisma CLI commands, setting up
      projects, generating client, running migrations, managing databases,
      or starting Prisma's MCP server. Triggers on "prisma init", "prisma
      generate", "prisma migrate", "prisma db", "prisma studio", "prisma mcp".

  prisma-client-api:
    specifier: workspace:*
    location: .agents/skills/prisma-client-api
    description: >
      Prisma Client API reference covering model queries, filters, operators,
      and client methods. Use when writing database queries, using CRUD
      operations, filtering data, or configuring Prisma Client. Triggers on
      "prisma query", "findMany", "create", "update", "delete", "$transaction".

  prisma-database-setup:
    specifier: workspace:*
    location: .agents/skills/prisma-database-setup
    description: >
      Guides for configuring Prisma with different database providers (PostgreSQL,
      MySQL, SQLite, MongoDB, etc.). Use when setting up a new project, changing
      databases, or troubleshooting connection issues. Triggers on "configure
      postgres", "connect to mysql", "setup mongodb", "sqlite setup".

  prisma-driver-adapter-implementation:
    specifier: workspace:*
    location: .agents/skills/prisma-driver-adapter-implementation
    description: >
      Required reference for Prisma v7 driver adapter work. Use when implementing
      or modifying adapters, adding database drivers, or touching SqlDriverAdapter/
      Transaction interfaces. Contains critical contract details not inferable from
      code examples — including the transaction lifecycle protocol, error mapping
      requirements, and verification checklist. Existing implementations do not
      replace this skill.

  prisma-postgres:
    specifier: workspace:*
    location: .agents/skills/prisma-postgres
    description: >
      Prisma Postgres setup and operations guidance across Console, create-db CLI,
      Management API, and Management API SDK. Use when creating Prisma Postgres
      databases, working in Prisma Console, provisioning with create-db/create-pg/
      create-postgres, or integrating programmatic provisioning with service tokens
      or OAuth.

  prisma-postgres-setup:
    specifier: workspace:*
    location: .agents/skills/prisma-postgres-setup
    description: >
      Set up a new Prisma Postgres database and connect it to a local project using
      the Management API. Use when asked to "set up a database", "create a Prisma
      Postgres project", "get a connection string", "connect my app to Prisma Postgres",
      or "provision a database".

  responsive-design:
    specifier: workspace:*
    location: .agents/skills/responsive-design
    description: >
      Implement modern responsive layouts using container queries, fluid typography,
      CSS Grid, and mobile-first breakpoint strategies. Use when building adaptive
      interfaces, implementing fluid layouts, or creating component-level responsive
      behavior.

  shadcn:
    specifier: workspace:*
    location: .agents/skills/shadcn
    description: >
      Manages shadcn components and projects — adding, searching, fixing, debugging,
      styling, and composing UI. Provides project context, component docs, and usage
      examples. Applies when working with shadcn/ui, component registries, presets,
      --preset codes, or any project with a components.json file. Also triggers for
      "shadcn init", "create an app with --preset", or "switch to --preset".

  tailwind-design-system:
    specifier: workspace:*
    location: .agents/skills/tailwind-design-system
    description: >
      Build scalable design systems with Tailwind CSS v4, design tokens, component
      libraries, and responsive patterns. Use when creating component libraries,
      implementing design systems, or standardizing UI patterns.

  vercel-react-best-practices:
    specifier: workspace:*
    location: .agents/skills/vercel-react-best-practices
    description: >
      React and Next.js performance optimization guidelines from Vercel Engineering.
      This skill should be used when writing, reviewing, or refactoring React/Next.js
      code to ensure optimal performance patterns. Triggers on tasks involving React
      components, Next.js pages, data fetching, bundle optimization, or performance
      improvements.

  vercel-react-native-skills:
    specifier: workspace:*
    location: .agents/skills/vercel-react-native-skills
    description: >
      React Native and Expo best practices for building performant mobile apps. Use
      when building React Native components, optimizing list performance, implementing
      animations, or working with native modules. Triggers on tasks involving React
      Native, Expo, mobile performance, or native platform APIs.

  vercel-react-view-transitions:
    specifier: workspace:*
    location: .agents/skills/vercel-react-view-transitions
    description: >
      Guide for implementing smooth, native-feeling animations using React's View
      Transition API (`<ViewTransition>` component, `addTransitionType`, and CSS
      view transition pseudo-elements). Use this skill whenever the user wants to
      add page transitions, animate route changes, create shared element animations,
      animate enter/exit of components, animate list reorder, implement directional
      (forward/back) navigation animations, or integrate view transitions in Next.js.
      Also use when the user mentions view transitions, `startViewTransition`,
      `ViewTransition`, transition types, or asks about animating between UI states
      in React without third-party animation libraries.

  web-design-guidelines:
    specifier: workspace:*
    location: .agents/skills/web-design-guidelines
    description: >
      Review UI code for Web Interface Guidelines compliance. Use when asked to
      "review my UI", "check accessibility", "audit design", "review UX", or
      "check my site against best practices".

  shadcn-ui:
    specifier: workspace:*
    location: .agents/skills/shadcn-ui
    description: >
      Expert guidance for integrating and building applications with shadcn/ui components,
      including component discovery, installation, customization, and best practices.
```
