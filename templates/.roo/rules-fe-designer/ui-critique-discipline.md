mcp# UI Critique Discipline — FE Designer Mode

> **v2 Enhancement**: This rule enforces self-critique before completing any styling task. The agent MUST evaluate its own output as a Design Critic before claiming completion.

## Purpose

An AI agent cannot see rendered output. This rule compensates by forcing structured self-evaluation of every design decision through code-analyzable criteria. The agent acts as its own Design Critic.

## Mandatory Self-Critique Checklist

Before `attempt_completion` or delivering any styling work, the agent MUST run through ALL of these checks and report findings:

### 1. Visual Hierarchy Check
- [ ] Is the most important element the most visually prominent? (largest text, strongest color, most whitespace around it)
- [ ] Can a user identify the primary action within 3 seconds? (CTA should be the highest-contrast interactive element)
- [ ] Is there a clear reading order? (F-pattern for content pages, Z-pattern for landing pages)
- [ ] Are heading sizes following the type scale with sufficient contrast between levels?
- [ ] Is font-weight difference ≥200 between heading and body text?

### 2. CTA (Call-to-Action) Clarity Check
- [ ] Primary CTA uses `variant="primary"` or equivalent highest-contrast style
- [ ] Secondary actions are visually subordinate (outline, ghost, or lower contrast)
- [ ] No more than 1 primary CTA per viewport section
- [ ] CTA text is action-oriented ("Save changes" not "Submit")
- [ ] CTA has sufficient padding — minimum `space-3` (12px) vertical, `space-5` (24px) horizontal

### 3. Cognitive Load Assessment
- [ ] No more than 7±2 distinct visual groups per viewport (Miller's Law)
- [ ] Related items are grouped with consistent internal spacing
- [ ] Whitespace ratio is appropriate — content should "breathe"
- [ ] No wall-of-text — paragraphs broken into digestible chunks
- [ ] Progressive disclosure used for complex information (show summary, expand for detail)

### 4. Spacing Consistency Check
- [ ] All spacing values are from the design token scale (space-1 through space-8)
- [ ] Intra-group spacing < inter-group spacing (Proximity principle)
- [ ] Consistent padding within all components of the same type
- [ ] Section separators use consistent spacing (space-6 or space-7)
- [ ] No arbitrary gaps or margins that break the rhythm

### 5. Layout Reflects User Task Priority
- [ ] Most-used features are most accessible (not buried in menus)
- [ ] Error states and validation are immediately visible near the relevant field
- [ ] Navigation follows expected conventions (logo top-left, nav top-right or left sidebar)
- [ ] Footer contains supplementary info only — never critical actions
- [ ] Mobile layout prioritizes primary task — secondary features collapse or hide

### 6. Color & Contrast Audit
- [ ] Color usage follows 60-30-10 rule (60% neutral, 30% primary, 10% accent)
- [ ] Semantic colors used correctly (red=error, green=success, amber=warning)
- [ ] No color conveys information alone — paired with icon/text
- [ ] All text passes contrast ratio checks (documented or token-verified)

## Critique Output Format

The self-critique MUST be included in the response as a section:

```markdown
## Design Critique

### ✅ Passed
- Visual hierarchy: H1 (text-2xl/700) → H2 (text-xl/600) → body (text-base/400)
- CTA: Single primary button with brand color, 48px height, clear action text
- Spacing: All values from token scale, consistent section gaps at space-6

### ⚠️ Warnings
- Cognitive load: 8 visual groups in hero section — consider consolidating
- Mobile CTA padding could be increased for touch targets

### ❌ Issues Found (MUST FIX)
- Secondary button has same visual weight as primary — reduce to outline variant
- Missing space between form fields — add space-4 gap
```

## When to Skip (Rare)

- Trivial changes: single token value update, typo in CSS comment
- Token-only changes: adding/modifying design tokens without component impact
- Documentation-only changes

For ALL other styling tasks, self-critique is MANDATORY.

## Integration with ui-critique Skill

This rule defines WHAT to check. The `ui-critique` skill provides the HOW — the step-by-step process for running the critique. When the skill is loaded, it extends this checklist with automated search patterns.

## Severity Scoring System

Every critique finding MUST be assigned a severity level. This replaces informal ✅/⚠️/❌ with a structured system:

| Level | Icon | Definition | Example |
|-------|------|------------|---------|
| **CRITICAL** | 🔴 | Blocks user from completing task | Broken layout, invisible text, no keyboard access, contrast < 3:1 |
| **MAJOR** | 🟠 | Significantly degrades experience | Poor contrast (3:1-4.5:1), confusing hierarchy, missing hover/focus states |
| **MINOR** | 🟡 | Polish issue | Inconsistent spacing, suboptimal token usage, minor alignment |
| **SUGGESTION** | 🔵 | Enhancement opportunity | Animation, micro-interaction, progressive disclosure, better grouping |

### Updated Critique Output Format

```markdown
## Design Critique

### 🔴 CRITICAL (must fix before completion)
- [accessibility] No keyboard access to dropdown menu — add arrow key navigation

### 🟠 MAJOR (should fix)
- [hierarchy] Secondary button has same visual weight as primary — reduce to outline variant

### 🟡 MINOR (nice to fix)
- [spacing] 14px gap between cards — should use space-4 (16px) token

### 🔵 SUGGESTION (consider)
- [interaction] Add subtle scale transition on card hover for affordance
```

**Rules**:
- All CRITICAL issues MUST be fixed before `attempt_completion`
- MAJOR issues SHOULD be fixed — justify if skipping
- MINOR and SUGGESTION can be documented and deferred

## Edge Case Critique Checklist

Every critique MUST evaluate how the component handles these states beyond the happy path:

| State | What to Check |
|-------|---------------|
| **Empty state** | What shows when there's no data? Helpful message + illustration? Or blank white space? |
| **Loading state** | Skeleton, spinner, or progress bar? `aria-busy="true"` set? |
| **Error state** | Clear error message? Recovery action available? Error color + icon? |
| **Content overflow** | Long text truncated with ellipsis or wraps gracefully? Tooltip for truncated text? |
| **RTL layout** | Logical properties used? Layout mirrors correctly? |
| **Long content/names** | What happens with a 200-character username or title? |
| **Slow network** | Optimistic UI or loading feedback? Images lazy-loaded? |
| **Multiple screen sizes** | Does it work at 320px? At 2560px? Content doesn't stretch/compress? |

### Golden Example — Edge Cases

```tsx
// ❌ WRONG: Component only handles happy path
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// ✅ RIGHT: All states handled
function UserList({ users, isLoading, error }) {
  if (isLoading) return <Skeleton count={3} aria-busy="true" />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (users.length === 0) return <EmptyState icon={UsersIcon} message="No users found" action={<Button>Invite users</Button>} />;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <span className="truncate max-w-[200px]" title={user.name}>{user.name}</span>
        </li>
      ))}
    </ul>
  );
}
```

## Nielsen's 10 Usability Heuristics — Quick Reference

Use this checklist to systematically evaluate UI against established usability principles:

| # | Heuristic | One-Line Description | UI Check Question |
|---|-----------|---------------------|-------------------|
| 1 | **Visibility of system status** | System informs user what's happening | Are loading, saving, and success states visible? |
| 2 | **Match between system and real world** | Uses familiar language and concepts | Does terminology match what users expect? |
| 3 | **User control and freedom** | Easy undo, cancel, and exit | Can users undo actions? Is there a clear "back" path? |
| 4 | **Consistency and standards** | Same words/actions mean same things | Are similar components styled and behaving identically? |
| 5 | **Error prevention** | Prevent errors before they happen | Are destructive actions confirmed? Are inputs validated inline? |
| 6 | **Recognition rather than recall** | Make options visible, reduce memory load | Are actions visible or do users need to remember where they are? |
| 7 | **Flexibility and efficiency of use** | Accelerators for expert users | Are keyboard shortcuts, search, or batch actions available? |
| 8 | **Aesthetic and minimalist design** | Only relevant information shown | Is every element necessary? Remove visual noise. |
| 9 | **Help users recognize, diagnose, recover from errors** | Clear error messages with solutions | Do error messages explain the problem AND suggest a fix? |
| 10 | **Help and documentation** | Easy to find and task-focused | Is contextual help available where users need it? |

## UX Psychology Laws — Design Decision Framework

Apply these cognitive psychology principles when evaluating and creating UI. Each law provides a testable criterion for critique.

| Law | Principle | Design Implication | Critique Question |
|-----|-----------|-------------------|-------------------|
| **Fitts's Law** | Time to target = f(distance / size) | Frequent actions → large targets, close together | Are primary actions large enough and positioned near related elements? |
| **Hick's Law** | Decision time ↑ with number of choices | Fewer options = faster decisions; use progressive disclosure | Does this screen present too many choices at once? Can we group or hide secondary options? |
| **Von Restorff Effect** | The distinctive item is remembered | CTA should visually stand out from everything else | Does the most important element look *different* from its surroundings? |
| **Serial Position Effect** | Users remember first and last items best | Place critical items at start/end of lists, navs, and menus | Are key actions/links at the beginning or end of navigation? |
| **Gestalt: Proximity** | Close elements are perceived as related | Group related items with tight spacing; separate unrelated with wide spacing | Is spacing consistently encoding relationships? |
| **Gestalt: Similarity** | Similar-looking elements perceived as related | Same style = same function; vary style to show difference | Do elements that behave the same look the same? |
| **Gestalt: Continuity** | Eyes follow smooth paths | Align elements on consistent grid lines and axes | Are elements aligned to a clear visual axis? |
| **Gestalt: Closure** | Brain completes incomplete shapes | Cards, containers, and grouped elements don't need full borders | Are containers/cards using minimal visual boundaries while maintaining grouping? |
| **Gestalt: Figure-Ground** | Users distinguish foreground from background | Modals, popovers, and elevated elements need clear separation from page | Is the active/foreground element clearly distinguished from the background? |
| **Miller's Law** | Working memory ≈ 7±2 chunks | Limit nav items, form sections, dashboard widgets to ~7 groups | How many distinct groups compete for attention in this viewport? (Count them) |
| **Jakob's Law** | Users expect your site to work like others | Follow platform conventions — don't reinvent standard patterns | Does this interaction follow the convention users learned elsewhere? |
| **Doherty Threshold** | System response < 400ms feels instant | Provide immediate visual feedback; use optimistic UI, skeleton screens | Will the user perceive a delay? If yes, what feedback fills the gap? |

### How to Apply During Critique

1. **Scan the layout** — identify the primary action, count visual groups (Miller's), check alignment (Gestalt: Continuity)
2. **Evaluate CTA prominence** — does it stand out? (Von Restorff) Is it large and accessible? (Fitts's)
3. **Check choices** — are there too many options visible? (Hick's) Can some be progressively disclosed?
4. **Verify navigation** — are key items first/last? (Serial Position) Does it follow conventions? (Jakob's)
5. **Assess grouping** — do related items cluster? (Proximity) Do same-function items look alike? (Similarity)
6. **Test responsiveness** — will interactions feel instant? (Doherty Threshold < 400ms)

### Golden Example — UX Psychology Laws

```tsx
// ❌ WRONG: Violates multiple UX psychology laws
function Dashboard() {
  return (
    <div>
      {/* 15+ equally-sized buttons — violates Miller's Law, Hick's Law */}
      <button>Report A</button> <button>Report B</button> <button>Report C</button>
      <button>Report D</button> <button>Report E</button> <button>Report F</button>
      <button>Report G</button> <button>Report H</button> <button>Report I</button>
      <button>Settings</button> <button>Profile</button> <button>Help</button>
      <button>Logout</button> <button>Export</button> <button>Import</button>
      {/* Primary CTA same size as others — violates Von Restorff, Fitts's Law */}
      <button>Create New Report</button>
    </div>
  );
}

// ✅ RIGHT: Applies UX psychology laws systematically
function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Von Restorff + Fitts's: Primary action is large, prominent, top-positioned */}
      <Button variant="primary" size="lg" className="w-full sm:w-auto">
        Create New Report
      </Button>

      {/* Miller's Law: Reports grouped into ≤7 categories with clear headings */}
      <section>
        <h2>Recent Reports</h2>
        {/* Gestalt Proximity: tight gap within group */}
        <div className="grid gap-3">
          <ReportCard name="Report A" /> {/* First = Serial Position */}
          <ReportCard name="Report B" />
          <ReportCard name="Report C" />
        </div>
        {/* Hick's Law: "View all" instead of showing 15+ reports */}
        <Button variant="link">View all reports →</Button>
      </section>

      {/* Jakob's Law: Standard sidebar nav with conventional placement */}
      {/* Serial Position: Most-used items first and last */}
    </div>
  );
}
```

## 3-Second First Impression Test

A rapid evaluation methodology to verify that a page communicates its purpose immediately. The agent MUST mentally simulate a first-time user seeing the page.

### The 3 Questions (answer all within 3 seconds of viewing)

| # | Question | What to Look For |
|---|----------|-----------------|
| 1 | **What is this page about?** | Clear headline, descriptive title, recognizable layout pattern |
| 2 | **What can I do here?** | Visible primary CTA, clear interactive affordances, obvious next step |
| 3 | **Why should I care?** | Value proposition visible, benefit-oriented copy, trust signals |

### How to Apply

1. Look at the page layout/component structure as if seeing it for the first time
2. Answer each question based solely on above-the-fold content
3. If ANY question cannot be answered → the page needs hierarchy/layout work

### Failure Indicators

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Cannot determine page purpose | Headline too vague or missing | Add clear, specific H1 |
| No obvious next step | CTA buried or indistinguishable | Increase CTA size, contrast, and position (above fold) |
| No clear value | Generic or feature-focused copy | Rewrite with user benefit first |
| Too much competing content | Information overload | Apply progressive disclosure (Hick's Law) |
| Layout unfamiliar | Novel pattern instead of convention | Follow Jakob's Law — use standard layouts |

### Golden Example — 3-Second Test

```html
<!-- ❌ FAILS 3-Second Test: What is this? What can I do? Why should I care? -->
<div class="page">
  <nav>...</nav>
  <div class="content">
    <p>Welcome to our platform. We offer a variety of services
       that can help you in many ways.</p>
    <div class="features">
      <div>Feature 1</div>
      <div>Feature 2</div>
      <div>Feature 3</div>
      <!-- ... 10 more features, no hierarchy -->
    </div>
    <small><a href="/signup">Sign up</a></small>
  </div>
</div>

<!-- ✅ PASSES 3-Second Test: Clear answers to all 3 questions -->
<div class="page">
  <nav>...</nav>
  <main class="hero">
    <!-- Q1: What is this? → Clear, specific headline -->
    <h1>Ship your frontend 2x faster</h1>
    <!-- Q3: Why should I care? → Benefit-oriented subheading -->
    <p class="text-lg text-muted-foreground">
      AI-powered design system that writes production-ready components
    </p>
    <!-- Q2: What can I do? → Prominent, obvious CTA -->
    <Button variant="primary" size="lg">Start building — free</Button>
    <!-- Trust signals -->
    <p class="text-sm text-muted">Trusted by 5,000+ developers</p>
  </main>
</div>
```

### Integration with Critique Workflow

The 3-Second Test should be the **first check** in any page-level critique:
1. Run 3-Second Test → if FAIL, fix layout/hierarchy before detailed critique
2. Run UX Psychology Laws check
3. Run full Self-Critique Checklist
4. Run Edge Case Checklist

## HARD RULES
- MUST self-critique before completing ANY styling task (except trivial exemptions above)
- MUST include "Design Critique" section in response with severity ratings
- MUST fix all 🔴 CRITICAL issues before claiming completion — no known failures allowed
- MUST verify visual hierarchy: primary element is most prominent
- MUST verify CTA clarity: maximum 1 primary CTA per viewport section
- MUST verify cognitive load: ≤7±2 visual groups per viewport
- MUST verify spacing consistency: all values from token scale
- MUST NOT claim "looks good" without running through the checklist
- MUST NOT skip critique for non-trivial styling changes
- MUST assign severity level (CRITICAL/MAJOR/MINOR/SUGGESTION) to every critique finding
- MUST check edge cases (empty, loading, error, overflow) in every critique
- MUST apply UX psychology laws (Fitts's, Hick's, Von Restorff, Serial Position, Gestalt, Miller's, Jakob's, Doherty) during critique
- MUST run 3-Second First Impression Test on every page-level design before detailed critique
- MUST NOT present more than 7±2 ungrouped choices in a single viewport (Hick's Law + Miller's Law)
- MUST ensure primary CTA is visually distinct from all other elements (Von Restorff Effect)
- MUST provide immediate visual feedback for interactions — target < 400ms perceived response (Doherty Threshold)
