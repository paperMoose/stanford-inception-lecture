# Speaker Notes

Detailed notes for each section of the Stanford Inception lecture.

---

## Title Slide

**Timing:** 1 min

Opening:
- "Thanks for having me. I'm Ryan, I run Vunda Labs - we build AI agents and help other companies do the same."
- "Today I want to share two things that have worked for us, and one big realization."
- "First: what 'AI native' actually means when you're building a company. Second: how to evaluate AI agents without getting stuck in eval purgatory."

---

## Agenda

**Timing:** 1 min

Quick overview - don't linger here.

- Mention that Q&A is 60% of the time - "So prepare your questions"
- "We'll do a live demo of the automated consulting pipeline, assuming the demo gods are with us"

---

## Part 1: What Does "AI Native" Mean?

### Slide: What AI Native is NOT

**Timing:** 3 min

Purpose: Dispel common misconceptions before defining the real thing.

Key points:
- Every company is "using AI" now - that's not a differentiator
- Having a chatbot is just a feature, not a business model
- Engineers using Copilot is table stakes
- Fine-tuning is often cargo cult - most people don't need it

Transition: "So if it's not about using AI tools... what is it?"

### Slide: What AI Native IS

**Timing:** 3 min

Core definition: **AI as a first-class execution layer**

Explain:
- "First-class execution layer" means AI can complete work end-to-end
- Not just assistance or augmentation - actual completion
- The AI is an actor in your system, not a tool in your toolbox

Analogy: "Think about how the internet changed companies. It wasn't about having a website - it was about rebuilding operations around connectivity. AI native is the same shift."

### Slide: The Test

**Timing:** 3 min

The litmus test for AI-native: Can unstructured input become executed work product with zero human in the loop?

Walk through the example:
1. Meeting notes (messy, unstructured)
2. Gets transformed into a spec
3. Spec is executed by Claude Code
4. Result: commits, PR ready for review

Emphasize: "The human's job shifts from doing the work to reviewing the work."

---

## Part 2: Automated Consulting Pipeline

### Slide: The Pipeline Diagram

**Timing:** 5 min

Walk through each stage:

1. **Unstructured Input**: Meeting transcripts, Slack threads, emails
   - "The reality of client work is messy input"
   - "No one writes clean specs - they have conversations"

2. **Spec Generator**: Claude reads the input and extracts a structured spec
   - "This is the translation layer from human chaos to machine-executable format"

3. **Task Manager (Dooist)**: Holds the spec as context, tracks progress
   - "The spec lives here so we can reference it, update it, check off items"

4. **Executor (Claude Code)**: Actually does the work
   - "Runs in the repo, makes commits, creates PRs"
   - "Uses the spec as its instruction set"

### Slide: The Spec Format

**Timing:** 5 min

Go through each section:

1. **Repo & Client**: Where and who
2. **Intent**: One sentence - what are we trying to achieve?
3. **Done When**: THE MOST IMPORTANT PART
   - "These are checkable assertions"
   - "If you can't verify it, it's not done"
   - Example: "POST /login returns JWT" - you can test this
4. **Requirements**: Constraints and decisions
5. **Technical Architecture**: How, not what
6. **Key Files**: Scoping - where should the agent look?

Key insight: "The quality of the spec determines the quality of the output. Garbage spec, garbage result."

### Slide: Why This Works

**Timing:** 2 min

Quick tour of the four properties:
- **Checkable**: Every "Done When" can be verified
- **Scoped**: We tell it exactly which files to touch
- **Contextual**: We give it the architecture decisions
- **Executable**: Claude Code can run autonomously

"This is what makes the human-out-of-the-loop possible."

### Slide: Demo

**Timing:** 5-10 min (depending on audience engagement)

DEMO PREP CHECKLIST:
- [ ] Have `automated-consulting` repo ready
- [ ] Prepare a sample meeting transcript
- [ ] Have a test repo ready to execute against
- [ ] Test the demo before the lecture!

Walk through:
1. Show the raw input (meeting notes)
2. Run the spec generator
3. Show the resulting spec
4. Execute the spec
5. Show the commits/PR

If demo fails: "Demo failed, but let me walk you through what would have happened..."

### Slide: Context as Appreciating Asset

**Timing:** 3 min

Key insight: Your context file becomes more valuable over time.

Explain:
- Every client interaction adds to their profile
- Past decisions inform future ones
- Preferences accumulate

"Most companies have depreciating assets - equipment, code that rots. Your context is different. It appreciates. The more you use it, the more valuable it becomes."

"Your context file is your moat" - this is the memorable line.

---

## Part 3: Agent Evaluation

### Slide: The Cold Start Paradox

**Timing:** 3 min

Present the paradox dramatically:
1. "I need evals to ship safely"
2. "But I need production data for evals"
3. "But I can't get data without shipping"
4. "???"

Let it land. This is a real problem most people face.

"How many of you have felt stuck here?" (Raise hands moment)

### Slide: The Resolution

**Timing:** 3 min

The answer: Human-in-the-loop bootstrap

Walk through the 5 stages:
1. Ship with human review on EVERY action
2. Collect rejections + reasons (this is your training data)
3. Categorize failures → fix prompts
4. Graduate to spot checks (not reviewing everything)
5. Automate eval on critical paths only

Key insight: "You don't need perfect evals to ship. You need a process to get from shipping to good evals."

### Slide: Case Study Stats

**Timing:** 2 min

Let the numbers speak:
- **179** total rejections analyzed
- **96%** were specification errors
- **4%** were true model failures

Implication: "Almost all the failures were our fault, not the model's. We could fix them with better prompts."

"This is the most important slide. When you're debugging agent failures, look at your prompts first."

### Slide: Top Failure Categories

**Timing:** 3 min

Walk through the table:

| Category | Count | What Happened |
|----------|-------|---------------|
| STOP_IGNORED | 23 | User said stop, agent kept going |
| WRONG_DURATION | 13 | Guessed wrong on meeting length |
| EXPLANATION_REQUEST | 10 | User wanted to know why |
| CALENDAR_ORDER | 9 | Checked availability after sending invite |
| EXEC_OVERRIDE | 5 | Boss's preferences not respected |

"Each of these became a specific prompt fix."

### Slide: STOP_IGNORED Deep Dive

**Timing:** 4 min

This is the worked example. Walk through it in detail:

Before:
- User sends "STOP" or "stop the processing"
- Agent ignores it, keeps sending calendar invites
- User is frustrated, has to manually clean up

Root cause: The prompt didn't have explicit stop detection.

After (show the actual prompt addition):
```
If user message contains:
- "stop"
- "STOP"
- "stop the processing"

→ Immediately halt
→ Do not send anything
→ Acknowledge the stop
```

Result: "23 failures → 1 prompt rule → 0 failures"

### Slide: The Pattern

**Timing:** 2 min

Generalize from the example:

```
Failure Category
      ↓
User Feedback (Why they rejected)
      ↓
Root Cause (What spec was missing)
      ↓
Prompt Fix (Explicit rule or constraint)
      ↓
Eval Test (Catches this failure forever)
```

"This is the loop. Every failure becomes a permanent improvement."

### Slide: Failures Are Data

**Timing:** 2 min

The mindset shift:
- Don't hide failures - categorize them
- Don't blame the model - fix the spec
- Don't build evals in isolation - use production data

"Every rejection is a prompt fix waiting to happen."

### Slide: Writing Good Prompts

**Timing:** 3 min

The principle: "Good is the absence of bad"

Walk through the don'ts:
- Asking same question twice (track state)
- Vague language ("be helpful" - what does that mean?)
- Assuming context (user doesn't know what you know)
- Unstructured output (parse this!)

And the dos:
- Track conversation state
- Define terms explicitly
- Ask clarifying questions
- Use fixed output schemas

### Slide: Eval Graduation Path

**Timing:** 2 min

Show the progression:

| Stage | Coverage | When |
|-------|----------|------|
| Human review all | 100% | Launch |
| Spot checks + flags | ~20% | After patterns emerge |
| Auto eval critical paths | ~5% | After prompt stabilizes |

Emphasize: "Never try to get 100% automated coverage before shipping. It's a trap."

---

## Takeaways

**Timing:** 2 min

Rapid fire through the four takeaways:
1. **Specs over prose** - Make it checkable
2. **Human-in-the-loop bootstrap** - Ship first, eval later
3. **Failures are data** - Each rejection improves the system
4. **Context is your moat** - Accumulated knowledge compounds

---

## Q&A

**Timing:** 25+ min

Backup topics if Q&A is slow:
- "How do you price AI work for clients?"
- "When do you trust AI output vs verify manually?"
- "What's the hardest part of building AI-native?"
- "How do you handle AI errors with clients?"

Closing:
- "Thanks everyone. My email is on the slide if you want to chat."
- "We're always looking to help teams build AI-native operations - feel free to reach out."
