# Tech Stack — BESTIA MVP

Complete tech specifications for building the MVP.

---

## Frontend

### Framework: Next.js 14

**Version:** 14.x (latest)  
**Why:** Full-stack, zero config, built-in optimization, Vercel integration  

**Install:**
```bash
npx create-next-app@latest bestia
# When prompted:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: Yes
# ✅ App Router: Yes
```

**Key files:**
- `src/app/page.tsx` — Home/landing page
- `src/app/upload/page.tsx` — Upload mascota
- `src/app/duel/[id]/page.tsx` — Vote page
- `src/app/api/vote/route.ts` — API endpoint
- `src/components/` — React components

**Commands:**
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm start        # Run production build
```

---

### React 18

**Purpose:** UI framework  
**Version:** 18.x (comes with Next.js)  

**Key hooks we'll use:**
```javascript
import { useState, useEffect } from 'react';

useState()           // State management
useEffect()          // Side effects, API calls
useCallback()        // Memoize functions
useRef()             // Direct DOM access
useContext()         // Pass data deeply
useReducer()         // Complex state logic
```

---

### TailwindCSS 4

**Purpose:** Styling (utility-first CSS)  
**Version:** 4.x  

**Why:** Fast styling, no separate CSS files, responsive design built-in  

**Usage example:**
```jsx
<div className="flex items-center justify-center bg-blue-500 p-4 rounded-lg">
  <button className="bg-white text-blue-500 hover:bg-gray-100 px-4 py-2 rounded">
    Votar
  </button>
</div>
```

**Key utilities:**
- `flex`, `grid` — Layouts
- `w-full`, `h-screen` — Sizing
- `p-4`, `m-2` — Spacing
- `text-lg`, `font-bold` — Typography
- `bg-blue-500`, `text-white` — Colors
- `hover:`, `focus:` — States
- `md:`, `lg:` — Responsive breakpoints

**Responsive pattern:**
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Mobile text here
</div>
```

---

### TypeScript

**Purpose:** Type safety  
**Version:** 5.x (comes with Next.js)  

**Why:** Catch errors before runtime, better IDE support  

**Basic types we'll use:**
```typescript
interface Pet {
  id: string;
  name: string;
  species: 'gato' | 'perro' | 'otro';
  photoUrl: string;
  ownerId: string;
}

type VotePayload = {
  duelId: string;
  petId: string;
  deviceFingerprint: string;
};

function handleVote(payload: VotePayload): Promise<void> {
  // ...
}
```

---

## Backend

### Supabase (BaaS)

**Purpose:** Database, auth, storage, realtime  
**Pricing:** Free tier for MVP  

**Setup:**
```bash
# 1. Go to supabase.com
# 2. Click "New project"
# 3. Name: bestia
# 4. Password: (save somewhere safe)
# 5. Region: us-east-1 (or closest)
# 6. Wait 2 minutes
# 7. Go to Settings → API
# 8. Copy: SUPABASE_URL and SUPABASE_ANON_KEY
```

**Environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Client setup (in code):**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

### PostgreSQL (Database)

**Provided by:** Supabase  
**Schema:** See `agent_docs/database_schema.md`  

**Tables:**
- `users` — User accounts
- `pets` — Mascotas
- `duels` — Torneos
- `votes` — Votos
- `email_signups` — Email captures

**Example query (using Supabase):**
```typescript
const { data: pets, error } = await supabase
  .from('pets')
  .select('*')
  .eq('owner_id', userId);

if (error) console.error(error);
```

---

### Supabase Auth

**Purpose:** User authentication  
**Methods:** Email/password, Google, Apple  

**Sign up:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
});
```

**Login:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123',
});
```

**Get current user:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

### Supabase Storage

**Purpose:** Photo/video storage  
**Bucket:** `pet-photos`  

**Upload:**
```typescript
const { data, error } = await supabase.storage
  .from('pet-photos')
  .upload(`${Date.now()}.jpg`, file);
```

**Public URL:**
```typescript
const publicUrl = supabase.storage
  .from('pet-photos')
  .getPublicUrl(path).data.publicUrl;
```

---

### Supabase Realtime

**Purpose:** Live vote updates  
**How:** WebSocket subscriptions to database changes  

**Subscribe to votes:**
```typescript
supabase
  .channel(`duel:${duelId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'votes',
      filter: `duel_id=eq.${duelId}`,
    },
    (payload) => {
      console.log('New vote!', payload.new);
      // Update UI
    }
  )
  .subscribe();
```

---

## Hosting & Deployment

### Vercel

**Purpose:** Host Next.js app  
**Pricing:** Free tier for MVP  

**Setup:**
```
1. Go to vercel.com
2. Import GitHub repo (bestia)
3. Add environment variables (Supabase keys)
4. Deploy (automatic from main branch)
```

**Auto-deploy:**
- Every `git push` to main triggers build
- Takes 30-60 seconds
- Automatic HTTPS
- Global CDN

**Commands:**
```bash
git push                    # Triggers deploy
vercel logs                 # View build logs
vercel env list            # Check vars
```

---

### GitHub

**Purpose:** Version control + CI/CD  
**Setup:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[user]/bestia.git
git push -u origin main
```

**Workflow:**
```bash
git checkout -b feature/upload        # Create branch
# Make changes
git add .
git commit -m "Add upload feature"
git push -u origin feature/upload     # Push
# Create PR on GitHub (or just push to main)
git push origin main                  # Triggers Vercel deploy
```

---

## Development Tools

### npm

**Purpose:** Package manager  
**Install packages:**
```bash
npm install @supabase/supabase-js
npm install axios
npm install lucide-react
```

**Dev dependencies:**
```bash
npm install --save-dev @types/react
npm install --save-dev prettier
npm install --save-dev eslint
```

---

### Node.js

**Version:** 18+ (required)  
**Check:** `node --version`  
**Install:** nodejs.org  

---

### VS Code Extensions

**Recommended:**
- Prettier (code formatter)
- ESLint (code linter)
- Tailwind CSS IntelliSense (auto-complete)
- Thunder Client (test APIs)
- Supabase (SQL editor)

---

## Key Libraries

### @supabase/supabase-js

**Purpose:** Supabase client  
**Docs:** supabase.com/docs/reference/javascript

```bash
npm install @supabase/supabase-js
```

---

### lucide-react

**Purpose:** Icons  
**Usage:**
```jsx
import { Share2, Upload, Heart } from 'lucide-react';

<Share2 size={24} />
```

---

### next/image

**Purpose:** Optimized images  
**Usage:**
```jsx
import Image from 'next/image';

<Image
  src="/pet.jpg"
  alt="Pet photo"
  width={400}
  height={400}
/>
```

---

## External Services

### Sentry

**Purpose:** Error tracking  
**Pricing:** Free tier (5K events/month)  
**Setup:** sentry.io → Create project → Get DSN → Add to Vercel env vars  

```bash
npm install @sentry/nextjs
```

---

### PostHog

**Purpose:** Analytics & feature flags  
**Pricing:** Free tier (1M events/month)  
**Setup:** posthog.com → Create project → Get API key  

```bash
npm install posthog-js
```

---

## Checklist: Dependencies

When starting, install these:

```bash
npm install @supabase/supabase-js
npm install lucide-react
npm install axios
npm install --save-dev @types/react
```

That's it for MVP. Everything else is built-in to Next.js.

---

## Versions Summary

| Tool | Version | Status |
|------|---------|--------|
| Node.js | 18+ | Required |
| Next.js | 14.x | Latest |
| React | 18.x | Latest |
| TypeScript | 5.x | Latest |
| TailwindCSS | 4.x | Latest |
| Supabase | Latest | Via npm |

**All free for MVP development.**
