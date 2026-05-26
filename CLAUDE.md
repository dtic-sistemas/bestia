# CLAUDE.md — Claude Code Configuration

Configuration and guidelines for AI code generation using Claude Code.

---

## Project Context

**App:** BESTIA  
**Goal:** Pet tournament app with viral voting  
**Stack:** Next.js 14 + React + Supabase + Vercel  
**Stage:** MVP Development (Week 1-12)  
**User Level:** Vibe-coder (AI writes code, user deploys)  

---

## Core Directives

### 1. Master Plan First
Load `AGENTS.md` at the start of any session. It contains:
- Current phase and tasks
- Roadmap with checkboxes
- What's already done vs what's next

**Example:**
```
Me: "Build Feature 2.7"
You: Check AGENTS.md → See Feature 2.7 is "POST /api/vote endpoint"
You: Propose plan → Get approval → Implement
```

### 2. Read Documentation

When building, refer to (in order):
1. `AGENTS.md` — Current task and context
2. `agent_docs/project_brief.md` — Constraints and conventions
3. `agent_docs/tech_stack.md` — Library versions and setup
4. `agent_docs/code_patterns.md` — Code style and structure
5. `agent_docs/product_requirements.md` — Feature details
6. `agent_docs/testing.md` — How to verify it works

### 3. Plan Before Coding

ALWAYS propose a plan:

```
Me: "Build the upload page"

You: "Plan for Feature 2.1 - Upload page:
1. Create src/app/upload/page.tsx (form with file input, name input, species dropdown)
2. Add photo preview (Image component)
3. Create handleUpload function (POST to /api/upload)
4. Handle loading state during upload
5. Show success message or error
6. Test in browser

Proceed?"

Me: "Yes"

You: [Write code]
```

### 4. Incremental Development

**Build ONE feature at a time.**

Don't implement Feature 2.8 until Feature 2.7 is done and tested.

Order matters:
- Feature 2.1 (upload) must work before 2.2 (voting)
- Feature 2.2 (voting) must work before 2.3 (share)
- Features 1-5 all depend on database (Task 1.4)

### 5. Verify After Changes

After implementing a feature:

```
You: [Writes code]
Then:
"Code ready. To verify:
1. npm run build (compile check)
2. npm run dev (start server)
3. Navigate to /upload
4. Try uploading a photo
5. Check Supabase: should see new pet in table
6. Check browser console: no errors"

Me: [Tests]
Me: "Works perfectly"

You: "Good. Next task?"
```

### 6. Explain Trade-offs

When recommending something, mention alternatives:

```
You: "For real-time updates, I recommend Supabase Realtime (WebSocket-based).
Alternative: Firebase Realtime (slower at scale).
Alternative: Polling (inefficient but simpler).

Supabase is best because it's PostgreSQL native and includes real-time."
```

---

## Development Commands

**Start dev server:**
```bash
npm run dev
```
Then visit http://localhost:3000

**Check production build:**
```bash
npm run build
```
(Must pass before deployment)

**Deploy to Vercel:**
```bash
git add .
git commit -m "Feature description"
git push
```
(Automatic - Vercel deploys from main branch)

**Check code style:**
```bash
npm run lint
```

---

## Code Quality Standards

### TypeScript Required
All code must have types:
```typescript
// Good
interface Pet {
  id: string;
  name: string;
}

function getPet(id: string): Promise<Pet> { }

// Bad
function getPet(id) { return ... }
```

### Error Handling Required
All API calls need try/catch:
```typescript
// Good
try {
  const vote = await fetch('/api/vote', { method: 'POST' });
  if (!vote.ok) throw new Error('Vote failed');
} catch (error) {
  setError(error.message);
}

// Bad
const vote = await fetch('/api/vote', { method: 'POST' });
```

### No Console Logs in Production Code
Only for debugging:
```typescript
// Bad - leave in code
console.log('Voting for pet:', petId);

// Good - removes after debugging
if (DEBUG) console.log('Voting for pet:', petId);

// Or use error logging only
console.error('Vote failed:', error);
```

### No Hardcoded Values
Use constants:
```typescript
// Good
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VOTE_TIMEOUT = 5000; // 5 seconds

// Bad
if (file.size > 5242880) { } // What is 5242880?
```

### No Secrets in Code
API keys only in .env.local:
```
// Good - .env.local (never committed)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

// Bad - in code
const supabase = createClient('https://xxx.supabase.co', 'eyJ...');
```

---

## Component Structure

**Every component should have:**

```typescript
import { useState, useEffect } from 'react';

interface ComponentProps {
  propName: string;
  onAction?: () => void;
}

export function ComponentName({ propName, onAction }: ComponentProps) {
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Side effects here
  }, []); // Dependencies!

  const handleClick = async () => {
    setLoading(true);
    try {
      // Do something
      onAction?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
}
```

Key points:
- Props typed
- State for UI (loading, error)
- Error handling
- Loading state
- Sensible defaults

---

## API Route Structure

**Every API route should have:**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse
    const body = await request.json();
    const { requiredField } = body;

    // 2. Validate
    if (!requiredField) {
      return NextResponse.json(
        { error: 'Missing field' },
        { status: 400 }
      );
    }

    // 3. Process
    const result = await doSomething(requiredField);

    // 4. Return
    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```

Key points:
- Typed request/response
- Validation before processing
- Error handling
- Logging for debugging
- Structured response

---

## Testing in Development

### Before Committing
```bash
npm run build  # Must pass
npm run dev    # Must start without errors
# Then test in browser manually
```

### What to Test
1. Feature works (click buttons, see results)
2. Mobile responsive (DevTools, not just desktop)
3. No console errors (DevTools → Console tab)
4. API responses correct (DevTools → Network tab)

### When Tests Fail
Report with:
1. Exact error message
2. What action triggered it
3. Browser/device
4. Screenshot if possible

Example:
```
"Got error 'Cannot read property duelId' when clicking vote button
on /duel/123 in Chrome on iPhone SE"
```

---

## Performance Targets

**Page load:** <2 seconds  
**API response:** <500ms  
**Real-time update:** <5 seconds  

If slower, optimize with:
- Image compression
- Lazy loading
- Code splitting
- Database indexes

---

## Security Checklist

- [ ] No API keys in code (use .env.local)
- [ ] Input validation (email regex, file type check)
- [ ] Error messages don't leak secrets
- [ ] HTTPS enforced (Vercel automatic)
- [ ] Passwords never logged (Supabase handles)
- [ ] Rate limiting present (1 vote per IP+device)

---

## Deployment Process

When code is ready:

1. **Compile check:**
   ```bash
   npm run build
   ```
   Must succeed (no TypeScript errors)

2. **Commit:**
   ```bash
   git add .
   git commit -m "Feature 2.7: Add vote API endpoint"
   ```

3. **Deploy:**
   ```bash
   git push
   ```
   Vercel automatically:
   - Pulls from GitHub
   - Runs `npm install`
   - Runs `npm run build`
   - Deploys to production
   - Takes 30-60 seconds

4. **Verify:**
   - Visit production URL
   - Test feature works
   - Check monitoring (Sentry)

---

## What NOT To Do

### Never Delete Without Asking
```
Me: "Delete old login code"
You: "That file hasn't been used in 3 commits. Before deleting,
     confirm it's not used elsewhere? (I can grep to check)"
```

### Never Modify Database Without Backup Plan
```
Me: "Add column to users table"
You: "First, how should we handle existing rows?
     Set default value? Backfill? Keep NULL?
     Let's plan this before executing."
```

### Never Add Features Outside Current Phase
```
Me: "Add video uploads"
You: "Video isn't in Phase 2 (it's V2+). 
     Current phase: Features 1-5 (upload, vote, share, marcador, result).
     Add video after launch when we have budget for storage?"
```

### Never Skip Tests for "Simple" Changes
```
Me: "Just change one variable, no need to test"
You: "I'll still test in browser to ensure no regressions.
     Takes 30 seconds and prevents bugs."
```

### Never Commit Secrets
```
Me: "Add Supabase keys to .env"
You: "I'll put them in .env.local (local-only, not committed)
     and add to Vercel environment variables separately.
     .env.local goes in .gitignore."
```

---

## When You're Blocked

Ask clearly:

```
"I'm building Feature 2.7 (vote endpoint).
Need to know: Should we validate the duel_id exists before counting vote?
Option A: Check duel exists, return 404 if not
Option B: Trust frontend, count vote anyway (faster)
Option C: Validate in database with foreign key constraint
Which?"
```

Good block reports:
- What you're trying to do
- What's unclear
- Options you see
- One specific question

---

## Communication Style

**Be concise and direct:**

❌ "I've completed the implementation of the voting feature which
   validates the device fingerprint and checks for duplicate votes..."

✅ "Built POST /api/vote. Validates 1 vote per IP+device. Ready to test."

**When you have a plan:**

❌ "We could potentially consider multiple approaches..."

✅ "Plan: Create /upload form (file input + name input + species dropdown).
   Shall I proceed?"

---

## Continuity (If Session Resets)

**On session restart, ask for:**
1. What phase we're in (check AGENTS.md)
2. What was the last completed task
3. What's next

**Then continue:**
- Load context files
- Propose plan for next task
- Proceed

---

## Success Criteria for AI Partnership

By end of MVP:

- ✅ All 5 features built
- ✅ Code is clean and typed
- ✅ Features verified in browser
- ✅ Zero critical bugs
- ✅ Deployed to Vercel
- ✅ User confident deploying independently

**You're doing great if:**
- You understand why code is structured this way
- You could explain the app to someone else
- You can run `npm run dev` and see it working
- You can make small tweaks yourself (optional, but nice)

---

## Questions?

Before starting Phase 1, confirm:

- [ ] Node.js installed? (`node --version`)
- [ ] VS Code or editor ready?
- [ ] GitHub account? (for deploying)
- [ ] Supabase account? (or know how to create)
- [ ] Terminal comfortable? (git, npm commands)

If any "no", ask and I'll walk through setup.

**Ready to build?**

Next: "Start with Phase 1: Foundation" or "Build Task 1.1"
