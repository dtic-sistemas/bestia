# Project Brief — BESTIA MVP

Quick reference for project constraints, conventions, and quality gates.

---

## Project Context

**App:** BESTIA  
**Goal:** Torneo de mascotas viral con votación en vivo y compartir links  
**User:** Vibe-coder (AI writes code, you deploy)  
**Timeline:** 3 months  
**Budget:** USD 500 max  
**Status:** MVP (launch after Week 12)  

---

## Product Vision (30 seconds)

BESTIA is a **weekly tournament app** where pet owners vote on pet matchups. Any pet can win — not just beautiful ones. The magic: **people share links to vote for their pets**, creating viral growth. Users do the marketing for free.

**Core Loop:**
1. Upload pet photo (30s)
2. Mascota enters tournament
3. Owner shares link to friends
4. Friends vote
5. Owner sees live vote count
6. Winner gets trophy (digital, shareable)
7. Next week, new tournament

---

## Success Metrics (MVP)

| Metric | Target | Why |
|--------|--------|-----|
| **Launched** | Week 12 | On schedule |
| **All 5 Features Work** | 100% | No broken features |
| **Mobile Responsive** | Yes | 90%+ traffic is mobile |
| **Page Load <2s** | Yes | Fast = engagement |
| **0 Critical Bugs** | Yes | Must be stable |
| **50-100 Pets Seeded** | Yes | Cold start problem |
| **Deployed to Vercel** | Yes | Live, not localhost |

---

## Technical Constraints

### Must Haves
- ✅ Real-time vote updates (<5s latency)
- ✅ Work on mobile (iPhone, Android)
- ✅ Work on desktop
- ✅ No login required to vote
- ✅ Share links functional in WhatsApp/SMS
- ✅ Images optimized (load fast)

### Nice to Haves (for future)
- Video support (storage cost issue)
- Push notifications (needs app native)
- AI moderation (manual first)
- Payment processing (no paid features yet)

### Out of Scope
- Mobile app native (web only)
- Video uploads (too expensive)
- Complex analytics
- Multi-language (English OK for MVP)

---

## Code Quality Gates

**Before committing code:**

1. **Compiles:** `npm run build` succeeds
2. **No console errors:** Browser DevTools clean
3. **Responsive:** Works on iPhone SE (375px) and desktop (1920px)
4. **No secrets:** No API keys in code
5. **Error handling:** Try/catch around API calls
6. **Types:** TypeScript no errors

**Before deploying:**

1. **Tested in browser:** Clicked buttons, confirmed it works
2. **Mobile tested:** Checked on actual phone (or Chrome DevTools)
3. **Network clean:** No failed API calls in Network tab
4. **Production env vars:** Vercel has Supabase keys
5. **All features tested:** Upload, vote, share, marcador, result

---

## Coding Conventions

### TypeScript is Required

```typescript
// Good: Typed
interface Pet {
  id: string;
  name: string;
  species: 'gato' | 'perro';
}

// Bad: No types
const pet = { id: '1', name: 'Fluffy' };
```

### Error Handling is Required

```typescript
// Good: Try/catch
try {
  await supabase.from('votes').insert(vote);
} catch (error) {
  setError('Vote failed');
}

// Bad: Silent error
await supabase.from('votes').insert(vote);
```

### Comments Only for Why, Not What

```typescript
// Good: Explains why
// Firebase Realtime was too slow at scale, use Supabase instead
const realtime = supabase.channel(`duel:${duelId}`);

// Bad: States the obvious
// Get the duel ID from URL params
const duelId = params.id;
```

### Function Names Describe What They Do

```typescript
// Good: Clear intent
async function fetchVoteCount(duelId: string) { }
function handleVoteClick() { }
function isValidEmail(email: string) { }

// Bad: Vague
async function fetch() { }
function handle() { }
function check() { }
```

---

## Deployment Checklist

**Before merging to main (triggers Vercel deploy):**

- [ ] All features work in browser
- [ ] Mobile responsive
- [ ] No console errors
- [ ] TypeScript compiles (npm run build succeeds)
- [ ] .env.local NOT committed (check .gitignore)
- [ ] Meaningful commit message
- [ ] All tasks for this feature complete

**What happens after you push:**
1. GitHub receives push
2. Vercel sees new commit
3. Builds automatically (takes 30-60s)
4. Deploys to live URL
5. Everyone can see the changes

---

## Key Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Check production build (not optional!)

# Version control
git status               # See what changed
git add .                # Stage all changes
git commit -m "Add feature"  # Create commit
git push                 # Deploy to Vercel (automatic)

# Debugging
npm test                 # Run tests (if configured)
npm run lint             # Check code style
```

---

## Accessibility (Basic)

Every component should have:

```jsx
// Images
<img alt="Pet photo" />

// Buttons
<button aria-label="Vote for Manchas">Vote</button>

// Links
<a href="/duel/123" aria-label="Vote on duel 123">Link</a>

// Form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

Why? Users with screen readers can navigate.

---

## Performance Targets

| Metric | Target | How to achieve |
|--------|--------|----------------|
| **First Contentful Paint** | <1.5s | Next.js optimization, Vercel CDN |
| **Largest Contentful Paint** | <2.5s | Optimize images, lazy load |
| **Cumulative Layout Shift** | <0.1 | Fixed heights, no surprise layout moves |
| **Time to Interactive** | <3.5s | Code splitting, minification |

**How to check:** Chrome DevTools → Lighthouse

---

## Security Basics

**What we do:**
- ✅ HTTPS (Vercel enforces)
- ✅ Supabase handles passwords (never store plaintext)
- ✅ Rate limiting (1 vote per IP+device)
- ✅ Input validation (email regex, file type check)
- ✅ No API keys in frontend code (use .env.local)

**What we don't do (yet):**
- ❌ Bot detection (manual review first)
- ❌ Advanced fraud analysis
- ❌ Two-factor auth
- ❌ Penetration testing

---

## Who Does What

| Task | User | AI |
|------|------|-----|
| **Plan feature** | Ask AI | Propose approach |
| **Write code** | Review | Writes 100% |
| **Test in browser** | Execute | Advises |
| **Deploy** | Click "Deploy" in Vercel UI | Not needed |
| **Debug error** | Report error message | Fixes |
| **Decide design** | Make choice | Shows options |

---

## Communication Guidelines

**Clear request:**
```
"Build Feature 2, step 2.6: create /duel/[id] page with two pet photos and vote buttons"
```

**Vague request:**
```
"Build the duel page"
```

**Good bug report:**
```
"Feature 2.6 failed: clicked vote button, got error in console: 
'Cannot read property duelId of undefined' on line 45 of page.tsx"
```

**Bad bug report:**
```
"It broke"
```

---

## Decision Log

**Key decisions made during design:**

| Decision | Why | Alternative |
|----------|-----|-------------|
| Next.js | Zero-config, Vercel integration | React + Express (more complex) |
| Supabase | PostgreSQL, Realtime, good free tier | Firebase (more expensive at scale) |
| Vercel | Built for Next.js, auto-deploy | AWS, Heroku (need DevOps) |
| TailwindCSS | Fast styling, no CSS files | Styled-components (slower dev) |
| No app native in V1 | PWA on web is faster | Native needs App Store review |

---

## Continuity Notes for AI

**If conversation resets, important context:**

1. **User is vibe-coder:** Wants AI to write code, user deploys
2. **Timeline: 3 months:** Not a rush, but quality matters
3. **Budget: USD 500:** Stay on free tiers, only pay if critical
4. **Tech stack:** Next.js + Supabase + Vercel (already decided)
5. **5 features:** Upload pet, vote w/o login, share link, live marcador, result

**What to do on reset:**
1. Load `AGENTS.md` to see current phase
2. Load `docs/PRD-BESTIA-MVP.md` for requirements
3. Load `docs/TechDesign-BESTIA-MVP.md` for implementation
4. Ask user: "What was the last thing you completed?"

---

## Quality Philosophy

**Ship something that works over something perfect.**

MVP is not about perfect code or beautiful design. It's about:
- ✅ Does the feature work?
- ✅ Is it responsive?
- ✅ Does it load fast?
- ✅ Are there errors?

If yes to all 4, move to next feature. Perfection comes in V2.

---

## Questions Before Starting?

Before launching into development, confirm:

1. Do you have Node.js installed? (`node --version`)
2. Do you have VS Code? (or similar editor)
3. Do you have a GitHub account? (for deploying)
4. Do you have a Supabase account? (or know how to create)
5. Are you comfortable with terminal commands? (git, npm)

If no to any, ask before proceeding. AI can guide through setup.
