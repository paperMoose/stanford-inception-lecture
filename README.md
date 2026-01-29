# Stanford Inception Guest Lecture

**Date:** February 3, 2026
**Duration:** 80 minutes (~65-70 min content + Q&A)
**Audience:** ~75 technical students, many planning AI startups
**Organizer:** John Whaley (Program Director, Inception)

## Lecture Topics

### 1. Building an AI-Native Company
- What "AI native" actually means operationally
- Automated consulting: specs as data, Claude as executor
- Data flywheels and context as appreciating assets

### 2. Agent Evaluation Best Practices
- The cold start problem: need evals but don't have data
- Real case study: 179 rejections analyzed, 96% specification errors
- Not letting evals become a blocker to shipping

## Repository Structure

```
stanford-inception-lecture/
├── slides/
│   └── index.html         # Reveal.js slide deck
├── notes/
│   ├── speaker-notes.md   # Detailed speaker notes
│   └── outline.md         # High-level outline
├── examples/
│   ├── spec-format.md     # Example spec for Claude Code
│   ├── failure-analysis/  # Noah eval case study data
│   └── prompt-patterns/   # Good vs bad prompts
└── README.md
```

## Running the Slides

```bash
# Open slides directly in browser
open slides/index.html

# Or serve locally
cd slides && python -m http.server 8000
# Then visit http://localhost:8000
```

## Key Takeaways for Students

1. **Specs over prose**: Transform ambiguous requests into checkable specifications
2. **Evals from day 1**: Start with human review, graduate to automated evals
3. **Failures are data**: Each rejection is a prompt fix waiting to happen
4. **AI native != AI first**: It's about system design, not chatbot wrappers

## Related Materials

- [How to Write a Good Prompt](https://vunda.io/blog/how-to-write-good-prompts) - Blog post on prompt specification
- Automated Consulting repo - Pipeline for spec generation and execution
- Noah AI eval analysis - Production failure categorization

## Contact

Ryan Brandt
Vunda Labs
