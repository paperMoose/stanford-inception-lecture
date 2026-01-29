# Lecture Outline

## Format
- 40% presentation / 60% Q&A
- Not recorded - can share real examples
- Technical audience comfortable with code

---

## Part 1: Building an AI-Native Company (30 min)

### 1.1 What Does "AI Native" Actually Mean? (10 min)
- Not: "We use ChatGPT"
- Not: "We have an AI chatbot"
- IS: System design where AI is a first-class execution layer
- Example: Meeting notes → Spec → Code → PR (no human in loop for execution)

### 1.2 The Automated Consulting Pipeline (15 min)
**Live demo opportunity**
- Input: Unstructured text (meeting notes, Slack, transcripts)
- Output: Executed code in a repo with commits
- Show: Spec format, Claude Code execution, real PR

### 1.3 Context as an Appreciating Asset (5 min)
- Every interaction adds to the context file
- Cursor-crm pattern: relationships, preferences, history
- The more you use it, the better it gets

---

## Part 2: Agent Evaluation Best Practices (25 min)

### 2.1 The Cold Start Problem (5 min)
- "I need evals to ship safely"
- "But I need production data to build evals"
- "But I can't get production data without shipping"
- Resolution: Human-in-the-loop bootstrap

### 2.2 Case Study: 179 Rejections Analyzed (15 min)
**Real production data from scheduling assistant**

Key findings:
- 96% were specification errors (fixable with better prompts)
- Only 4% were true model failures

Top failure categories:
| Category | Count | Root Cause |
|----------|-------|------------|
| STOP_IGNORED | 23 | Missing explicit stop detection |
| WRONG_DURATION | 13 | Unclear duration defaults |
| EXPLANATION_REQUEST | 10 | Users needed transparency |
| CALENDAR_ORDER | 9 | Wrong action sequence |

Each category → specific prompt fix

### 2.3 Building Evals That Don't Block Shipping (5 min)
- Start with: Human review on every action
- Graduate to: Spot checks + automatic flags
- End state: Automated evals on critical paths only
- Never: 100% automated coverage before shipping

---

## Part 3: Q&A (25+ min)

Prepared topics for slow moments:
- Code review with AI agents
- When to trust vs verify AI output
- Building for AI-native from day 1 vs retrofitting
- Pricing AI work for clients

---

## Key Slides to Prepare

1. Title slide
2. "AI Native" definition (what it is / what it isn't)
3. Automated consulting pipeline diagram
4. Spec format example
5. Real PR screenshot (BoardProspects or similar)
6. Cold start paradox diagram
7. 179 rejections summary table
8. Failure category deep dive (STOP_IGNORED as example)
9. "Failures are data" transformation
10. Eval graduation path
11. Contact / links
