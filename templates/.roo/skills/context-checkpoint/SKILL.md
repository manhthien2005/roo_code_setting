---
name: context-checkpoint
description: Save progress to a markdown file when context grows large or after many tool calls, preserving key decisions and state for continuity.
---

# Context Checkpoint

## When to Use

Trigger this skill when:
- Context window usage exceeds ~70% (conversation feels long, >30 tool calls)
- You notice repeated information or context drift
- Before a complex multi-step operation that may fill remaining context
- User explicitly asks to "save progress" or "checkpoint"

## Instructions

1. **Create checkpoint file** at `plans/checkpoint-{date}.md` with this structure:

```markdown
# Checkpoint — {brief task description}
Date: {ISO date}

## Current Task
{What we're doing and why}

## Completed
{Numbered list of completed steps with outcomes}

## In Progress
{Current step, what's been tried, current state}

## Key Decisions
{Important decisions made and their rationale}

## Key Files Modified
{File paths with brief description of changes}

## Remaining Work
{What still needs to be done}

## Context for Next Session
{Anything critical the next context window needs to know}
```

2. **After creating checkpoint**, inform the user: "Progress saved to `plans/checkpoint-{date}.md`. If context gets condensed, key state is preserved."

3. **When resuming from checkpoint**, read the latest checkpoint file first before continuing work.

## Important

- Keep checkpoints CONCISE — bullet points, not paragraphs
- Include file paths and line numbers for modified code
- Capture the WHY behind decisions, not just the WHAT
- One checkpoint per task, overwrite if updating
