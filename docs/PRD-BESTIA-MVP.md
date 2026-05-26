# BESTIA — Product Requirements Document (MVP)

**Status:** Ready for Development  
**Version:** 1.0  
**Created:** 26 de mayo de 2026  
**Target Launch:** Agosto 2026 (3 meses)  
**Budget:** USD 500  

---

## 1. Product Overview

### Name & Tagline

**BESTIA** — *"La única competencia donde tu mascota puede ganar por ser la más rara"*

### One-Line Description

App de torneos semanales de mascotas donde cualquier gato, perro o mascota puede competir y ganar, con categorías votadas por la comunidad y un loop viral incorporado en el DNA del producto.

### Product Vision

Canalizar la energía obsesiva que la gente ya tiene por compartir fotos de sus mascotas (hoy dispersa en Instagram, WhatsApp, TikTok) en una experiencia competitiva, estructurada y con propósito. Convertir cada usuario en el canal de distribución de la app.

### Core Philosophy

**V1 valida que la gente juega. V2 monetiza que la gente está enganchada.**

No construimos monetización ni features complejas antes de validar PMF (Product-Market Fit).

---

## 2. Target Users

### Primary Persona: "La Dueña Obsesiva"

- **Demographics:** Mujer, 25-40 años, urbana, clase media
- **Behavior:** 
  - Ya postea fotos de su mascota en Instagram 3-4 veces por semana
  - Tiene 1-2 grupos de WhatsApp dedicados a "fotos de la mascota"
  - Ve TikTok diariamente
  - Manda links de cosas a su familia sin pensarlo
- **Pain Point:** Sus fotos no tienen contexto, no hay competencia, no hay razón para que alguien vote por su mascota vs. otra
- **What She Wants:** Un lugar donde su mascota sea "especial" de verdad, donde pueda ganar, donde su acción (compartir) tenga impacto

### Secondary Persona: "El Amplificador"

- **Demographics:** Hombre, 35-55 años, padre de familia
- **Behavior:** 
  - No usa redes activamente
  - Vota si alguien (su hija/hijo) le pide "papá vota por Copito"
  - Comparte el link con compañeros de trabajo si se lo piden
- **Value:** Expande el reach viral sin generar contenido. Crítico para el crecimiento

### Tertiary Persona: "El Competitivo"

- **Demographics:** Cualquier edad/género que sea obsesionado con ganar
- **Behavior:** 
  - Pierde 3 semifinales y quiere pagar para que su mascota gane
  - Propone categorías creativas y quiere que su idea gane la votación
  - Vuelve a la app múltiples veces al día a ver el marcador
- **Value:** Monetización (5% de usuarios, 80% de ingresos). No es el focus en V1 pero se considera para V2

---

## 3. Problem Statement

### The Problem

**Current State:**
- La gente postea mascotas sin propósito: Instagram (espera likes anónimos), WhatsApp (grupo privado), TikTok (algoritmo impredecible)
- No hay competencia real, no hay marcador, no hay razón para movilizar tu red
- El tiempo que inviertes en compartir no tiene recompensa medible

**Why It Matters:**
- Hay 470+ millones de mascotas en el mundo
- 67% de hogares globales tienen mascotas
- Pet care apps market crece 15-18% CAGR
- La gente YA hace todo lo que pide BESTIA, solo le falta el juego

### Our Solution

Crear una plataforma donde:
1. Tu mascota compite contra otras mascotas reales en duelos tipo Tinder
2. Los votos llegan en 24 horas (marcador en vivo)
3. Compartir el link es tan fácil como un botón
4. Ganar es posible para CUALQUIER mascota, no solo las más lindas

**Key Insight:** No creamos un comportamiento nuevo. Canalizamos uno existente con estructura y competencia.

---

## 4. User Journey

### The Discovery Flow

```
1. [Trigger]
   Usuario recibe link de WhatsApp: "Vota por Manchas"
   → Click → Llega a duelo sin descargar nada

2. [First Experience - 10 segundos]
   Ve dos mascotas: foto A vs. foto B
   → Swipe o click para votar
   → "¡Votaste! Resultado en 24h"
   → Opción: "¿Tienes mascota? Súbela acá"

3. [Micro-Conversion]
   Si dice "sí": Email o login rápido con Google
   → Upload foto mascota
   → Entra automáticamente a torneo
   
4. [First Aha Moment - 2 minutos después]
   Su mascota ya está compitiendo
   → Ve votos en vivo
   → Botón "Compartir" para hacer campaña
   
5. [Loop Begins]
   Manda link a familia/amigos
   → Ellos votan
   → Vuelve a ver marcador
   → Si gana = orgullo absurdo, postea screenshot
   → Si pierde = entra a torneo de consolación (no te vas triste)
```

### The Hooked User

```
[Usuario obsesionado, Día 1-3]
- Abre app 6+ veces al día a ver votos
- Hace campaña agresiva (WhatsApp, Instagram, TikTok)
- Cubre cada ronda del duelo

[Usuario obsesionado, Semana 1]
- Su mascota ganó una ronda → trofeo digital
- Propone idea para categoría semanal
- Invita a 3 amigos ("hay que votar por mi gato")

[Usuario obsesionado, Mes 1]
- Su mascota es campeona → compra foto en polera/taza
- Vuelve semanas después a mostrar trofeo a alguien nuevo
- Propone boosts pagados para siguiente torneo
```

---

## 5. MVP Features

### Feature 1: Upload Mascota & Sistema de Duelos

**Description:**
Usuario sube foto de mascota, nombre y especie. Sistema de emparejamiento automático lo coloca contra otra mascota aleatoria. Duelo dura 24 horas (estándar, varía en futuro).

**User Stories:**
- Como dueña, quiero subir una foto en <2 minutos para que mi mascota compita sin fricción
- Como votante, quiero ver dos mascotas lado a lado para votar rápidamente (Tinder-like)
- Como sistema, necesito emparejar mascotas automáticamente para no sobrecargar moderación

**Acceptance Criteria:**
- Upload debe funcionar en móvil y desktop
- Foto se optimiza automáticamente (compresión, resize)
- Emparejamiento es pseudo-aleatorio (balanceo mínimo: no enfrenta dos mascotas en el mismo duelo)
- Máximo 5MB por foto
- Formatos: JPG, PNG, WebP

**Success Metrics:**
- 1000 mascotas subidas en mes 1
- Tiempo promedio de upload <2 minutos
- 0 crashes relacionados con imágenes

**Out of Scope (V2):**
- Video (requiere más storage)
- Múltiples fotos por mascota
- Edición de fotos in-app

---

### Feature 2: Votación Sin Registro + Captura de Email + Auto-Login

**Description:**
Cualquiera puede votar sin crear cuenta (1 voto por IP+dispositivo para prevenir fraude). Después del voto, aparece modal: "¿Tienes mascota? Ingresa tu email para subirla". Si ingresa email válido, sistema crea usuario automáticamente con password temporal, lo loguea, y lo redirige a pantalla de upload. Flujo completo: vota → email → logueado → sube mascota. Todo en <2 minutos.

**User Journey:**

```
[Pantalla de Votación]
  Usuario ve: Foto A vs Foto B
  Click: Vote A
  
  ↓
  
[Post-Voto: Modal de Captura]
  "✅ ¡Tu voto contó!"
  Marcador: "Mascota A: 234 vs Mascota B: 198"
  
  "¿Tienes mascota también?"
  [Input: tu@email.com]
  [Botón: Sí, súbela] [Botón: Quizás después]
  
[Si hace clic "Sí, súbela"]
  1. Sistema valida email
  2. Crea usuario en Supabase Auth
     - Email: tu@email.com
     - Password: 16-char random temporal (a3f9d8e2b1c4f6a9)
  3. Auto-login (Supabase session activo)
  4. Envía email de confirmación:
     "Tu cuenta BESTIA fue creada. Si no fuiste tú, ignora."
  5. Redirige a /upload
  
[Pantalla de Upload]
  Usuario está logueado
  Sube foto de mascota
  ¡Mascota está compitiendo!
  
[Próximo login]
  Usuario debe resetear password permanente
  Email: "Completa tu perfil: establece contraseña"
```

**User Stories:**
- Como votante, quiero votar sin crear cuenta para acceder rápidamente
- Como votante, después de votar quiero poder registrarme en 1 click si tengo mascota
- Como dueña, quiero que nuevos usuarios se registren directamente después de votar para maximizar conversión
- Como sistema, necesito auto-crear cuenta con password temporal para flujo frictionless
- Como sistema, necesito prevenir votos falsos: 1 voto por IP+dispositivo por duelo

**Acceptance Criteria:**
- ✅ No requiere registro para votar
- ✅ Votación es anónima pero rastreable por IP+deviceFingerprint
- ✅ Máximo 1 voto por IP + dispositivo por duelo
- ✅ Post-voto: modal "¿Tienes mascota?"
- ✅ Email input con validación básica (regex)
- ✅ Auto-crear usuario con Supabase Auth
- ✅ Auto-login después de crear cuenta
- ✅ Redirect a /upload automático
- ✅ Email de confirmación enviado
- ✅ Password temporal (16 chars aleatorio)
- ✅ Usuario debe resetear password en primer login
- ✅ Botón "Quizás después" cierra modal sin capturar email
- ✅ Deep link funciona en WhatsApp, SMS, Telegram, Instagram DM
- ✅ Email capture es completamente opcional

**Success Metrics:**
- 70%+ de votantes son no-registrados (votan sin cuenta)
- 30%+ de votantes no-registrados se convierten a usuarios registrados
- <2 minutos promedio: vota → email → upload → mascota compitiendo
- 0 problemas de fraude de votos reportados
- Email inbox delivery rate >95%

**Technical Implementation:**

1. **Frontend (React Component):**
   ```javascript
   // VoteResultModal.jsx
   - Display vote result + live scoreboard
   - Show email input
   - Call /api/capture-email on submit
   - Redirect to /upload on success
   ```

2. **Backend (API Endpoint):**
   ```javascript
   // POST /api/capture-email
   - Validate email format
   - Generate temporary 16-char password
   - Create user via Supabase Auth
   - Send confirmation email
   - Return auth token for auto-login
   ```

3. **Email Template:**
   ```
   Subject: Tu cuenta BESTIA fue creada
   
   Hola [Email],
   
   Tu cuenta fue creada exitosamente.
   Si NO fuiste tú, ignora este email.
   
   [Button] Completa tu perfil
   [Link] Resetea tu contraseña
   ```

4. **Security Measures:**
   - Password: 16 random chars (a3f9d8e2b1c4f6a9)
   - Session: Set-Cookie httpOnly, Secure, SameSite=Strict
   - Email validation: Simple regex + verification email
   - Rate limit: Max 5 account creations per IP per hour
   - Fraud detection: Check duplicate email, suspicious patterns

**Out of Scope (V2):**
- Magic links (email verification link-based auth)
- Autenticación social avanzada (Apple Sign-In)
- Two-factor authentication
- Análisis de fraude ML
- Captcha sofisticado
- Single Sign-On (SSO)

---

### Feature 3: Link Compartible del Duelo

**Description:**
Botón visible que genera link único del duelo actual. Un click lleva a WhatsApp/SMS/Telegram con pretext llenado: "Vota por [Nombre Mascota]".

**User Stories:**
- Como dueña, quiero compartir el link de mi duelo con un clic para hacer campaña sin copiar/pegar
- Como desarrollador, necesito que el link funcione en cualquier app (WhatsApp, Telegram, SMS, email)
- Como sistema, necesito trackear cuántos clicks viene de cada link

**Acceptance Criteria:**
- Botón "Compartir" visible en pantalla de duelo
- Link directo al duelo específico (deep link)
- Genera URL acortado (bitly o similar)
- Prefill para WhatsApp: "Vota por [Mascota], está en duelo con [Otra]" 
- Contador de clicks en tiempo real
- Funciona en móvil y desktop

**Success Metrics:**
- 40%+ de usuarios hacen clic en "Compartir"
- 25%+ de votos vienen de links compartidos
- Link no está roto en ninguna plataforma

**Out of Scope (V1):**
- Personalizador de mensajes de campaña
- Gamification avanzada (badges for sharing)
- Influencer integrations

---

### Feature 4: Marcador en Tiempo Real

**Description:**
Pantalla en vivo que muestra votos actuales: "Manchas: 234 votos vs. Copito: 198 votos". Actualiza cada 5-10 segundos sin refresco manual.

**User Stories:**
- Como dueña, quiero ver los votos en vivo para saber si estoy ganando y hacer más campaña si estoy perdiendo
- Como votante, quiero ver el marcador actual para votar por la mascota que está perdiendo (efecto underdog)
- Como sistema, necesito WebSocket o Firebase Realtime para updates sin polling

**Acceptance Criteria:**
- Votos actualizan automáticamente cada 5-10 segundos
- No requiere refresh manual
- Muestra votos en tiempo real (número exacto, no estimado)
- UI responsiva (móvil y desktop)
- Funciona con 10K+ usuarios simultáneos sin lag

**Success Metrics:**
- 95%+ uptime de marcador en vivo
- <500ms latencia entre voto y visualización
- 0 desincronización de números

**Technical Implementation:**
- Firebase Realtime Database listeners
- Alternativa: Supabase Realtime (recomendado, ver sección técnica)

**Out of Scope (V1):**
- Gráficos animados
- Predicciones de ganador
- Histórico de votos por hora

---

### Feature 5: Resultado & Bracket

**Description:**
Al terminar el duelo (24h), mostrar ganador, perdedor y siguiente ronda. Si ganas avanzas; si pierdes entras a "torneo de consolación" (no es castigo, es juego paralelo).

**User Stories:**
- Como ganadora, quiero saber que mi mascota avanzó a la siguiente ronda
- Como perdedora, quiero poder seguir compitiendo en un torneo de consolación para no irme triste
- Como sistema, necesito trackear toda la bracket para mostrar histórico

**Acceptance Criteria:**
- Resultado se muestra automáticamente 24h después del inicio
- Ganador avanza a siguiente ronda (sino existe, se corona campeón de la semana)
- Perdedor entra a torneo de consolación con premios separados
- Nombre del ganador aparece en lugar público: "Manchas ganó: La Más Fea de la Semana (26 de mayo)"
- Ganador puede tomar screenshot y compartir trofeo digital
- Histórico de campeones visible en app

**Success Metrics:**
- 100% de duelos tienen resultado claro
- 80%+ de perdedores participan en consolación
- Trofeo del campeón es compartido 40%+ de las veces

**Out of Scope (V1):**
- Merchandise automático para campeones
- Premios en dinero
- Suscripción para bypass consolation

---

## 6. Success Metrics & KPIs

### Launch Targets (Month 1)

| Metric | Target | Why |
|--------|--------|-----|
| **Total Users** | 1,000 | Masa crítica mínima para que duelos sean reales |
| **Completed Duels** | 500 | Cada usuario participa en ~1 duelo si adopción es buena |
| **Proposed Categories** | 5+ | Demanda de diferenciación |
| **Share Click Rate** | 40%+ | Qué tan viral es el loop |
| **Vote-to-Registration Ratio** | 30%+ | Conversion de votante → usuario |

### Ongoing Engagement (Weeks 2-12)

| Metric | Target | Interpretation |
|--------|--------|-----------------|
| **Daily Active Users (DAU)** | 20%+ of MAU | Qué tan enganchante es el loop |
| **Sharing Rate** | 40%+ of active users | Si el viral loop funciona |
| **Category Proposals/Week** | 5+ | Interest en co-creation |
| **Retention Day 7** | 40%+ | Si la app es adictiva |
| **Retention Day 30** | 15%+ | Si hay reason to return |

### User Satisfaction

| Metric | Method | Target |
|--------|--------|--------|
| **NPS (Net Promoter Score)** | In-app survey | 40+ |
| **Reported Fraud Rate** | Support tickets | <0.5% |
| **Moderation Complaints** | Support tickets | <2 per 100 posts |

### Business Metrics (Informational, not V1 focus)

| Metric | Note |
|--------|------|
| **Signup Conversion Cost** | Should trend toward $0 (organic viral) |
| **User Acquisition Cost** | Should stay <$0.50 or we're doing it wrong |

---

## 7. Design Direction

### Visual Identity

**Vibe:** Divertido, irreverente, casual

**Color Palette:**
- Primary: Colores vibrantes (naranja, rosa, púrpura) — para evocar "mascotas son raras y coloridas"
- Neutral: Grises claros para texto, fondo limpio
- Accent: Amarillo para ganadores/éxito

**Typography:**
- Headings: Sans-serif bold (Poppins, Inter)
- Body: Sans-serif regular (Inter, Roboto)
- Tone: Casual, fun, sin ser infantil

**Imagery:**
- Las fotos de mascotas son la estrella
- Ícones playful (patas, huesos, juguetes)
- Animaciones sutiles (no overwhelming)

### Key Screens

1. **Landing Page**
   - Foto de mascota "rara" (gato dormido boca arriba, perro con cara tonta)
   - Tagline: "La única competencia donde tu mascota puede ganar por ser la más rara"
   - Botón: "Vota por tu favorita" → Link a duelo demo

2. **Duelo (Main Screen)**
   - Dos mascotas lado a lado
   - Foto A | Foto B
   - Timer: "XX horas restantes"
   - Botones: Vote A / Vote B
   - Marcador: Votos en vivo

3. **Share Modal**
   - Botón grande "COMPARTIR"
   - Dropdown: WhatsApp / SMS / Telegram / Copiar Link
   - Preview: "Vota por [Mascota]"

4. **Resultado**
   - ✅ ¡GANADOR! [Mascota]
   - Trofeo visual
   - Share button
   - Siguiente ronda (si aplica)

5. **Upload**
   - Drag & drop foto
   - Input: Nombre, especie
   - Preview antes de submit

### Responsive Design

- ✅ Mobile first (80%+ traffic)
- ✅ Funciona en 375px (iPhone SE) hasta 1920px (desktop)
- ✅ Touch targets: mínimo 44x44px
- ✅ Readable sin zoom en cualquier tamaño

---

## 8. Technical Considerations

### Technology Stack (Recommended)

```
Frontend:
  - Framework: Next.js 14+ (React)
  - Styling: TailwindCSS
  - State: React Hooks + Context API (o Zustand si es simple)
  - HTTP Client: fetch / axios

Backend & Services:
  - BaaS: Supabase (not Firebase)
    ├─ Auth: Supabase Auth (Google, Apple, Email)
    ├─ Database: PostgreSQL (via Supabase)
    ├─ Storage: Supabase Storage (for images)
    └─ Realtime: Supabase Realtime (for live vote count)
  
  - Email: Resend or SendGrid (free tier)
  - Analytics: PostHog (free tier)
  - Monitoring: Sentry (free tier)

Infrastructure:
  - Hosting: Vercel (for Next.js)
  - Domain: .com o .app (wherever is cheaper)
  - CDN: Vercel includes
```

### Why Supabase Instead of Firebase?

| Feature | Supabase | Firebase |
|---------|----------|----------|
| **Auth** | Google, Apple, Email ✅ | Same ✅ |
| **Database** | PostgreSQL + API ✅ | Firestore (locked-in) ⚠️ |
| **Storage** | S3-compatible ✅ | Firebase Storage ✅ |
| **Realtime** | WebSocket-based ✅ | Slower on scale ⚠️ |
| **Cost at Scale** | PostgreSQL standard ✅ | Can get expensive ⚠️ |
| **SQL Queries** | Native SQL ✅ | Limited query lang ⚠️ |
| **Export Data** | Easy (PostgreSQL dump) ✅ | Harder (vendor lock) ⚠️ |

**Verdict:** Supabase = More control, better pricing, PostgreSQL power, easier to migrate later.

### Performance Requirements

| Metric | Target | How |
|--------|--------|-----|
| **Page Load** | <2s on 4G | Vercel CDN, image optimization |
| **Vote Submit** | <500ms | Optimistic UI + async DB write |
| **Live Vote Update** | <5s | Supabase Realtime listeners |
| **Scalability** | 10K+ concurrent | Supabase can handle it |

### Security & Compliance

- **Data:** All data encrypted at rest (Supabase default)
- **HTTPS:** Enforced (Vercel default)
- **Image Validation:** Server-side check for valid image
- **Rate Limiting:** Max 1 vote per IP+device per duel
- **GDPR/CCPA:** Privacy policy + data deletion on request
- **Moderation:** Manual review first 3 months, then ML if needed

### Constraints

- **No Video in V1:** Storage costs would be prohibitive. Photo only.
- **No App Native in V1:** Web responsive + PWA notification support sufficient
- **No Complex Backend:** Supabase BaaS keeps it simple
- **No ML at Start:** Manual moderation, human-in-the-loop

---

## 9. Launch Constraints

### Timeline

```
Week 1-2:  Design + Setup (Supabase, Vercel, Next.js skeleton)
Week 3-4:  Core Features (Upload, Duels, Voting)
Week 5-6:  Realtime Voting + Sharing
Week 7-8:  Polish, Bug Fixes, Beta Testing
Week 9-12: Soft Launch → Public Launch
```

### Budget Allocation (USD 500 Total)

```
Infrastructure (3 months):        USD 0-50
  - Supabase: Free tier
  - Vercel: Free tier
  - Domain: ~$12
  - Email: Free tier
  
Design & Mockups:                 USD 100-150
  - UI design + components
  - Asset creation (ícones, illustrations)
  
Development Support (if needed):  USD 100-200
  - Freelancer help if stuck
  - Code review

Beta Testing & Launch:            USD 50-100
  - Small ad spend to validate
  - Tools for monitoring

Buffer (contingency):             USD 100-150
```

### Pre-Launch Checklist

Critical before public launch:

- [ ] 50-100 mascotas subidas (from friends/family)
- [ ] All 5 core features functional and tested
- [ ] Moderation system ready (button + manual queue)
- [ ] Rate limiting working (no vote fraud possible)
- [ ] Analytics setup (PostHog, Sentry)
- [ ] Privacy policy + Terms of Service
- [ ] Email templates ready (confirmation, reset, etc.)
- [ ] Deep links tested in WhatsApp, SMS, Telegram
- [ ] Mobile + Desktop responsive tested
- [ ] Load test: simulate 1K users

### Go/No-Go Decision (Week 8)

Before launching publicly, assess:

1. **Functionality:** Are all 5 features working without crashes?
2. **Performance:** Does the app feel fast (<2s load)?
3. **Beta Feedback:** Are beta testers using it daily?
4. **Moderation:** Can you handle 1-2 reports per day?
5. **Growth:** Do people share links organically?

If YES to all 5 → Launch  
If NO to any → Fix before launch

---

## 10. Definition of Done (MVP Complete)

### Feature Complete ✅

- [x] User can upload mascota (photo, name, species)
- [x] System pairs mascotas automatically
- [x] User can vote without registration
- [x] System prevents vote fraud (1 vote per IP+device)
- [x] Votante sees prompt to register post-vote ("Have a pet? Upload it")
- [x] Share link is one-click and works in WhatsApp/SMS/Telegram
- [x] Live vote counter updates real-time
- [x] Result shows 24h later with winner and next round
- [x] Consolation bracket for losers
- [x] Champion name is permanently displayed and shareable

### Technical Complete ✅

- [x] Deployed on Vercel
- [x] Database on Supabase
- [x] All auth flows working (Google, Email)
- [x] Image storage and optimization working
- [x] Realtime listeners functional
- [x] Rate limiting active
- [x] Monitoring + alerts (Sentry)
- [x] Analytics installed (PostHog)

### Quality Complete ✅

- [x] No crashes on 1K concurrent users (load tested)
- [x] Page load <2s on 4G
- [x] Mobile responsive (tested on iPhone SE, iPhone 14 Pro, Android)
- [x] Desktop responsive (tested on 1920px, 1366px)
- [x] Accessibility: Images have alt text, buttons are labeled
- [x] All reported bugs fixed
- [x] 0 vote fraud incidents in beta

### Content Complete ✅

- [x] Privacy policy written and live
- [x] Terms of Service written and live
- [x] Email templates for signup, password reset
- [x] Landing page with clear value prop
- [x] In-app help/FAQ for first-time users
- [x] Moderation guidelines documented

### Pre-Launch Complete ✅

- [x] 50-100 mascotas seeded from beta users
- [x] Analytics dashboard set up
- [x] Monitoring alerts configured
- [x] Support email ready
- [x] Social media accounts created (Instagram, TikTok, Twitter)
- [x] Press/outreach list for soft launch
- [x] Rollback plan documented

---

## Appendix: What's NOT in V1

### Intentionally Deferred to V2

| Feature | Why Not V1 | When V2 |
|---------|-----------|---------|
| **Video Support** | Storage costs + infrastructure | When revenue covers costs |
| **Categoria Votadas** | Needs 5K+ users for voting to matter | Month 4+ |
| **Boosts Pagados** | Charge only after PMF validation | Month 3+ |
| **App Nativa** | Takes 6+ weeks for App Store review | Post-50K users |
| **Push Notifications** | Requires app nativa | V2 |
| **Merchandise** | Requires Printful integration + logistics | Month 6+ |
| **Sponsorships** | Requires brand partnerships | Post-10K users |
| **Categorias Fijas** | Don't need until user-voted ones exist | V2 |

### Why This Scope is Right

- ✅ Launchable in 3 months with 1-2 people
- ✅ Validates core hypothesis: people want to compete
- ✅ Generates viral loop without paid acquisition
- ✅ Leaves room for V2 innovations (categorías votadas)
- ✅ Keeps budget realistic (USD 500)
- ✅ No technical debt from over-engineering

---

## Questions & Decisions Log

### Q1: Why Supabase over Firebase?
**A:** PostgreSQL gives us power to scale, better pricing at scale, easier to migrate later. Firebase works but locks us in.

### Q2: What about App store review delays?
**A:** Web-first means no app store. Users click link, vote, done. App native comes in V2 when we have resources.

### Q3: How do we prevent vote fraud?
**A:** 1 vote per IP + device per duel. Not perfect but sufficient for MVP. ML moderation comes later if needed.

### Q4: What if no one seeds mascotas at launch?
**A:** Pre-launch, gather 50-100 from friends/family/groups. Solves cold-start problem. Critical before public launch.

### Q5: Why not start with video?
**A:** Video = 10x storage cost + complex transcoding. Photo scales cheaply. Video in V2 when revenue exists.

### Q6: How do we acquire the first 1000 users?
**A:** Organic share + word of mouth. Each user is a marketer. No paid ads needed if viral coefficient is good.

### Q7: What if the viral loop doesn't work?
**A:** Fallback: small ad spend (USD 50) to bootstrap, then validate if loop is real. Fail fast, learn fast.

---

## Sign-Off

**Product Owner:** BESTIA Team  
**Technical Lead:** TBD (Developer or CTO)  
**Design Lead:** TBD (Designer)  
**Launch Date:** August 26, 2026 (Target)  

This PRD is a living document. Update as you learn from beta testing.

**Next Step:** Run `/vibe-techdesign` to create the Technical Design Document with system architecture, database schema, and implementation details.
