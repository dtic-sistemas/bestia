# Product Requirements — BESTIA MVP

Core features and user stories extracted from PRD.

---

## Core Problem

**Current State:** People post pet photos on Instagram, WhatsApp, TikTok — no structure, no competition, no reason to mobilize their network.

**Solution:** Structured pet tournament with voting + sharing = viral loop.

**Why:** 67% of households have pets. Pet care app market growing 15-18% CAGR. Ready for this.

---

## Target Users

### Primary: "The Obsessive Owner"
- Female, 25-40
- Already posts pet photos 3-4x/week
- Has WhatsApp groups dedicated to pet photos
- Active on Instagram/TikTok
- **Motivation:** Her pet deserves recognition

### Secondary: "The Amplifier"
- Male, 35-55
- Doesn't use social actively
- Votes when daughter asks "dad vote for Copito"
- Shares with coworkers
- **Motivation:** Family + casual participation

### Tertiary: "The Competitive"
- Any age/gender
- Obsessed with winning
- Pays for boosts, proposes categories
- Checks app 6+ times/day
- **Motivation:** Competition, ego

---

## Feature 1: Upload Mascota & Duelo

**User Story:**
```
As a pet owner,
I want to upload my pet's photo in <2 minutes,
So that my pet can compete in the tournament.
```

**What It Does:**
- Upload photo (JPG, PNG, max 5MB)
- Enter pet name
- Select species (gato, perro, otro)
- Submit
- Pet is added to current week's tournament

**Acceptance Criteria:**
- Photo uploads without error
- Photo is optimized (resized, compressed)
- Pet appears in duels within 30s
- Mobile and desktop both work
- Drag-and-drop support

**Success Metric:**
- 1000 pets uploaded in month 1
- Average upload time <2 minutes
- 0 failed uploads

---

## Feature 2: Votación Sin Registro + Email Capture

**User Story:**
```
As someone who received a vote link,
I want to vote without creating an account,
So that I can quickly vote for my friend's pet.

And as a pet owner,
I want to capture email addresses from voters,
So that I can invite them to upload their pet.
```

**What It Does:**
1. Click link (no login required)
2. See two pets side-by-side
3. Click vote button
4. See result: "Your vote counted!"
5. Prompt: "Do you have a pet? Upload it"
6. If yes → Enter email → Auto-login → Go to upload
7. If no → Close modal

**Vote Fraud Prevention:**
- Only 1 vote per IP + device per duel
- Validated at database level (UNIQUE constraint)
- Prevents "refresh and vote again" spam

**Email Capture:**
- Optional (user can skip)
- Creates account with temporary password
- Sends confirmation email
- Auto-login after account creation

**Acceptance Criteria:**
- Can vote without account
- Vote counts correctly
- Email capture optional
- No duplicate votes possible
- Deep link works in WhatsApp/SMS/Telegram

**Success Metrics:**
- 70%+ of votes are from non-registered users
- 30%+ conversion (voter → user)
- 0 fraud incidents

---

## Feature 3: Link Compartible

**User Story:**
```
As a pet owner,
I want to share my duel link in one click,
So that my friends can easily vote for my pet.
```

**What It Does:**
1. Click "Compartir" button
2. Modal appears with options:
   - WhatsApp
   - SMS
   - Telegram
   - Copy link
3. Click option
4. Message prefilled: "Vota por [Pet]: [Link]"
5. Send to friends

**Link Format:**
```
https://bestia.app/duel/abc123def456
```

**Tracking:**
- Count click-throughs
- Show in dashboard (optional for MVP)

**Acceptance Criteria:**
- Link works in all platforms
- Message is prefilled
- URL is short and shareable
- Deep link properly routes to duel
- Mobile and desktop both work

**Success Metrics:**
- 40%+ of active users share a link
- 25%+ of votes come from shared links

---

## Feature 4: Marcador en Tiempo Real

**User Story:**
```
As a pet owner,
I want to see live vote count for my pet,
So that I can monitor if it's winning and adjust my campaign.
```

**What It Does:**
1. Vote count updates in real-time
2. No refresh needed
3. Updates every <5 seconds
4. Shows: "Pet A: 234 votes vs Pet B: 198 votes"

**Technology:**
- Supabase Realtime (WebSocket)
- Listen for INSERT events on votes table
- Broadcast to all connected clients

**Acceptance Criteria:**
- Vote count accurate
- Updates <5s after vote cast
- Works with 10K+ concurrent users
- No lag, no desynchronization
- Works on mobile and desktop

**Success Metrics:**
- 95%+ uptime of realtime updates
- <500ms latency average
- 0 data desynchronization issues

---

## Feature 5: Resultado & Bracket

**User Story:**
```
As a pet owner,
I want to know the result 24 hours after my duel starts,
So that my pet can advance or go to consolation.
```

**What It Does:**
1. Duel duration: 24 hours
2. At 24h mark: Determine winner (whoever has most votes)
3. Show result page:
   - "✅ [Winner] won!"
   - "❌ [Loser] goes to consolation"
4. Champion name displayed publicly: "[Pet] won: The Most Fea of the Week (May 26)"
5. Winner can screenshot and share trofeo
6. Loser enters consolation bracket (not-sad-alternative tournament)

**Bracket Logic:**
- 1st round: random pairings
- 2nd round: winners face each other
- Final: last two remaining
- Champion crowned for the week
- Consolation bracket runs parallel (for morale)

**Acceptance Criteria:**
- Result shows automatically 24h after duel start
- Winner determined correctly (most votes)
- Champion name displayed
- Trofeo is shareable
- Bracket advances correctly
- Consolation bracket works independently

**Success Metrics:**
- 100% of duels have correct result
- 80%+ of losers participate in consolation
- 40%+ of trofeos are shared

---

## Non-Functional Requirements

### Performance
- Page load: <2 seconds
- Vote submit: <500ms
- Real-time update: <5 seconds

### Reliability
- 99.5% uptime
- 0 lost votes
- Database backups daily

### Security
- HTTPS everywhere
- Input validation (email regex, file type)
- Rate limiting (1 vote per IP+device)
- No plaintext passwords
- No API keys in frontend

### Usability
- Mobile responsive (375px-1920px)
- No login required to vote
- Share in 1 click
- Fast upload (<30s)

### Scalability
- Handle 10K concurrent users
- Support 10M votes/month
- 1GB+ photo storage

---

## Out of Scope (V2+)

| Feature | Why Not V1 | When |
|---------|-----------|------|
| **Video uploads** | Storage cost | V2 (w/ revenue) |
| **Categorías votadas** | Needs 5K+ users for voting | V2 (month 4+) |
| **Boosts pagados** | Monetize after PMF | V2 (month 3+) |
| **App nativa** | App Store review delays | V2 (month 6+) |
| **Push notifications** | Requires app native | V2 |
| **Merchandise** | Requires integration | V2 (month 6+) |
| **Sponsors** | Requires partnerships | V2 (10K+ users) |

---

## Success Metrics (V1)

**By end of week 12 (launch):**

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Features Work** | All 5 complete | Manual testing |
| **Deployed** | Live on Vercel | Visit URL |
| **Mobile Responsive** | Yes | Chrome DevTools |
| **Page Load** | <2s | Lighthouse |
| **Uptime** | 99%+ | Sentry monitoring |
| **Bugs** | <5 critical | User reports |

**By month 1 (January 2027):**

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Users** | 1,000 | Supabase auth |
| **Pets** | 500-1000 | pets table count |
| **Duels** | 500+ | duels table count |
| **Votes** | 5,000+ | votes table count |
| **Share Rate** | 40%+ | PostHog analytics |
| **Retention Day 7** | 40%+ | PostHog DAU/MAU |

---

## User Flows

### Flow 1: Upload Pet
```
User Opens App → Sees "Upload pet" button
→ Clicks → Lands on /upload
→ Drags photo → Enters name, species
→ Clicks "Submit"
→ Photo uploads to Supabase Storage
→ Pet created in database
→ Duel assigned
→ Redirected to /duel/[id]
→ See pet competing ✅
```

### Flow 2: Vote
```
Friend Receives WhatsApp: "Vote for Manchas"
→ Clicks link
→ Lands on /duel/abc123
→ Sees Manchas vs Copito
→ Clicks "Vote for Manchas"
→ POST /api/vote called
→ Vote validated (1 per IP+device)
→ Vote inserted in database
→ Modal appears: "Have a pet?"
→ Clicks "Yes"
→ Enters email
→ Account created
→ Auto-login
→ Redirected to /upload
→ Uploads pet ✅
```

### Flow 3: See Result
```
24 hours later
→ Duel expires
→ Cron job determines winner
→ /duel/[id] shows result
→ "Manchas won!"
→ Trofeo displayed
→ Share button visible
→ User clicks share
→ Posts to Instagram/WhatsApp ✅
```

---

## Assumptions & Dependencies

**Assumptions:**
- Supabase stays available (99.9% uptime guarantee)
- Vercel auto-deploy works
- Users have WhatsApp/mobile
- Users will share links organically

**Dependencies:**
- Supabase must be set up (database + auth + storage)
- GitHub connected to Vercel
- Domain configured (DNS points to Vercel)
- Sentry configured for error tracking

**Risks:**
- Cold start (not enough mascotas day 1) → Pre-seed 50-100
- Viral loop doesn't work → Validate with beta users
- Performance issues at scale → Monitor from day 1
- Moderation problems → Manual review for MVP

---

## Acceptance

**Product is ready to launch when:**

- ✅ All 5 features work
- ✅ Mobile + desktop responsive
- ✅ No critical bugs
- ✅ 50-100 mascotas seeded
- ✅ Monitoring configured
- ✅ Privacy policy + ToS live
- ✅ Beta test passes (friends can vote, share, win)

---

## References

- Full PRD: `docs/PRD-BESTIA-MVP.md`
- Tech Design: `docs/TechDesign-BESTIA-MVP.md`
- Database Schema: See Supabase SQL
