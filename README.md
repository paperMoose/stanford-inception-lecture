# Stanford Inception Guest Lecture

**Date:** February 3, 2026
**Duration:** 80 minutes (~40% presentation / ~60% Q&A)
**Audience:** ~75 technical students, AI startup track
**Format:** Not recorded (can share real examples freely)

## Lecture Topics

### 1. Building an AI-Native Company
- What "AI native" actually means operationally
- Automated consulting: specs as data, Claude as executor
- Live demo of transcript → spec → code → PR pipeline
- Data flywheels and context as appreciating assets

### 2. Agent Evaluation Best Practices
- The cold start problem: need evals but don't have data
- Real case study: 179 rejections analyzed, 96% specification errors
- Building evals that don't block shipping

## Repository Structure

```
stanford-inception-lecture/
├── slides/
│   └── index.html           # Reveal.js slide deck
├── notes/
│   ├── outline.md           # High-level lecture outline
│   └── speaker-notes.md     # Detailed notes per section
├── examples/
│   ├── spec-format.md       # Spec format with example
│   └── failure-categories.md # Noah eval failure analysis
└── README.md
```

## Running the Slides

### Option 1: Open directly
```bash
open slides/index.html
```

### Option 2: Local server (recommended for presenter view)
```bash
cd slides && python -m http.server 8000
# Visit http://localhost:8000
```

### Slide Navigation
- **Arrow keys**: Navigate slides
- **Space**: Next slide
- **Escape**: Overview mode
- **S**: Speaker notes (opens new window)
- **F**: Fullscreen

## Key Takeaways for Students

1. **Specs over prose** - Transform ambiguous requests into checkable specifications
2. **Human-in-the-loop bootstrap** - Ship with review, graduate to automated evals
3. **Failures are data** - Each rejection is a prompt fix waiting to happen
4. **Context is your moat** - Accumulated knowledge compounds over time

## Lecture Data Points

From the agent evaluation case study:
- **179** total rejections analyzed
- **96%** were specification errors (fixable with better prompts)
- **4%** were true model failures
- Top categories: STOP_IGNORED (23), WRONG_DURATION (13), EXPLANATION_REQUEST (10)

## Pre-Lecture Checklist

- [ ] Test slides load in browser
- [ ] Verify all code blocks render correctly
- [ ] Prepare live demo environment (automated-consulting repo)
- [ ] Test demo with sample transcript
- [ ] Have backup slides ready if demo fails

## Related Materials

- [How to Write a Good Prompt](https://vunda.io/blog/how-to-write-good-prompts) - Blog post on specification
- Automated Consulting repo - Pipeline for spec generation and execution

## Contact

Ryan Brandt
Vunda Labs
ryan@vunda.io
