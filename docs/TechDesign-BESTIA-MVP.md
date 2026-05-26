# BESTIA — Technical Design Document (MVP)

**Status:** Ready for Development  
**Version:** 1.0  
**Created:** 26 de mayo de 2026  
**Timeline:** 3 meses  
**Budget:** Free tier + USD 10/mes contingency  
**AI Approach:** IA escribe 100% código, tú despliegas  

---

## 1. Recommended Technology Stack

### Why This Stack?

**BESTIA needs:**
- ✅ Simple to build (launch in 3 months)
- ✅ Scales well (handles viral growth)
- ✅ Free tier generous (USD 0 initially)
- ✅ Real-time voting updates
- ✅ Photo storage
- ✅ No server management

**This stack delivers all of that:**

```
Frontend:        Next.js 14 + React + TailwindCSS
Backend:         Supabase (PostgreSQL + APIs)
Real-time:       Supabase Realtime (WebSocket)
Authentication:  Supabase Auth
File Storage:    Supabase Storage (images)
Hosting:         Vercel
Domain:          .com or .app (~$12/year)
Analytics:       PostHog (free tier)
Monitoring:      Sentry (free tier)
Version Control: GitHub
```

### Why Each Choice (Justification)

#### Frontend: Next.js 14

| Why | Alternative | Trade-off |
|-----|-------------|-----------|
| Full-stack (frontend + backend API routes) | React only + separate backend | More complexity, more servers to manage |
| Zero config deployment to Vercel | Create React App | CRA doesn't deploy as easily |
| Built-in image optimization | Plain React | Manual image handling |
| File-based routing (simple) | React Router (flexible but complex) | Less control over routing |
| TypeScript support out-of-box | Plain JavaScript | Type safety reduces bugs |

**IA's role:** IA will generate all Next.js code. You just deploy.

---

#### Backend: Supabase (NOT Firebase)

| Feature | Supabase | Firebase | Winner |
|---------|----------|----------|--------|
| **Database** | PostgreSQL (open standard) | Firestore (proprietary) | Supabase |
| **Real-time** | WebSocket-based | Slower at scale | Supabase |
| **Cost at scale** | Pay for compute + storage | Can get expensive | Supabase |
| **SQL queries** | Full SQL power | Limited query language | Supabase |
| **Export data** | Easy (postgres dump) | Complex (vendor lock) | Supabase |
| **Free tier** | Generous (500MB DB, 1GB file storage) | Similar | Tie |
| **Setup time** | 15 minutes | 15 minutes | Tie |

**Decision:** Supabase because you can export data later if needed, and SQL gives more power as you grow.

**IA's role:** IA will write all Supabase queries and API integrations.

---

#### Hosting: Vercel

| Why | Alternative | Trade-off |
|-----|-------------|-----------|
| Built for Next.js (1-click deploy) | AWS Lambda + manual setup | Complex deployment, DevOps needed |
| Zero DevOps (you push to GitHub, it deploys) | Heroku | No cold starts, instant scaling |
| Global CDN included | GCP App Engine | Faster for international users |
| Free tier sufficient for MVP | Netlify (similar but less Next.js optimized) | Comparable |

**IA's role:** IA will set up GitHub + Vercel integration. You click "Deploy" in Vercel UI.

---

#### Storage: Supabase Storage

| Why | Alternative | Trade-off |
|-----|-------------|-----------|
| Part of same platform (Supabase) | AWS S3 | S3 requires AWS account, more config |
| Simple signed URLs for public photos | Cloudinary | Pay per image, complexity |
| 1GB free tier per project | Firebase Storage | Less generous free tier |

**IA's role:** IA will generate upload code and signed URLs.

---

#### Real-time: Supabase Realtime

| Why | Alternative | Trade-off |
|-----|-------------|-----------|
| Part of Supabase (no extra config) | Socket.io + Node.js | Need to manage WebSocket server |
| Handles voting updates instantly | Firebase Realtime | Slower architecture, more expensive |
| Subscription model (listen to DB changes) | Polling database every 5s | Simple but inefficient at scale |

**How it works:**
```
Frontend: "Listen to this duel's votes"
Supabase: Watches database
When vote inserted: "Vote count changed! 234 → 235"
Frontend: Updates UI instantly
User sees: Marcador changes in real-time
```

**IA's role:** IA will write subscription listeners.

---

## 2. Architecture Overview

### How Data Flows

```
[User votes on web]
       ↓
[Frontend: React component captures click]
       ↓
[Validate: 1 vote per IP+device per duel]
       ↓
[INSERT into Supabase votes table]
       ↓
[Supabase Realtime broadcasts: "Vote inserted"]
       ↓
[All clients listening to this duel receive: "Vote count: 235"]
       ↓
[Frontend: Update UI instantly (no page refresh)]
       ↓
[User sees: Marcador changed immediately]
```

### System Components

```
┌─────────────────────────────────────────┐
│         Browser (User's Phone/PC)       │
│  ┌───────────────────────────────────┐  │
│  │  React Components                 │  │
│  │  - Vote button                    │  │
│  │  - Live scoreboard                │  │
│  │  - Share modal                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↕ (HTTPS)
┌─────────────────────────────────────────┐
│       Vercel (Next.js Server)           │
│  ┌───────────────────────────────────┐  │
│  │  API Routes (/api/vote, etc)      │  │
│  │  - Validate vote                  │  │
│  │  - Check IP+device                │  │
│  │  - INSERT to Supabase             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↕ (HTTPS)
┌─────────────────────────────────────────┐
│      Supabase (Backend Services)        │
│  ┌───────────────────────────────────┐  │
│  │  PostgreSQL Database              │  │
│  │  - votes table                    │  │
│  │  - duels table                    │  │
│  │  - users table                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Realtime (WebSocket)             │  │
│  │  - Broadcasts DB changes          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Auth (Email + Password)          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Storage (Images)                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↕ (HTTPS)
┌─────────────────────────────────────────┐
│      CDN (Vercel Edge Network)          │
│  - Cache images globally               │
│  - Serve JS bundles from nearest node  │
│  - Fast for users worldwide            │
└─────────────────────────────────────────┘
```

---

## 3. Feature Implementation Plan

### Feature 1: Upload Mascota + Duelo

**What gets built:**

```
Frontend:
  - /upload page (form)
    - Photo input (drag & drop or file picker)
    - Name input
    - Species dropdown
    - Submit button
  - Photo preview before upload
  - Loading spinner during upload

Backend (API Route):
  - POST /api/upload
    - Validate image (max 5MB, correct format)
    - Resize/compress image
    - Upload to Supabase Storage
    - Create pet record in database
    - Assign to current duel

Database:
  - pets table (id, owner_id, name, species, photo_url, created_at)
  - duels table (id, pet1_id, pet2_id, winner_id, created_at, expires_at)
  - votes table (id, duel_id, pet_id, user_ip, device_fingerprint, created_at)
```

**Implementation (AI does this):**

```javascript
// pages/upload.jsx (AI generates)
import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Upload() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    
    // 1. Upload image to Supabase Storage
    const { data: upload } = await supabase.storage
      .from('pet-photos')
      .upload(`${Date.now()}.jpg`, file);
    
    // 2. Create pet record
    const { data: pet } = await supabase
      .from('pets')
      .insert({ name, species, photo_url: upload.path })
      .single();
    
    // 3. Assign to duel
    await supabase.from('duels')
      .insert({ pet1_id: pet.id });
    
    router.push('/duels');
    setLoading(false);
  };

  return (
    <div>
      <h1>Sube tu mascota</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
      <select value={species} onChange={(e) => setSpecies(e.target.value)}>
        <option>Gato</option>
        <option>Perro</option>
        <option>Otro</option>
      </select>
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Subiendo...' : 'Subir mascota'}
      </button>
    </div>
  );
}
```

**Your job:** Click "Upload" button when testing. IA writes the code.

---

### Feature 2: Votación Sin Registro + Email Capture + Auto-Login

**Flow:**

```
1. User clicks link (from WhatsApp)
2. Lands on /duel/[duelId]
3. Sees two pets
4. Clicks "Vote A" or "Vote B"
5. POST /api/vote with IP + device fingerprint
6. Backend checks: "Already voted? (UNIQUE constraint)"
7. If no → vote inserted, count updated
8. Frontend shows modal: "¿Tienes mascota?"
9. User enters email
10. POST /api/capture-email
11. Backend creates user + sends confirmation
12. Auto-login (session set)
13. Redirect to /upload
```

**Database:**

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  duel_id UUID NOT NULL,
  pet_id UUID NOT NULL,
  user_ip VARCHAR(45),
  device_fingerprint VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (duel_id, user_ip, device_fingerprint)
  -- Only 1 vote per this combo
);

CREATE TABLE email_signups (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  device_fingerprint VARCHAR,
  source_duel_id UUID,
  created_at TIMESTAMP,
  converted_to_user_id UUID
);
```

**API Routes (IA writes):**

```javascript
// pages/api/vote.js
export default async function handler(req, res) {
  const { duelId, petId } = req.body;
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const deviceFingerprint = req.body.deviceFingerprint;

  try {
    const { data } = await supabase
      .from('votes')
      .insert({
        duel_id: duelId,
        pet_id: petId,
        user_ip: userIP,
        device_fingerprint: deviceFingerprint,
      });

    res.status(200).json({ success: true });
  } catch (error) {
    if (error.code === '23505') { // UNIQUE constraint
      res.status(400).json({ error: 'Ya votaste en este duelo' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

// pages/api/capture-email.js
export default async function handler(req, res) {
  const { email, deviceFingerprint, duelId } = req.body;

  // Validate email
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  // Create user in auth
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password: Math.random().toString(36).substring(2, 18),
  });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  // Send confirmation email
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  res.status(200).json({ success: true, userId: user.id });
}
```

**Your job:** Test voting flow. IA writes all code.

---

### Feature 3: Link Compartible

**What it does:**

```
User clicks "Compartir"
↓
Modal appears with options:
  - WhatsApp
  - SMS
  - Copy link
↓
Each option prefills with:
  "Vota por [Mascota]: https://bestia.app/duel/abc123"
↓
User clicks WhatsApp
↓
Browser opens WhatsApp (if mobile) or Web (if desktop)
↓
Message is prepopulated
↓
User sends to friends
↓
Friends click link
↓
Go to /duel/abc123 (no redirect, direct link)
```

**Frontend (IA writes):**

```javascript
// components/ShareModal.jsx
const handleShare = (platform) => {
  const shareUrl = `https://bestia.app/duel/${duelId}`;
  const text = `Vota por ${petName}: `;

  const urls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + shareUrl)}`,
    sms: `sms:?body=${encodeURIComponent(text + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
  };

  window.open(urls[platform], '_blank');
};

return (
  <div>
    <button onClick={() => handleShare('whatsapp')}>WhatsApp</button>
    <button onClick={() => handleShare('sms')}>SMS</button>
    <button onClick={() => handleShare('telegram')}>Telegram</button>
    <button onClick={() => {
      navigator.clipboard.writeText(`${text}${shareUrl}`);
      alert('Link copiado');
    }}>Copiar link</button>
  </div>
);
```

**Your job:** Click buttons, test links work. IA writes code.

---

### Feature 4: Marcador en Tiempo Real

**How it works:**

```
Frontend subscribes to duel:
  supabase.realtime.subscribe('votes', 
    { filter: `duel_id=eq.${duelId}` }, 
    (payload) => {
      // Update vote count immediately
      setVotes(payload.new);
    }
  )

When anyone votes:
  1. Vote inserted to database
  2. Supabase Realtime detects INSERT
  3. Broadcasts to all listeners: "New vote!"
  4. Frontend receives event
  5. Recalculates count
  6. UI updates instantly (no polling)
```

**Frontend (IA writes):**

```javascript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Scoreboard({ duelId }) {
  const [votes, setVotes] = useState({ pet1: 0, pet2: 0 });

  useEffect(() => {
    // Subscribe to votes for this duel
    const subscription = supabase
      .from(`votes:duel_id=eq.${duelId}`)
      .on('INSERT', (payload) => {
        // Recalculate votes
        fetchVoteCount();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [duelId]);

  const fetchVoteCount = async () => {
    const { data } = await supabase
      .from('votes')
      .select('pet_id')
      .eq('duel_id', duelId);

    const pet1Count = data.filter(v => v.pet_id === pet1Id).length;
    const pet2Count = data.filter(v => v.pet_id === pet2Id).length;

    setVotes({ pet1: pet1Count, pet2: pet2Count });
  };

  return (
    <div className="scoreboard">
      <div>Pet 1: {votes.pet1}</div>
      <div>Pet 2: {votes.pet2}</div>
    </div>
  );
}
```

**Your job:** Watch numbers update in real-time. IA writes code.

---

### Feature 5: Resultado & Bracket

**What happens at 24h:**

```
Scheduled job (Cron) runs every hour:
  1. Check duels where expires_at < NOW
  2. Count votes for each pet
  3. Determine winner
  4. Update duel: winner_id = petA.id
  5. Create next round duels with winners
  6. Losers go to consolation bracket
```

**Database (IA sets up):**

```sql
CREATE TABLE duels (
  id UUID PRIMARY KEY,
  pet1_id UUID NOT NULL,
  pet2_id UUID NOT NULL,
  winner_id UUID,
  bracket_round INT (1=semi, 2=quarter, etc),
  is_consolation BOOLEAN,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  result_displayed_at TIMESTAMP
);
```

**Your job:** Watch results show up after 24h. IA writes cron function.

---

## 4. Database Schema

### Complete Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  species VARCHAR NOT NULL,
  photo_url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  total_votes INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0
);

-- Duels table
CREATE TABLE duels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet1_id UUID NOT NULL REFERENCES pets(id),
  pet2_id UUID NOT NULL REFERENCES pets(id),
  winner_id UUID REFERENCES pets(id),
  bracket_round INT,
  is_consolation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  result_displayed_at TIMESTAMP
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  duel_id UUID NOT NULL REFERENCES duels(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  user_ip VARCHAR(45),
  device_fingerprint VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (duel_id, user_ip, device_fingerprint)
);

-- Email signups table
CREATE TABLE email_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE,
  device_fingerprint VARCHAR,
  source_duel_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  converted_to_user_id UUID REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_votes_duel_id ON votes(duel_id);
CREATE INDEX idx_votes_pet_id ON votes(pet_id);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_duels_expires_at ON duels(expires_at);
```

**Your job:** Nothing. IA will set this up in Supabase SQL editor.

---

## 5. Project Setup Checklist

### Week 1: Infrastructure Setup (IA guides you)

**Steps (you do these):**

```
1. Create Supabase account (free)
   - Go to supabase.com
   - Click "New project"
   - Name: "bestia"
   - Region: "us-east-1" (or closest to you)
   - Wait ~2 minutes

2. Create GitHub repository
   - Go to github.com/new
   - Name: "bestia"
   - Add README
   - Clone locally: git clone [repo]

3. Create Vercel account (free)
   - Go to vercel.com
   - Sign up with GitHub
   - Import repository
   - Wait for first deploy

4. Get Supabase keys
   - Go to Supabase dashboard
   - Settings → API
   - Copy: SUPABASE_URL and SUPABASE_ANON_KEY
   - Add to Vercel environment variables

5. Create .env.local
   - Create file in project root
   - Add Supabase keys
   - Never commit this file (already in .gitignore)

6. Initial Next.js project
   - IA will generate this with: npx create-next-app@latest bestia
   - You just run the command
```

**IA's role:** IA will write installation commands and guide you step-by-step.

---

### Week 1-2: Database Setup (IA does this)

**IA will:**
- Write all SQL schemas (above)
- Create tables in Supabase SQL editor
- Set up realtime subscriptions
- Create storage buckets

**You will:**
- Copy SQL from IA
- Paste into Supabase SQL editor
- Click "Run"
- Verify tables exist

---

### Week 2-3: Features Implementation (IA writes code)

**For each feature:**

1. IA writes component code
2. You copy into project
3. You test in browser
4. Report if it breaks
5. IA fixes

**Example workflow:**

```
You: "Generate Feature 2: Vote button"
IA: [writes 100 lines of code]
You: Copy to pages/duel.jsx
You: npm run dev
You: Open localhost:3000/duel/test
You: Click vote button
You: Report: "Button clicked, but error in console"
IA: "Ah, missing import. Change line 5 to..."
You: Fix, test again
You: "Works!"
```

---

## 6. Deployment Plan

### How Deploying Works (Very Simple)

```
Your workflow:
  1. Make code change (IA generates, you copy)
  2. git add .
  3. git commit -m "Add vote feature"
  4. git push
  5. (Done! Vercel auto-deploys)
  
Vercel sees the push, runs:
  - npm install
  - npm run build
  - Deploy to global CDN
  - Your app is live in 30-60 seconds
```

### Environment Variables

**Vercel dashboard setup:**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxx...
```

These are "public" (safe to expose) — the secret key stays hidden.

**Your job:** IA will tell you exactly what to copy-paste into Vercel. You paste it.

---

## 7. Cost Breakdown

### Year 1 Costs

| Service | Plan | Cost/Month | Notes |
|---------|------|-----------|-------|
| **Supabase** | Free | $0 | 500MB DB, 1GB storage, Realtime |
| **Vercel** | Free | $0 | 100GB bandwidth/month, Auto-deploy |
| **Domain** | .com (namecheap) | $0.99 | ~$12/year |
| **Email (Resend)** | Free | $0 | 100 emails/day free |
| **Analytics (PostHog)** | Free | $0 | 1M events/month free |
| **Monitoring (Sentry)** | Free | $0 | 5K events/month free |
| **GitHub** | Free | $0 | Unlimited public repos |
| | | | |
| **TOTAL** | | **$0-1/month** | Ultra cheap |

### When You Might Need to Pay (V2+)

```
If you get 10,000+ daily users:

Supabase overage (Pro plan):
  - $25/month + pay-per-use
  
Vercel Pro:
  - $20/month (analytics, priority support)
  
Custom domain email:
  - $6/month (Resend paid plan)
```

**Bottom line:** Stay on free tier until you hit 5K daily users. Then upgrade gradually.

---

## 8. Scaling Path

### 1K Users (Month 1-2)

```
Expect: Free tier easily handles
Database: 500MB plenty
Storage: 1GB easily covers 1K avatars
Bandwidth: 100GB/month plenty
No action needed ✅
```

### 5K Users (Month 2-3)

```
Monitor: Supabase dashboard
Database: ~50MB used (no issue)
Storage: ~100MB used (no issue)
Still free tier ✅
```

### 10K Users (Month 3)

```
Start watching Supabase usage
If approaching limits:
  Upgrade to Pro ($25/month)
  
Add caching for popular duels (Redis layer)
  Optional, not critical yet
```

### 100K Users (Month 6+)

```
Likely need:
  - Supabase Pro ($25/month)
  - Vercel Pro ($20/month)
  - Redis for vote caching ($15/month)
  - CDN for images (included in Vercel)
  
Total: ~$60/month
```

**Strategy:** Keep it simple until you hit scale. Then optimize.

---

## 9. Development Workflow (Your Day-to-Day)

### Daily Routine

```
Morning:
  1. Check GitHub issues (bug reports)
  2. Ask IA: "Fix issue #3: votes not counting"
  3. IA generates fix
  4. You test in localhost
  5. Push to GitHub
  6. Vercel deploys (automatic)

Afternoon:
  1. Ask IA: "Build Feature X"
  2. IA writes code
  3. You copy to project
  4. You test
  5. Report results

Evening:
  1. Check analytics (PostHog)
  2. Monitor errors (Sentry)
  3. Plan next features
```

### IA's Role in Each Phase

| Phase | IA Does | You Do |
|-------|---------|--------|
| **Setup** | Writes instructions | Execute commands |
| **Building** | Writes all code | Copy, test, report bugs |
| **Debugging** | Fixes errors | Describe what's broken |
| **Deployment** | Explains how | git push (Vercel auto-deploys) |
| **Scaling** | Recommends upgrades | Approve/execute |

---

## 10. Limitations & Constraints

### What This Stack CAN'T Do Easily

| Feature | Status | When? |
|---------|--------|-------|
| **Video uploads** | Not in V1 (storage cost) | V2 with revenue |
| **Mobile app native** | Not in V1 (web only) | V2 (3+ months in) |
| **AI moderation** | Not in V1 (manual review) | V2 (when users grow) |
| **Payment processing** | Not in V1 (no boosts yet) | V2 (paid features) |
| **Push notifications** | Not in V1 (needs app) | V2 (app native) |
| **Offline mode** | Not in V1 | V2 (PWA enhancement) |

### Performance Constraints

| Limit | Supabase Free | Vercel Free |
|-------|---------------|-------------|
| **Database size** | 500MB | — |
| **Storage** | 1GB | — |
| **Concurrent connections** | ~50 | Unlimited |
| **Bandwidth/month** | Unlimited | 100GB |
| **API calls/month** | Unlimited | Unlimited |
| **Build minutes/month** | Unlimited | 6000 (free) |

**At 10K users, you'll likely need paid tiers.**

---

## 11. Security Checklist

### What IA Will Build In

- ✅ HTTPS only (Vercel enforces)
- ✅ SQL injection prevention (Supabase parameterized queries)
- ✅ Rate limiting (1 vote per IP+device per duel)
- ✅ Email validation
- ✅ Password hashing (Supabase Auth handles)
- ✅ Session tokens (httpOnly cookies)
- ✅ CORS protection
- ✅ Image validation (format, size)

### What You Should Monitor

1. **Error logs** (Sentry) — Any attacks show as unusual errors
2. **Vote patterns** (PostHog) — Sudden spike = possible bot
3. **Email bounces** — Invalid emails

**If attacked:** Contact IA immediately with details. IA can add additional protections.

---

## 12. AI Assistance Strategy

### How to Use IA Effectively

**Good prompts:**

```
"Build the vote button component for /duel/[id].jsx 
that calls POST /api/vote with duel ID and pet ID"

"Create API route POST /api/vote that:
1. Gets user IP
2. Checks 1 vote per IP+device per duel
3. If valid, insert vote to database
4. If invalid, return error"

"Set up Supabase realtime listener for live vote count"
```

**Bad prompts:**

```
"Build voting"  (too vague)
"Make it work"  (not clear what "it" is)
"I don't understand databases" (ask specific question)
```

### When to Ask IA

| Situation | Action |
|-----------|--------|
| **Feature is unclear** | "How should Feature 2 work?" |
| **Code doesn't compile** | Show error, ask IA to fix |
| **Test fails** | "Test X failed, expect Y got Z" |
| **Performance is slow** | "Page loads in 5s, should be <2s" |
| **Don't understand output** | "Explain line 45" |

### When NOT to Ask IA

- Simple bugs (check console first)
- Questions about JavaScript basics (search MDN)
- Git issues (search GitHub docs)

---

## 13. Deployment Checklist (Week 8)

Before going public:

```
Frontend:
  ☐ All 5 features working (upload, vote, share, marcador, result)
  ☐ Responsive design tested (mobile + desktop)
  ☐ No console errors
  ☐ Images load fast
  ☐ Share links work in WhatsApp/SMS
  
Backend:
  ☐ Vote counting is accurate
  ☐ No duplicate votes possible
  ☐ Email capture working
  ☐ Auto-login functional
  ☐ Realtime updates <5 seconds
  
Database:
  ☐ Tables created
  ☐ Indexes added
  ☐ Backup configured
  
Monitoring:
  ☐ Sentry connected (error tracking)
  ☐ PostHog connected (analytics)
  ☐ GitHub Actions working (auto-deploy)
  
Security:
  ☐ .env.local in .gitignore
  ☐ No API keys in code
  ☐ HTTPS enforced
  ☐ Privacy policy written
  ☐ Terms of Service written
  
Pre-launch:
  ☐ 50-100 mascotas seeded (from beta users)
  ☐ Social media accounts created
  ☐ Landing page live
  ☐ Email templates tested
  ☐ Support email ready
```

---

## 14. Summary: Your 3-Month Journey

```
Week 1:    Setup (Supabase, Vercel, GitHub, local dev)
Week 2:    Database schema + auth
Week 3:    Feature 1 (Upload pet)
Week 4:    Feature 2 (Vote + email capture)
Week 5:    Feature 3 (Share link)
Week 6:    Feature 4 (Live marcador)
Week 7:    Feature 5 (Resultado)
Week 8:    Testing + bug fixes
Week 9:    Beta launch (friends/family)
Week 10:   Monitoring + adjustments
Week 11:   Final polish
Week 12:   PUBLIC LAUNCH 🚀
```

**Your role every week:** Test + report bugs. IA fixes them.

---

## 15. Key Files You'll Work With

### Project Structure

```
bestia/
├── pages/
│   ├── index.jsx (landing)
│   ├── upload.jsx (upload pet)
│   ├── duel/[id].jsx (vote page)
│   ├── auth/ (login/signup)
│   └── api/
│       ├── vote.js
│       ├── capture-email.js
│       └── upload.js
├── components/
│   ├── Scoreboard.jsx
│   ├── ShareModal.jsx
│   └── VoteButton.jsx
├── lib/
│   ├── supabase.js (client connection)
│   └── auth.js (auth helpers)
├── .env.local (secrets, NEVER commit)
├── package.json
├── next.config.js
└── tailwind.config.js
```

**Your job:** Know where files are. IA generates them.

---

## Questions Before Starting?

Before you begin development:

1. Do you have a GitHub account? (You'll need it)
2. Can you run terminal commands? (npm, git)
3. Any local dev environment set up? (Node.js installed?)

If unsure, tell IA and IA will walk you through setup.

---

**Next Step:** Run `/vibe-build` to start actually building the app, step by step.

This document is your north star. Reference it when confused about "why this choice" or "what comes next."

You've got this. 🚀
