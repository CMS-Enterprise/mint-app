# Gemini CLI Project Instructions

This file provides instructions for the Gemini CLI agent when working on the MINT project.

## Centralized AI Hub
All architectural maps, coding standards, and testing rules are centralized in the `.ai/` directory. You MUST read and follow these files for all tasks:

- `.ai/ARCHITECTURE.md`: For understanding package responsibilities.
- `.ai/CODING_STYLE.md`: For implementation standards (Go, TS, GQL).
- `.ai/TESTING_RULES.md`: For verification patterns.
- `.ai/REVIEW_GUIDELINES.md`: For evaluating code quality.

## Project Specifics
- Always use `zap` for logging.
- Never use `any` in TypeScript.
- Ensure all GQL operations have role-based authorization.
