<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skills-agent-rules -->
# Always consult rules before skills

Before acting on any prompt that may involve skills, read `RULES.md` first and follow it exactly. `RULES.md` defines the mandatory access policy for installed skills and must be treated as higher-priority operational guidance for skill discovery and usage.

Do not search, list, inspect, or read anything inside `.agents/skills/` until `RULES.md` has been read for the current task. If `RULES.md` instructs you to read `SKILLS.md` before accessing `.agents/skills/`, you must do that first and follow the declared skill inventory and locations from `SKILLS.md`.

Only after completing the checks required by `RULES.md` may you access relevant skill documentation under `.agents/skills/`. Do not skip this sequence — the rules and skill files contain curated constraints, best practices, and repository-specific requirements that must inform your output.

After completing the steps above, proceed immediately to read `DESIGN.md` as described in the `design-agent-rules` block below.
<!-- END:skills-agent-rules -->

<!-- BEGIN:design-agent-rules -->
# Always read the project design system before writing any UI or styling code

You must read the file `DESIGN.md` located at the root of this repository in its entirety before writing, modifying, reviewing, or generating any code that relates to UI components, visual styling, color tokens, typography, spacing, layout, iconography, or any design-system decisions.

`DESIGN.md` is the authoritative source of truth for this project's design system. It contains semantic color tokens, typography scales, component conventions, spacing units, and visual guidelines that are specific to this repository and may differ significantly from general knowledge or external design systems.

Follow these rules exactly:
1. Read `DESIGN.md` from top to bottom before producing any design-related output.
2. Do not assume token names, color values, font choices, or component patterns. Always derive them from `DESIGN.md`.
3. If a design decision is not covered by `DESIGN.md`, state the gap explicitly and ask for clarification rather than guessing.
4. Treat `DESIGN.md` as higher-priority design guidance than any external framework documentation, your training data, or general UI conventions.
5. Never skip this step even for small or seemingly trivial UI changes — a single token or class name may be project-specific.

After completing this step, proceed immediately to read `PROJECT.md` as described in the `project-agent-rules` block below.
<!-- END:design-agent-rules -->

<!-- BEGIN:project-agent-rules -->
# Always read the full project context before writing any application code

You must read the file `PROJECT.md` located at the root of this repository in its entirety before writing, modifying, reviewing, scaffolding, or generating any application code, business logic, data models, API routes, database schemas, or feature implementations.

`PROJECT.md` is the authoritative source of truth for this project's architecture, domain model, feature specifications, data structures, naming conventions, module boundaries, and implementation guidelines. It contains decisions and constraints that are specific to this repository and must not be overridden by general knowledge or assumptions.

Follow these rules exactly:
1. Read `PROJECT.md` from top to bottom before producing any application-level output.
2. Do not assume module names, entity relationships, field names, business rules, or feature scope. Always derive them from `PROJECT.md`.
3. If a requirement is ambiguous or not covered by `PROJECT.md`, state the gap explicitly and ask for clarification rather than guessing.
4. Treat `PROJECT.md` as the highest-priority application context, overriding your training data, general framework conventions, and any inferred assumptions from directory structure.
5. Never skip this step — even a single field name, relation, or enum value may be project-specific and critical to correctness.
6. After reading `PROJECT.md`, cross-reference any relevant design decisions with `DESIGN.md` to ensure visual and structural consistency.
<!-- END:project-agent-rules -->