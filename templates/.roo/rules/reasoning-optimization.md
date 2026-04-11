# Reasoning Optimization — All Modes

## Extended Thinking
- For complex problems (architecture, debugging, refactoring): use the step-back technique
  - "Before answering, ask yourself: What is the core problem here?"
  - Break complex problems into sub-problems before solving
- For simple tasks (typo fix, config change): answer directly, do not over-think

## Reasoning Effort per Task Type
| Task Type | Reasoning Approach | Example |
|-----------|-------------------|---------| 
| Trivial (typo, rename) | Direct action, minimal reasoning | Fix spelling in README |
| Small (single file) | Brief analysis → implement | Add validation to a function |
| Medium (multi-file) | Step-back → plan → implement → verify | Add new API endpoint |
| Large (architecture) | Deep analysis → decompose → multiple phases | Refactor authentication system |
| Debug (root cause) | Hypothesis → evidence → test → conclude | Fix intermittent test failure |

## Complexity Indicators (Decision Tree)
| Keyword/Signal | → Level | Workflow |
|----------------|---------|----------|
| typo, rename, config change | Trivial | Direct action |
| fix bug in single file, add validation | Small | Brief analysis → implement |
| new endpoint, multi-file feature, refactor module | Medium | Plan → implement → verify |
| architecture change, new system, migration | Large | Architect mode → phased plan |
| error, failing test, unexpected behavior | Debug | Hypothesis → evidence → test |

## Chain-of-Thought Guidance
- When facing ambiguity: list all interpretations before choosing
- When estimating impact: consider 1st order + 2nd order effects
- When comparing options: use a pro/con matrix or decision table
- When debugging: state the hypothesis explicitly before testing

## Context Window Efficiency
- Prioritize quality reasoning over verbose output
- When context > 60%: summarize decisions so far, do not repeat known context
- Every step must add value — if a step does not change the outcome, skip it
- Prefer concise "show your work" over long explanatory paragraphs

## HARD RULES
- MUST assess task complexity BEFORE reasoning — trivial tasks get direct action, not essays.
- MUST NOT repeat known context just to appear thorough — summarize and reference.
- MUST state uncertainty level (HIGH/MEDIUM/LOW) with evidence when making claims.
- MUST use step-back technique for complex problems: "What is the core problem here?"
- MUST NOT produce verbose output when concise output suffices — quality reasoning > word count.
