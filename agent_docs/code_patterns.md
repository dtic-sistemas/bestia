# Code Patterns — BESTIA MVP

Standard patterns for consistent, clean code across the project.

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── upload/
│   │   └── page.tsx        # Upload pet page
│   ├── duel/
│   │   └── [id]/
│   │       └── page.tsx    # Vote page
│   ├── api/
│   │   ├── vote/
│   │   │   └── route.ts    # POST /api/vote
│   │   ├── capture-email/
│   │   │   └── route.ts    # POST /api/capture-email
│   │   └── upload/
│   │       └── route.ts    # POST /api/upload
│   └── auth/
│       └── callback/
│           └── route.ts    # OAuth callback
├── components/
│   ├── Scoreboard.tsx      # Vote counter
│   ├── ShareModal.tsx      # Share buttons
│   ├── VoteButton.tsx      # Vote button
│   └── Layout/
│       └── Navigation.tsx   # Nav bar
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Auth helpers
│   ├── utils.ts            # Utilities
│   └── types.ts            # TypeScript types
├── styles/
│   └── globals.css         # Global styles (minimal with Tailwind)
└── env.local               # Local env (never commit)
```

---

## Naming Conventions

### Files & Folders

- **Pages:** `page.tsx` (Next.js convention)
- **Components:** `PascalCase.tsx` (e.g., `VoteButton.tsx`)
- **API routes:** `route.ts` (Next.js convention)
- **Utilities:** `camelCase.ts` (e.g., `supabase.ts`)
- **Folders:** `lowercase` or `PascalCase` for components

### Variables & Functions

```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_VOTE_COUNT = 1000;
const DEFAULT_TIMEOUT = 5000;

// Variables: camelCase
let duelId = '123';
const petName = 'Manchas';

// Functions: camelCase
function handleVote() { }
const fetchPetData = async () => { }

// React Components: PascalCase
function Scoreboard() { }
const VoteButton = () => { }

// Types: PascalCase
interface Pet { }
type DuelStatus = 'active' | 'completed';
```

---

## Component Pattern

**Standard React component:**

```typescript
// src/components/VoteButton.tsx

import { ReactNode } from 'react';

interface VoteButtonProps {
  petId: string;
  duelId: string;
  onVoteComplete?: () => void;
}

export function VoteButton({ petId, duelId, onVoteComplete }: VoteButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duelId, petId }),
      });

      if (!response.ok) {
        throw new Error('Vote failed');
      }

      onVoteComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? 'Votando...' : 'Votar'}
    </button>
  );
}
```

**Key points:**
- Props interface at top
- State declarations before logic
- Error handling (try/catch)
- Loading states
- Optional callbacks (onVoteComplete?)
- Tailwind styling inline

---

## API Route Pattern

**Standard Next.js API route:**

```typescript
// src/app/api/vote/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { duelId, petId, deviceFingerprint } = body;

    // 2. Validate inputs
    if (!duelId || !petId) {
      return NextResponse.json(
        { error: 'Missing duelId or petId' },
        { status: 400 }
      );
    }

    // 3. Get user IP (Vercel provides this)
    const userIp = request.headers.get('x-forwarded-for') || 'unknown';

    // 4. Database operation (Supabase)
    const { data, error } = await supabase
      .from('votes')
      .insert([
        {
          duel_id: duelId,
          pet_id: petId,
          user_ip: userIp,
          device_fingerprint: deviceFingerprint,
        },
      ])
      .select();

    // 5. Handle database errors
    if (error) {
      // UNIQUE constraint violation = duplicate vote
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya votaste en este duelo' },
          { status: 400 }
        );
      }
      throw error;
    }

    // 6. Return success
    return NextResponse.json({ success: true, vote: data[0] });

  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
```

**Key points:**
- Type the request/response
- Validate inputs first
- Try/catch for error handling
- Log errors (console.error)
- Return structured responses (JSON)
- Use appropriate HTTP status codes

---

## Error Handling Pattern

```typescript
// Pattern 1: Try/catch with user feedback
try {
  const result = await riskyOperation();
  setSuccess(true);
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'An unknown error occurred';
  setError(message);
  // Don't re-throw; show user-friendly message
}

// Pattern 2: Validation errors
if (!email.includes('@')) {
  return NextResponse.json(
    { error: 'Invalid email format' },
    { status: 400 }
  );
}

// Pattern 3: Async error handling
const response = await fetch('/api/vote');
if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}
```

---

## State Management Pattern

**Keep it simple with hooks:**

```typescript
// useState for simple state
const [votes, setVotes] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// useEffect for side effects
useEffect(() => {
  const fetchVotes = async () => {
    setLoading(true);
    try {
      const data = await fetch(`/api/duel/${duelId}`).then(r => r.json());
      setVotes(data.voteCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  fetchVotes();
}, [duelId]); // Dependencies matter!
```

**When to add context (shared state across components):**
- Auth state (current user)
- App-wide settings
- Deeply nested prop passing

For MVP, useState + props is usually enough.

---

## Async/Await Pattern

```typescript
// Good: Clean async flow
async function uploadPet(file: File) {
  try {
    const { data, error } = await supabase.storage
      .from('pet-photos')
      .upload(`${Date.now()}.jpg`, file);

    if (error) throw error;

    return data.path;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Usage
const path = await uploadPet(file);
```

---

## Environment Variables

**.env.local (never commit):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Usage in code:**
```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

**Why NEXT_PUBLIC_?**
- Supabase anon key is safe to expose (read-only)
- Secret keys (database password) are NOT prefixed
- Prefix = available in browser

---

## Tailwind Patterns

```jsx
// Responsive design
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Flexbox layout
<div className="flex items-center justify-between gap-4">
  <span>Label</span>
  <button>Action</button>
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Conditional classes (use clsx or template)
<button className={`px-4 py-2 ${loading ? 'opacity-50' : 'opacity-100'}`}>
  {loading ? 'Loading...' : 'Click me'}
</button>

// Dark mode (if needed)
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

---

## Testing Patterns

**Simple manual testing (MVP doesn't need automated tests yet):**

```typescript
// Browser console testing
// 1. Open DevTools (F12)
// 2. Go to Network tab
// 3. Make an action (click vote button)
// 4. Watch for API calls
// 5. Check response (should be 200, not 400/500)

// For database queries
const { data } = await supabase.from('pets').select('*');
console.log(data); // Open DevTools console
```

---

## Code Review Checklist

Before committing, check:

- [ ] No console.log() calls (except errors)
- [ ] No hardcoded values (use constants)
- [ ] Error handling present (try/catch, validation)
- [ ] Types are correct (TypeScript)
- [ ] Component is responsive (mobile-friendly)
- [ ] No commented-out code
- [ ] Function names describe what they do
- [ ] No API keys in code (use .env.local)

---

## Common Mistakes to Avoid

| Mistake | Why Bad | Fix |
|---------|---------|-----|
| Missing dependency in useEffect | Infinite loops | Add all deps to array |
| console.log in production | Clutters console | Remove or use logger |
| Hardcoded values | Not reusable | Extract to const |
| No error handling | App crashes silently | Add try/catch |
| Fetch without timeout | Hangs forever | Add abort signal |
| Missing TypeScript types | Runtime errors | Define interfaces |
| Forgotten .env.local | Exposes secrets | Add to .gitignore |

---

## IDE Setup for Code Patterns

**VS Code extensions:**
- Prettier (auto-format)
- ESLint (find bugs)
- Tailwind IntelliSense (auto-complete classes)

**VS Code settings (.vscode/settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

This ensures code is formatted consistently.
