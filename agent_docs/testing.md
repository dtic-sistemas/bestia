# Testing Strategy — BESTIA MVP

How to verify code works before merging.

---

## Philosophy

**For MVP: Manual testing is fine.**

We're not building enterprise software. We're validating a viral loop. Automated tests slow us down.

**Verification approach:**
1. Code compiles (npm run build)
2. Test in browser (click buttons)
3. Check console for errors
4. Mobile device test (or DevTools)
5. Deployment verification

If it works for the user, ship it.

---

## Pre-Commit Checklist

Before `git commit`, ask:

- [ ] Code compiles? (`npm run build` no errors)
- [ ] Browser works? (clicked buttons, no visual errors)
- [ ] Mobile works? (tested on actual phone or DevTools)
- [ ] Console clean? (DevTools console no errors/warnings)
- [ ] API calls successful? (Network tab shows 200, not 400/500)
- [ ] Secrets not in code? (.env.local is local-only)
- [ ] Types correct? (TypeScript has no errors)
- [ ] Something makes sense? (code is readable)

---

## Development Testing (npm run dev)

### Manual Testing Flow

**1. Start dev server:**
```bash
npm run dev
```
Opens http://localhost:3000

**2. Open DevTools (F12):**
- Console tab: Check for errors/warnings
- Network tab: Watch API requests
- Application tab: Check stored data

**3. Test Feature (Example: Upload)**
```
1. Navigate to /upload
2. Drag photo to input
3. Type pet name "Manchas"
4. Select species "Gato"
5. Click "Submit"
6. Watch Network tab:
   - POST /api/upload
   - Should return 200 (success)
7. Check browser:
   - Should show "Success!"
   - Should redirect to /duel/[id]
8. If fails:
   - Check console for error message
   - Report to AI with error text
```

**4. Test Feature (Example: Vote)**
```
1. Navigate to /duel/abc123 (real duel ID)
2. See two pets side-by-side
3. Click "Vote for Pet A"
4. Watch Network tab:
   - POST /api/vote
   - Check Response (should show success)
5. See live counter update
6. Refresh page (F5)
7. Check vote count persisted
8. Try voting again:
   - Should get "Already voted" error
9. If fails:
   - Report to AI with error message
```

---

## Testing in Browser DevTools

### Console Tab

**What to look for:**
- Red errors (❌)
- Yellow warnings (⚠️)
- No errors = good

**Common errors to fix:**
```
"Cannot read property X of undefined"
→ Something is null/undefined
→ Add null check before using it

"Failed to fetch from /api/vote"
→ API endpoint broken
→ Check API route syntax

"Maximum call stack exceeded"
→ Infinite loop
→ Check useEffect dependencies
```

### Network Tab

**What to watch:**
- Status codes
  - 200 = success ✅
  - 400 = bad request (validation error)
  - 500 = server error
  - Any error = report to AI
- Response preview
  - Should show response data
  - If error, shows error message
- Timing
  - Should be <500ms for API calls
  - <2s for page load

**Common issues:**
```
POST /api/vote returns 400
→ Check request body in Network tab
→ Might be missing required field

All API calls fail
→ Check Supabase keys in .env.local
→ Verify database is connected
```

### Application Tab

**What to check:**
- Storage → Local Storage
  - Should contain session info
- Cookies
  - Auth session cookie should exist

---

## Mobile Testing

### Option 1: Chrome DevTools (Simulated)

```
1. Open DevTools (F12)
2. Click Device icon (top-left)
3. Select iPhone SE (375px)
4. Test:
   - Can tap buttons?
   - Text readable?
   - Images load?
   - No horizontal scroll?
```

### Option 2: Real Device (Better)

```
1. Start dev server: npm run dev
2. Get your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
3. On phone, visit: http://[YOUR_IP]:3000
4. Test everything manually
```

---

## Test Cases by Feature

### Feature 1: Upload Pet

**Happy path:**
```
✅ Upload photo (drag & drop)
✅ Enter pet name
✅ Select species
✅ Click submit
✅ See success message
✅ Redirected to /duel/[id]
✅ Photo appears in duel
```

**Edge cases:**
```
❌ Upload photo >5MB → Should show error
❌ Upload wrong file type → Should reject
❌ Click submit with empty name → Should validate
❌ Network timeout → Should show "Try again" button
```

### Feature 2: Vote

**Happy path:**
```
✅ Click vote button
✅ See "Vote counted!" message
✅ Email input appears
✅ Enter email
✅ Click "Upload pet"
✅ Redirected to /upload
✅ Logged in (no login page)
```

**Edge cases:**
```
❌ Vote twice from same device → Should show "Already voted"
❌ Enter invalid email → Should validate
❌ Network error → Should retry
❌ Click "Maybe later" → Should close modal
```

### Feature 3: Share

**Happy path:**
```
✅ Click share button
✅ Modal appears
✅ Click "WhatsApp"
✅ Prefilled message shows
✅ Can send to friends
✅ Friend clicks link
✅ Friend sees correct duel
```

**Edge cases:**
```
❌ No WhatsApp app → Should show message
❌ Link broken → Should 404 or redirect
❌ Copy button → Text in clipboard
```

### Feature 4: Marcador

**Happy path:**
```
✅ See vote count for both pets
✅ Vote for Pet A
✅ Count updates instantly (<5s)
✅ Refresh page → Count still there
✅ Vote for Pet B
✅ Both counts update
```

**Edge cases:**
```
❌ 1000+ votes at same time → Should handle
❌ Offline (no internet) → Should reconnect when online
❌ WebSocket disconnect → Should reconnect
```

### Feature 5: Result

**Happy path:**
```
✅ 24 hours pass
✅ Result shows automatically
✅ Winner determined correctly
✅ Trofeo appears
✅ Share button works
✅ Next duel visible
```

**Edge cases:**
```
❌ Tie (equal votes) → Should handle (pick random or tie display)
❌ Zero votes either pet → Should handle
❌ Result delayed → Should eventually show
```

---

## Testing Before Deployment

**Week 11 (before public launch):**

### Feature Acceptance

```
For each of 5 features:
  [ ] Feature works in browser
  [ ] Works on mobile (portrait & landscape)
  [ ] Works on desktop
  [ ] No console errors
  [ ] All flows tested (happy path + errors)
  [ ] Performance <2s load
```

### Integration Testing

```
[ ] Upload pet → See in duel ✅
[ ] Vote on pet → Counter updates ✅
[ ] Share link → Friend receives & votes ✅
[ ] Email capture → Can login ✅
[ ] Result shows → Winner determined ✅
```

### Performance Testing

**Check page load times:**
```
1. Open DevTools → Lighthouse
2. Click "Analyze page load"
3. Check scores:
   - Performance: >80
   - Accessibility: >80
   - Best Practices: >80
4. If <80, ask AI to optimize
```

**Check with real network (not localhost):**
```
1. Deploy to Vercel (git push)
2. Open production URL
3. Check performance (might be slower than localhost)
4. Test voting on slow network (throttle in DevTools)
```

### Security Quick Check

```
[ ] No API keys visible in Network tab
[ ] HTTPS enforced (URL shows 🔒)
[ ] Cookies marked httpOnly (can't be stolen by JS)
[ ] Input validation works (test with bad data)
[ ] Rate limiting works (try voting 10x quickly)
```

### Monitoring Setup

```
[ ] Sentry connected (error tracking)
[ ] PostHog connected (analytics)
[ ] Can see errors in dashboard
[ ] Can see user actions in dashboard
```

---

## When Tests Fail

**Error in console:**
```
Report to AI with:
1. Exact error message
2. What you were doing
3. Browser/device
4. Screenshot or DevTools Network tab
```

**Example:**
```
"Error: Cannot read property 'duelId' of undefined"
Occurred when: Clicked vote button on /duel/123
Browser: Chrome on iPhone SE
```

**API returning 400:**
```
Check Network tab → Click request → Response tab
See what the error message says
Report exact message to AI
```

---

## Automated Testing (For Later)

**For V2 only:**
- Unit tests (Jest)
- Component tests (React Testing Library)
- E2E tests (Cypress or Playwright)
- Load testing (k6)

For MVP, manual testing is fast enough.

---

## Testing Checklist (Pre-Launch)

**Week 12:**

```
Database:
  [ ] All tables created
  [ ] Sample data inserted (50-100 pets)
  [ ] Indexes working
  
Features:
  [ ] Feature 1: Upload works
  [ ] Feature 2: Vote works
  [ ] Feature 3: Share works
  [ ] Feature 4: Marcador works
  [ ] Feature 5: Result works
  
Frontend:
  [ ] Responsive (mobile + desktop)
  [ ] <2s load time
  [ ] No console errors
  [ ] Images optimized
  
Backend:
  [ ] All API endpoints respond
  [ ] Database queries correct
  [ ] Realtime working
  [ ] Error handling present
  
Deployment:
  [ ] Vercel build succeeds
  [ ] Production URL works
  [ ] Environment variables set
  [ ] Monitoring configured
  
Security:
  [ ] No secrets in code
  [ ] HTTPS enforced
  [ ] Input validated
  [ ] Rate limiting active
  
Analytics:
  [ ] Sentry connected
  [ ] PostHog connected
  [ ] Can see errors
  [ ] Can see user actions
```

**All checkmarks = Ready to launch**
