# AGENTS.md — Master Plan for BESTIA

**Project:** BESTIA — Torneo de mascotas viral  
**Goal:** Build MVP: votación en vivo + compartir links + marcador real-time  
**Stack:** Next.js 14 + React + Supabase + Vercel  
**Current Phase:** Phase 1 - Foundation  
**User Level:** Vibe-coder (AI writes code, you deploy)  

---

## How I Should Think

1. **Understand Intent First** — What does the user actually need?
2. **Ask If Unsure** — Missing info? Ask before proceeding
3. **Plan Before Coding** — Propose approach, get approval, then implement
4. **Verify After Changes** — Test after each feature, fix before moving on
5. **Explain Trade-offs** — When recommending, mention alternatives

**Remember:** This user wants to launch fast. Prioritize working over perfect.

---

## Plan → Execute → Verify

**Every feature follows this pattern:**

1. **Plan:** "Here's how I'll build Feature X: [steps]. Proceed?"
2. **Execute:** Implement ONE feature at a time. Keep changes focused.
3. **Verify:** Run tests, check browser, confirm it works before next task.

---

## Context Files

Load only when needed:

- `agent_docs/tech_stack.md` — Tech details, libraries, versions
- `agent_docs/code_patterns.md` — Code style, naming, structure
- `agent_docs/project_brief.md` — Product vision, conventions, quality gates
- `agent_docs/product_requirements.md` — Features, user stories, metrics
- `agent_docs/testing.md` — Test strategy, verification loop
- `docs/PRD-BESTIA-MVP.md` — Original product requirements
- `docs/TechDesign-BESTIA-MVP.md` — Implementation guide

---

## Current State

**Last Updated:** 27 de mayo de 2026 23:30 UTC  
**Working On:** Task 2.7 - Create POST /api/vote endpoint  
**Recently Completed:** Task 2.6 - Duel voting page created and tested (two-sided comparison with vote counts)  
**Blocked By:** None  
**Progress:** Phase 2 Feature 1 & 2 (Upload + Voting page) ~60% complete  

---

## Roadmap

### Phase 1: Foundation (Week 1-2)

Setup everything needed to build features.

- [x] **Task 1.1:** Initialize Next.js project locally ✅
- [x] **Task 1.2:** Connect to Supabase (database + auth) ✅
- [x] **Task 1.3:** Set up Vercel for auto-deployment ✅
- [x] **Task 1.4:** Create database schema (tables: users, pets, duels, votes) ✅
- [x] **Task 1.5:** Test database connection works ✅

**Success criteria:** ✅ COMPLETE - Server running, Supabase connected, schema created, health endpoint working

---

### Phase 2: Core Features (Week 3-8)

Build the 5 MVP features from PRD.

#### Feature 1: Upload Mascota (Week 3)
- [x] **Task 2.1:** Create `/upload` page (form: photo, name, species) ✅
- [x] **Task 2.2:** Photo upload to Supabase Storage ✅
- [x] **Task 2.3:** Save pet to database ✅
- [x] **Task 2.4:** Photo preview before submit ✅
- [x] **Task 2.5:** Test upload flow end-to-end ✅

**Success criteria:** ✅ COMPLETE - Upload works, photo in Storage, pet in database

#### Feature 2: Votación Sin Registro + Email Capture (Week 4)
- [ ] **Task 2.6:** Create `/duel/[id]` page (two pets, vote buttons)
- [ ] **Task 2.7:** POST /api/vote endpoint (validate IP+device, insert vote)
- [ ] **Task 2.8:** Prevent duplicate votes (1 per IP+device per duel)
- [ ] **Task 2.9:** Post-vote modal: "¿Tienes mascota?" + email input
- [ ] **Task 2.10:** POST /api/capture-email (create user, auto-login)
- [ ] **Task 2.11:** Test vote flow + email capture

**Success criteria:** Can vote, email capture works, auto-login successful

#### Feature 3: Link Compartible (Week 4-5)
- [ ] **Task 2.12:** Create share modal (WhatsApp, SMS, Telegram, Copy)
- [ ] **Task 2.13:** Generate short links (duel IDs in URL)
- [ ] **Task 2.14:** Test links work in WhatsApp/SMS/Telegram
- [ ] **Task 2.15:** Track share clicks (analytics)

**Success criteria:** Links work, prefilled messages, sharable across platforms

#### Feature 4: Marcador en Tiempo Real (Week 5-6)
- [ ] **Task 2.16:** Set up Supabase Realtime listeners
- [ ] **Task 2.17:** Create Scoreboard component (vote count display)
- [ ] **Task 2.18:** Subscribe to vote changes (WebSocket)
- [ ] **Task 2.19:** Update UI instantly (<5s latency)
- [ ] **Task 2.20:** Test with multiple concurrent votes

**Success criteria:** Vote count updates in real-time, no polling, <5s latency

#### Feature 5: Resultado & Bracket (Week 7-8)
- [ ] **Task 2.21:** Create result page (winner, loser, next round)
- [ ] **Task 2.22:** Implement winner determination (24h after start)
- [ ] **Task 2.23:** Consolation bracket logic (losers get another chance)
- [ ] **Task 2.24:** Show champion name permanently
- [ ] **Task 2.25:** Share trofeo digital

**Success criteria:** Results show correctly, bracket advances, trofeo shareable

---

### Phase 3: Polish (Week 9)

Make it production-ready.

- [ ] **Task 3.1:** Error handling (show user-friendly messages)
- [ ] **Task 3.2:** Mobile responsiveness (test iPhone, Android, desktop)
- [ ] **Task 3.3:** Loading states (spinners during API calls)
- [ ] **Task 3.4:** Image optimization (resize, compress)
- [ ] **Task 3.5:** Performance check (page load <2s)
- [ ] **Task 3.6:** Accessibility (alt text, labels, keyboard navigation)
- [ ] **Task 3.7:** Security audit (no secrets in code, HTTPS, validation)

**Success criteria:** App feels polished, fast, responsive, secure

---

### Phase 4: Launch (Week 10-12)

Deploy and prepare for public.

- [ ] **Task 4.1:** Set up Sentry (error monitoring)
- [ ] **Task 4.2:** Set up PostHog (analytics)
- [ ] **Task 4.3:** Deploy to Vercel (production)
- [ ] **Task 4.4:** Test live environment (vote, share, marcador)
- [ ] **Task 4.5:** Create landing page
- [ ] **Task 4.6:** Set up domain (bestia.app or bestia.com)
- [ ] **Task 4.7:** Pre-load 50-100 mascotas (beta test pool)
- [ ] **Task 4.8:** Run through launch checklist
- [ ] **Task 4.9:** Beta launch (share with friends/family)
- [ ] **Task 4.10:** Monitor errors, fix before public

**Success criteria:** Live on production, monitoring active, beta running smoothly

---

## Key Commands

```bash
npm run dev              # Start local server (localhost:3000)
npm run build            # Build for production
npm run lint             # Check code style
npm test                 # Run tests (if set up)
npm install              # Install dependencies
git add .                # Stage changes
git commit -m "..."      # Create commit
git push                 # Deploy to Vercel (automatic)
```

---

## What NOT To Do

- ❌ Delete files without asking
- ❌ Modify database schema without backup plan
- ❌ Add features outside current phase
- ❌ Skip testing for "simple" changes
- ❌ Commit secrets (API keys, passwords)
- ❌ Use deprecated libraries
- ❌ Build complex features before validating simple ones

---

## Progress Tracking

**Update this after each completed task:**

```markdown
## Current State
**Last Updated:** [Date]
**Working On:** [Task X.X]
**Recently Completed:** [Task X.X - Description]
**Blocked By:** None (or describe)
```

---

## Success Metrics (For Tracking)

By end of MVP:

| Metric | Target | Status |
|--------|--------|--------|
| All 5 features work | ✅ | TBD |
| Deployed to production | ✅ | TBD |
| Mobile responsive | ✅ | TBD |
| <2s page load | ✅ | TBD |
| 0 critical errors | ✅ | TBD |
| 50-100 mascotas seeded | ✅ | TBD |

---

## Communication with AI

**When asking for help:**

Good:
```
"Build Feature 1: upload page with photo input, name input, species dropdown"
```

Bad:
```
"Build voting"
```

**When reporting bugs:**

Good:
```
"Feature 2 failed: clicked vote button, got error 'Cannot read property duelId'"
```

Bad:
```
"It's broken"
```

---

## Next Step

When ready to start building:

```
Say: "Start with Phase 1: Foundation"
or
Say: "Build Task 1.1: Initialize Next.js project"
```

I'll:
1. Propose a plan
2. Wait for approval
3. Implement
4. Test
5. Report results

Let's build! 🚀
