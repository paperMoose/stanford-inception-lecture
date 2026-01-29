# Spec Format for Claude Code

This document shows the spec format used to drive autonomous code execution with Claude Code.

---

## The Format

```markdown
Repo: <path to repository>
Client: <client identifier>
Intent: <one-line description of what we're accomplishing>

## Done When
- [ ] <verifiable assertion 1>
- [ ] <verifiable assertion 2>
- [ ] <verifiable assertion 3>

## Requirements
- <constraint or decision 1>
- <constraint or decision 2>

## Technical Architecture
- <technology choices>
- <patterns to follow>

## Key Files & Endpoints
- <file path> - <what it does>
- <file path> - <what it does>

## Context
<any background information the agent needs>

## Assumptions
<things we're assuming to be true>
```

---

## Example: Authentication Feature

```markdown
Repo: ~/git/acme-api
Client: acme_corp
Intent: Add JWT-based user authentication to the REST API

## Done When
- [ ] POST /api/auth/login accepts email/password, returns JWT on success
- [ ] POST /api/auth/register creates new user with hashed password
- [ ] Protected routes return 401 without valid token
- [ ] Token expiry is enforced (expired tokens rejected)
- [ ] All tests pass with `pytest tests/`

## Requirements
- JWT tokens with 24-hour expiry
- bcrypt for password hashing (cost factor 12)
- Return 401 for invalid credentials, 400 for malformed requests
- Email must be unique, validated format
- Password minimum 8 characters

## Technical Architecture
- FastAPI with python-jose for JWT encoding/decoding
- SQLAlchemy with existing User model
- Pydantic schemas for request/response validation
- Middleware pattern for route protection

## Key Files & Endpoints
Files to create:
- src/auth/jwt.py - JWT token creation and validation
- src/auth/password.py - Password hashing utilities
- src/routes/auth.py - Login and register endpoints
- src/middleware/auth.py - Token verification middleware
- tests/test_auth.py - Authentication tests

Files to modify:
- src/main.py - Register auth routes
- src/models/user.py - Add password_hash field

## Context
- Existing User model has: id, email, name, created_at
- API follows REST conventions with /api prefix
- Other protected routes exist at /api/projects and /api/tasks
- Using PostgreSQL in production, SQLite for tests

## Assumptions
- python-jose and bcrypt are available (in requirements.txt)
- No existing authentication system to migrate from
- Single-tenant application (no organization scoping needed)
```

---

## Why Each Section Matters

### Repo & Client
- **Repo**: Tells the agent exactly where to work
- **Client**: Useful for context loading and tracking

### Intent
One sentence that captures the "why". Helps the agent make judgment calls.

### Done When
**This is the most critical section.**

Rules for good "Done When" items:
1. Must be verifiable - you can test it
2. Must be specific - no ambiguity
3. Must be complete - covers all acceptance criteria

Bad examples:
- "Authentication works" - too vague
- "Users can log in" - how do you verify?
- "Security is implemented" - meaningless

Good examples:
- "POST /login returns 200 with JWT when credentials valid"
- "POST /login returns 401 when password incorrect"
- "Protected routes return 401 without Authorization header"

### Requirements
Constraints and decisions that aren't obvious. Things the agent shouldn't have to guess.

### Technical Architecture
Technology choices already made. Prevents the agent from making incompatible choices.

### Key Files & Endpoints
Scoping. Tells the agent:
- What files to create
- What files to modify
- What NOT to touch (implicitly)

### Context
Background the agent needs but wouldn't know from reading the code.

### Assumptions
Things you're treating as true. Helps the agent avoid rabbit holes.

---

## Anti-Patterns

### Too Vague
```markdown
## Done When
- [ ] The feature is complete
- [ ] It works correctly
- [ ] Tests pass
```

These can't be verified without knowing what "the feature" is.

### Too Detailed
```markdown
## Done When
- [ ] Line 45 of auth.py contains "def login"
- [ ] The function has exactly 3 parameters
- [ ] The return type annotation is Dict[str, Any]
```

Micromanaging prevents the agent from using good judgment.

### Missing Context
```markdown
Repo: ~/git/project
Intent: Add caching

## Done When
- [ ] Caching works
```

What kind of caching? Where? What technology? What's the existing architecture?

### Conflicting Requirements
```markdown
## Requirements
- Use Redis for caching
- No external dependencies
```

The agent will be stuck or make arbitrary choices.

---

## The Spec Quality Test

Before executing a spec, ask:

1. **Can I verify every "Done When" item?** If not, rewrite them.
2. **Would a new engineer understand this?** If not, add context.
3. **Are there ambiguous decisions?** If so, make them in Requirements.
4. **Could this touch unintended files?** If so, scope with Key Files.

A good spec is one where a competent agent (or engineer) could execute it without asking clarifying questions.
