<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skills-rules -->
# Always consult rules before skills

Before acting on any prompt that may involve skills, read `RULES.md` first and follow it exactly. `RULES.md` defines the mandatory access policy for installed skills and must be treated as higher-priority operational guidance for skill discovery and usage.

Do not search, list, inspect, or read anything inside `.agents/skills/` until `RULES.md` has been read for the current task. If `RULES.md` instructs you to read `SKILLS.md` before accessing `.agents/skills/`, you must do that first and follow the declared skill inventory and locations from `SKILLS.md`.

Only after completing the checks required by `RULES.md` may you access relevant skill documentation under `.agents/skills/`. Do not skip this sequence — the rules and skill files contain curated constraints, best practices, and repository-specific requirements that must inform your output.
<!-- END:skills-rules -->