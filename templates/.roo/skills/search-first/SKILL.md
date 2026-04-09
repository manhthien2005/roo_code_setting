---
name: search-first
description: Enforce research-before-implementation workflow to reduce duplication and hallucination. Mandatory before creating new files or functions in Code mode.
risk: safe
source: self
tags: [search, deduplication, research]
---

# Search First

## When to Use

Trigger BEFORE creating ANY new file, function, or component in Code mode. This is mandatory for medium+ tasks.

## Instructions

### Step 1: Semantic Search
```
codebase_search("description of what you're about to implement")
```
Look for existing implementations that solve ≥80% of the requirement.

### Step 2: Pattern Search
```
search_files(path, "regex for similar function/class names")
```
Check for naming conventions, similar utilities, or partial implementations.

### Step 3: Dependency Check
- Read `package.json` (or equivalent) for existing utilities
- Check imports in related files for shared helpers
- Look for utility/helper directories (`utils/`, `lib/`, `helpers/`, `shared/`)

### Step 4: Document Findings

**Mandatory output before implementing:**

```
Search Evidence:
- Searched: [what you searched for]
- Found: [file:line — brief description] OR "No existing match found"
- Decision: [Reuse/Extend existing | Create new — reason]
```

### Decision Matrix

| Match Level | Action |
|-------------|--------|
| ≥80% match | Reuse — import and use existing code |
| 50-80% match | Extend — modify existing to cover new case |
| <50% match | Create new — but follow existing patterns |
| No match | Create new — document as first implementation of this pattern |

## Important

- Search takes 30 seconds. Duplicating code wastes hours.
- If you find a match, ALWAYS prefer reuse over recreation.
- This skill complements Phase 0 in `development-workflow.md`.
