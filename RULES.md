# RULES.md

## Agent operating rules

You are working in a repository that uses an installed-skill inventory file named `SKILLS.md`.
The authoritative skills directory is `.agents/skills/*`.
`SKILLS.md` is the source of truth for which skills are installed and allowed to be used.

Your behavior must follow these rules exactly.

### Primary rule
1. Before reading, opening, searching, listing, indexing, or using any file or folder inside `.agents/skills/`, you must read `SKILLS.md` first, from top to bottom.
2. Treat `SKILLS.md` as the authoritative inventory of installed skills.
3. Do not assume a skill is available only because a folder exists under `.agents/skills/`.
4. Do not scan `.agents/skills/` preemptively to discover skills.
5. Do not load every installed skill by default. Only consider a skill after confirming it is listed in `SKILLS.md` and is relevant to the current task.

### Required startup sequence
Follow this sequence in order for every new task that may involve skills:
1. Check whether `SKILLS.md` exists in the project context.
2. Read `SKILLS.md` completely before accessing `.agents/skills/`.
3. Parse the installed skills from the `skills:` section of `SKILLS.md`.
4. Build your allowed-skill list only from entries declared under `skills:`.
5. For any skill you decide to use, verify its declared `location` points to `.agents/skills/<skill-name>` or another path explicitly defined in `SKILLS.md`.
6. Only after completing the steps above may you access the matching files or folders under `.agents/skills/` for the specific relevant skill.

### Source-of-truth policy
- `SKILLS.md` is authoritative for installed skills, their names, and their declared locations.
- The `skills:` mapping in `SKILLS.md` defines the valid installed skill set.
- Each skill entry may include metadata such as `specifier`, `location`, and `description`; this metadata may be used only after `SKILLS.md` has been read.
- Folder names inside `.agents/skills/` are not authoritative on their own.

### Skill access policy
- If a skill is listed under `skills:` in `SKILLS.md`, you may access its corresponding files only when needed for the user’s request.
- If a skill is not listed in `SKILLS.md`, treat it as unavailable, even if a similarly named folder exists under `.agents/skills/`.
- If a folder exists under `.agents/skills/` but its skill is absent from `SKILLS.md`, ignore that folder unless the user explicitly instructs otherwise.
- If `SKILLS.md` lists a skill but the declared `location` is missing, unreadable, or inconsistent, report the mismatch clearly before proceeding.
- Prefer the exact skill name as declared in `SKILLS.md`; do not invent aliases unless `SKILLS.md` explicitly defines them.

### Conflict handling
If there is any conflict between instructions or files, follow this priority order:
1. User's direct instruction
2. `RULES.md`
3. `SKILLS.md`
4. Files inside `.agents/skills/`
5. Inferred assumptions from directory contents

If `RULES.md` and `SKILLS.md` appear to conflict, obey the access-control behavior in `RULES.md` first, then use `SKILLS.md` as the inventory of installed skills.

### Directory access restrictions
Until `SKILLS.md` has been read for the current task, you must not:
- list `.agents/skills/` to discover available skills,
- search inside `.agents/skills/` for candidate skills,
- open any file inside `.agents/skills/`,
- infer installed skills from folder names under `.agents/skills/`,
- cite or rely on any skill documentation from `.agents/skills/`.

### Parsing rules for `SKILLS.md`
When reading `SKILLS.md`, apply these parsing rules:
1. Treat the file as a structured inventory document containing a YAML-style schema.
2. Use the top-level `skills:` section as the only authoritative list of installed skills.
3. Interpret each first-level key under `skills:` as an installed skill name.
4. For each installed skill, read its declared metadata fields such as:
   - `specifier`
   - `location`
   - `description`
5. Do not treat headings, explanatory prose, examples, comments, or formatting text outside the declared `skills:` entries as installed skills.
6. Preserve skill names exactly as written, including hyphens and casing.
7. Do not infer unlisted parent, child, related, or peer skills.
8. If the file contains malformed YAML-like content, extract only the entries that are unambiguous and report the ambiguity.

### Relevance rule
Even when a skill is installed, do not access it automatically.
A skill must satisfy both conditions before you use it:
1. It is explicitly listed in `SKILLS.md` under `skills:`.
2. It is relevant to the current user request based on its name, description, or declared purpose in `SKILLS.md`.

### Skill selection procedure
When a task may require a skill, do this in order:
1. Read `SKILLS.md` first.
2. Parse all installed skill names from the `skills:` section.
3. Compare the task against the descriptions in `SKILLS.md` to identify relevant candidates.
4. Select only the minimum necessary skill or skills.
5. Access only the selected skill folders under the declared `.agents/skills/...` paths.
6. Ignore unrelated installed skills.
7. If no relevant skill is listed, proceed without accessing `.agents/skills/` and say that no installed skill in `SKILLS.md` applies.

### Error handling
- If `SKILLS.md` does not exist in the user’s project, stop and report: `SKILLS.md not found; cannot verify installed skills before accessing .agents/skills.`
- If `SKILLS.md` is unreadable, stop and report that installed-skill verification failed.
- If `SKILLS.md` exists but has no parseable `skills:` section, stop and report that no authoritative installed-skill inventory could be determined.
- If a requested skill is not listed in `SKILLS.md`, state that it is not installed according to the inventory and do not access `.agents/skills/` for it.
- If `SKILLS.md` lists a skill whose declared location does not exist, report the mismatch and ask whether to continue without that skill.
- If the user explicitly asks you to inspect `.agents/skills/`, you must still read `SKILLS.md` first before doing so.

### Decision rule
Use this decision logic every time:
- Need a skill? Read `SKILLS.md` first.
- Skill not listed under `skills:` in `SKILLS.md`? Do not use it.
- Skill listed under `skills:` in `SKILLS.md`? Access only its declared location under `.agents/skills/...` if it is relevant.
- No relevant listed skill? Do not access `.agents/skills/`.

### Compliance checklist
For any task involving skills, your internal checklist is:
- `SKILLS.md` checked
- `skills:` section parsed
- Installed skills identified exactly
- Relevant skills selected minimally
- Declared locations verified
- Only then `.agents/skills/` accessed

### Short enforcement prompt
Use this as the minimal operational reminder:

> Read `SKILLS.md` first before any access to `.agents/skills/`. Treat the `skills:` section in `SKILLS.md` as the source of truth for installed skills. Only access documentation for skills explicitly listed there, at their declared locations, and only when relevant to the task.

### Strict instruction block
The following instruction must be followed exactly:

> Never access, inspect, search, list, or infer from `.agents/skills/` before first reading `SKILLS.md`. The `skills:` section in `SKILLS.md` is the authoritative inventory of installed skills. Only skills explicitly declared there may be used, and only when relevant to the user’s request. If `SKILLS.md` is missing, unreadable, or ambiguous, stop and report the issue instead of guessing.