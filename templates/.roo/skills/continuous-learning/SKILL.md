---
name: continuous-learning
description: Capture lessons learned, patterns, and user preferences after complex sessions to improve agent behavior over time.
risk: safe
source: self
tags: [learning, patterns, improvement]
---
# Continuous Learning

## When to Use
- End of complex sessions (>50 tool calls or multi-phase tasks)
- When user requests "save learnings" or "what did you learn?"
- After encountering and fixing a difficult bug (to prevent recurrence)

## Instructions

1. **Review session** — summarize:
   - What was the task? What approach was used?
   - Outcome: success or issues encountered?
   - Anything unexpected or different from expectations?

2. **Extract patterns** — categorize:
   - **Worked Well**: approach/tool/pattern effective for this problem type
   - **Mistakes & Lessons**: error encountered → root cause → prevention
   - **User Preferences**: observed coding style, communication style, tooling preferences

3. **Append to `.roo/learnings/patterns.md`**:
   ```markdown
   ## {date} — {task summary}
   ### Worked Well
   - {pattern}: {why it worked}
   ### Mistakes & Lessons
   - {mistake}: Root cause: {why}. Prevention: {how to avoid}
   ### User Preferences
   - {preference observed}
   ```

4. **Maintain Top Patterns section** — keep a `## Top Patterns` section at the TOP of the file (lines 1-15) with the 5-10 most impactful, frequently-reused patterns. This section is what gets auto-read at session start per `core-principles.md` Session Initialization rule.
   ```markdown
   ## Top Patterns (auto-read at session start)
   1. {pattern}: {one-line description}
   2. ...
   ```

5. **Trim if needed** — if file >100 lines:
   - Keep 20 most recent entries
   - Archive older entries to `.roo/learnings/archive.md`
   - Merge duplicate patterns
   - Always preserve the `## Top Patterns` section at the top

6. **Report**: "Learnings saved. {N} patterns captured."

## Important
- NEVER record secrets, credentials, or PII in learnings files
- Keep entries concise — 1-2 lines per item
- Only record reusable patterns; skip one-off issues
- User may edit/delete entries — respect user curation
- `core-principles.md` auto-reads this file at session start — keep Top Patterns current
- The auto-read loop: `continuous-learning` writes → `core-principles.md` reads → better decisions → `continuous-learning` captures → cycle repeats
