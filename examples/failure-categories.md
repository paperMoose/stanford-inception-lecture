# Agent Evaluation: Failure Categories

Analysis of 179 rejections from a production AI scheduling assistant. This document categorizes failures and shows the prompt fixes applied.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Rejections Analyzed | 179 |
| Specification Errors | 172 (96%) |
| True Model Failures | 7 (4%) |

**Key Insight**: Almost all failures were fixable with better prompts. The model wasn't failing - our specifications were incomplete.

---

## Top Failure Categories

| Rank | Category | Count | % of Total | Root Cause |
|------|----------|-------|------------|------------|
| 1 | STOP_IGNORED | 23 | 12.8% | Missing stop detection |
| 2 | WRONG_DURATION | 13 | 7.3% | Unclear duration defaults |
| 3 | EXPLANATION_REQUEST | 10 | 5.6% | No transparency mode |
| 4 | CALENDAR_ORDER | 9 | 5.0% | Wrong action sequence |
| 5 | EXEC_OVERRIDE | 5 | 2.8% | Executive preferences ignored |
| 6 | TIMEZONE_MISMATCH | 5 | 2.8% | Assumed wrong timezone |
| 7 | DOUBLE_BOOKING | 4 | 2.2% | Didn't check availability |
| 8 | WRONG_ATTENDEES | 4 | 2.2% | Missed CC'd people |
| 9 | RECURRING_MISS | 3 | 1.7% | Didn't detect recurring intent |
| 10 | OTHER | 103 | 57.5% | Various edge cases |

---

## Detailed Analysis by Category

### 1. STOP_IGNORED (23 failures)

**What happened**: User requested the agent stop processing, but it continued sending calendar invites.

**Example rejection**:
> User: "STOP - I need to rethink this"
> Agent: [Sends 3 more calendar invites]
> User: Rejected - "I said stop!"

**Root cause**: No explicit instruction to detect and honor stop requests.

**Prompt fix applied**:
```
CRITICAL STOP HANDLING:
If the user message contains any of:
- "stop"
- "STOP"
- "halt"
- "wait"
- "hold on"
- "cancel"
- "don't send"
- "nevermind"

Then:
1. IMMEDIATELY stop all pending actions
2. Do NOT send any calendar invites
3. Do NOT modify any calendars
4. Acknowledge the stop: "Stopped. No invites sent. What would you like to change?"
```

**Result**: 23 failures → 0 failures after fix

---

### 2. WRONG_DURATION (13 failures)

**What happened**: Agent scheduled meetings with incorrect durations.

**Example rejection**:
> User: "Schedule a quick sync with the team"
> Agent: [Creates 60-minute meeting]
> User: Rejected - "A quick sync is 15-30 minutes"

**Root cause**: No default duration rules specified.

**Prompt fix applied**:
```
DURATION DEFAULTS:
- "quick sync" / "quick chat" / "brief" → 15 minutes
- "sync" / "check-in" / "standup" → 30 minutes
- "meeting" / "discussion" → 45 minutes
- "deep dive" / "workshop" / "planning" → 60 minutes
- "all-hands" / "town hall" → 60 minutes

If unsure, ASK: "How long should this meeting be?"
Never guess a duration longer than 30 minutes without confirmation.
```

**Result**: 13 failures → 1 failure (edge case: "quick planning session")

---

### 3. EXPLANATION_REQUEST (10 failures)

**What happened**: Users wanted to understand why the agent made certain choices, but it couldn't explain.

**Example rejection**:
> User: "Why did you schedule it for 3pm?"
> Agent: [Proceeds to send another invite without explaining]
> User: Rejected - "I asked a question, don't just keep going"

**Root cause**: No instruction to detect and respond to questions.

**Prompt fix applied**:
```
QUESTION DETECTION:
If the user asks "why", "how come", "what made you", or ends with "?":
1. STOP and answer the question first
2. Do NOT proceed with any actions
3. After answering, ask: "Would you like me to proceed or make changes?"

Questions are higher priority than continuing the workflow.
```

**Result**: 10 failures → 0 failures

---

### 4. CALENDAR_ORDER (9 failures)

**What happened**: Agent sent calendar invites before checking recipient availability.

**Example rejection**:
> Agent: [Sends invite for 2pm]
> Agent: [Checks availability, sees conflict]
> Agent: "Oops, they have a conflict at 2pm"
> User: Rejected - "Check availability BEFORE sending!"

**Root cause**: Actions not sequenced correctly in the prompt.

**Prompt fix applied**:
```
ACTION SEQUENCE (MUST follow this order):
1. Parse the request
2. Check ALL attendees' availability
3. If conflicts exist, propose alternative times
4. ONLY after user confirms → send invites
5. Confirm what was sent

NEVER send an invite without checking availability first.
NEVER modify calendars without explicit user confirmation.
```

**Result**: 9 failures → 0 failures

---

### 5. EXEC_OVERRIDE (5 failures)

**What happened**: Scheduling didn't respect executive preferences (boss's availability takes priority).

**Example rejection**:
> User: "Schedule with Sarah and the CEO"
> Agent: [Picks time that works for Sarah but not CEO]
> User: Rejected - "CEO's schedule takes priority"

**Root cause**: No hierarchy rules specified.

**Prompt fix applied**:
```
ATTENDEE PRIORITY (when finding times):
1. The USER's calendar constraints are mandatory
2. Executive/CEO/leadership availability takes next priority
3. Other attendees are flexible - propose times, they can decline

If CEO/executive has limited availability:
- Prioritize their open slots
- Explicitly note: "This is one of [Executive]'s few open slots"
```

**Result**: 5 failures → 0 failures

---

### 6. TIMEZONE_MISMATCH (5 failures)

**What happened**: Agent assumed wrong timezone for users.

**Example rejection**:
> User: "Schedule for 9am"
> Agent: [Creates 9am PST when user is in EST]
> User: Rejected - "That's 6am my time!"

**Root cause**: No timezone handling instructions.

**Prompt fix applied**:
```
TIMEZONE HANDLING:
- ALWAYS confirm timezone if not explicitly stated
- Default to USER's calendar timezone setting
- For cross-timezone meetings, show BOTH timezones
- Format: "2pm PST (5pm EST)"

If scheduling across more than 2 timezones:
- Show table of times for each person
- Flag if anyone's time is before 8am or after 6pm their local time
```

**Result**: 5 failures → 0 failures

---

## The Pattern: Failure → Fix

Every failure category followed the same resolution pattern:

```
1. FAILURE OBSERVED
   ↓
2. USER FEEDBACK COLLECTED
   "Why did you reject?"
   ↓
3. ROOT CAUSE IDENTIFIED
   What was missing from the spec?
   ↓
4. PROMPT FIX WRITTEN
   Explicit rule added
   ↓
5. EVAL TEST CREATED
   Input that would trigger old behavior
   ↓
6. FIX VERIFIED
   Run eval, confirm pass
```

---

## True Model Failures (4%)

Only 7 of 179 rejections were actual model limitations:

| Failure | Description |
|---------|-------------|
| Complex math | Calculating time across 5+ timezones with DST |
| Ambiguous reference | "Schedule with him" - 3 "hims" in thread |
| Contradictory request | "ASAP but not this week" |
| Context window | Lost context of earlier conversation |

For these, the fix was:
- Detect the ambiguity
- Ask clarifying questions
- Don't proceed until resolved

---

## Key Lessons

### 1. Your Prompts Are Usually the Problem
96% of failures were specification errors. Before blaming the model, check your prompts.

### 2. Explicit Beats Implicit
Don't assume the model knows your rules. Write them down explicitly.

### 3. Edge Cases Are Common
"Other" was the largest category (57%). Many small issues, each requiring individual attention.

### 4. Human Feedback is Gold
Users tell you exactly what went wrong. Collect and categorize this data religiously.

### 5. One Fix Can Eliminate Many Failures
The STOP_IGNORED fix eliminated 23 failures with one prompt addition.

---

## Implementing This Process

1. **Ship with human review** - Every action needs approval at first
2. **Collect rejection reasons** - Make it easy for reviewers to explain why
3. **Categorize weekly** - Group similar failures together
4. **Fix the biggest categories first** - Highest ROI
5. **Write eval tests** - Prevent regression
6. **Graduate to spot checks** - Once categories stabilize

Don't try to anticipate all failures upfront. Let production data guide your improvements.
