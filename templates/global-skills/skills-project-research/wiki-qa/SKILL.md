---
name: wiki-qa
description: "Quick evidence-based Q&A from source code. Use when user asks about the codebase, a specific file/function, or 'how does X work'."
risk: safe
source: self
tags: [research, codebase, qa, evidence-based]
---

# Wiki Q&A

Answer repository questions grounded entirely in source code evidence.

## When to Use
- User asks a question about the codebase
- User wants to understand a specific file, function, or component
- User asks "how does X work" or "where is Y defined"

## Procedure

1. Respond in the user's configured language
2. Use `codebase_search` to find relevant files by meaning
3. Use `read_file` to gather evidence from matched files
4. If needed, use `search_files` for regex-based pattern search
5. Synthesize an answer with inline citations

## Response Format

- Use `##` headings, code blocks with language tags, tables, bullet lists
- Cite sources inline: `(src/path/file.ts:42)`
- Include a "Key Files" table mapping files to their roles
- If information is insufficient, say so and suggest files to examine

## Rules

- ONLY use information from actual source files
- NEVER invent, guess, or use external knowledge
- Think step by step before answering
- Use `codebase_search` for semantic queries, `search_files` for exact patterns
