# BESTIA — Investigación de Validación

**Proyecto:** Torneo de mascotas competitivo con categorías votadas por usuarios  
**Investigación completada:** 26 de mayo de 2026  
**Timeline a lanzamiento:** 3 meses  
**Budget:** USD 500

---

## 1. Análisis de Mercado

### Tamaño del Mercado

El mercado de **Pet Care Apps** está en expansión acelerada:

- **Global:** USD 3.5B en 2025, creciendo a **15-18% CAGR** hasta 2035
- **EE.UU.:** USD 868M en 2025
- **Proyección 2035:** USD 10.5B

**Indicador clave:** 65%+ de usuarios móviles activos participan en juegos sociales casuales. Tu audience existe y está lista.

### Competencia

**Pet Parade** ([parade.pet](https://www.parade.pet/))
- ✅ Torneos de mascotas con duelos tipo Tinder
- ✅ 128 participantes por torneo, rewards en gift cards
- ❌ Categorías fijas ("más lindo")
- ❌ Sin loop viral incorporado
- ❌ Entrada de USD 5.99 por torneo (fricción)
- **Estado:** Activo, funciona, pero estancado en innovation

**America's Favorite Pet** ([americasfavpet.com](https://americasfavpet.com/))
- ✅ Modelo viral probado: $1 = 1 voto (generó USD 8.9M en 2024)
- ❌ Evento anual, no app continua
- ❌ Orientado a recaudación para refugios
- **Estado:** Funciona bien pero no es tu competencia directa

**Redes Sociales (Instagram, TikTok, WhatsApp)**
- Donde la gente postea hoy: sin estructura, sin competencia real, sin razón para movilizar red
- **Tu ventaja:** Canalizas esa energía existente con estructura competitiva

### Conclusión de Mercado

✅ **Mercado validado:** Pet care apps crecen 15-18% CAGR  
✅ **Audiencia existe:** 65%+ de usuarios móviles juegan juegos sociales casuales  
✅ **Gap identificado:** No existe app con categorías votadas + loop viral  
✅ **Dinero probado:** America's Favorite Pet movió USD 8.9M en un año

**Tu posición:** Eres el único que ofrece "ganar siendo rara" como valor central. Eso democratiza completamente el juego vs. "más linda".

---

## 2. Recomendaciones Técnicas

### Arquitectura Recomendada para MVP

**Stack propuesto:**

```
Frontend: Next.js + React + TailwindCSS
Backend:  Firebase Realtime Database (para votación en vivo)
Auth:     Firebase Authentication (Google, Apple, Email)
Storage:  Firebase Cloud Storage (fotos/videos)
```

**Por qué esta combinación:**

1. **Next.js:** Desarrollo rápido, full-stack, deploy directo a Vercel sin DevOps
2. **Firebase:** No necesitas backend dedicado, escalable sin pensar en infraestructura
3. **Realtime Database:** Actualizaciones de votación en vivo sin arquitectura WebSocket compleja
4. **Storage:** Fotos/videos alojados sin costo inicial significativo

### Alternativas Consideradas

| Opción | Ventajas | Desventajas |
|--------|----------|------------|
| **Next.js + Firebase** (recomendado) | Rápido, sin DevOps, escalable, free tier generoso | Firebase más caro si creces mucho |
| **Remix + Serverless** | Más control, mejor para funciones complejas | Más setup, menos "batteries included" |
| **Django/Flask + PostgreSQL** | Poderoso, flexible | Requiere servidor, más DevOps, más lento para iterar |

### Arquitectura Real-Time

Para el **marcador en vivo** (una de tus 3 features críticas):

- **Firebase Realtime Database:** Permite que N usuarios vean el votaje actualizarse en segundos sin polling
- **Alternativa:** [WebSockets + Node.js/Express] — más complejo, no recomendado para MVP
- **Benchmark:** Firebase soporta miles de clientes simultáneos sin problema

### Responsive Web First

Tu app debe funcionar perfectamente en:
- ✅ iPhone (donde se suben fotos)
- ✅ Android (donde se comparte links)
- ✅ Desktop (computadora del trabajo donde se vota a las 3pm)
- ✅ Tablets (abuelas votando)

**No necesitas app nativa en v1.** Un PWA (Progressive Web App) con Next.js basta para notificaciones.

---

## 3. Herramientas Recomendadas y Costos (USD/mes)

### Hosting & Frontend

| Tool | Costo | Notas |
|------|-------|-------|
| **Vercel** (Next.js hosting) | **$0** (free tier) | Includes 100GB bandwidth free/mes. Suficiente para v1 |
| **Vercel Pro** (si necesitas analytics) | **$20** | Recomendado después de lanzar |
| **Domain** (.com, .app) | **$12/año** | ~$1/mes |

### Backend & Database

| Tool | Costo | Notas |
|------|-------|-------|
| **Firebase Spark Plan** (free) | **$0** | 10GB storage, 360MB/day egress, 50k reads/day - SUFICIENTE para MVP |
| **Firebase Blaze Plan** (si creces) | **Pay as you go** | ~$0.06 por 100k reads |

### Servicios Auxiliares

| Tool | Costo | Notas |
|------|-------|-------|
| **Email (Sendgrid/Resend)** | **$0-$20** | Notificaciones, 100 emails/día free |
| **Analytics (Posthog/Mixpanel)** | **$0** | Free tier útil para entender uso |
| **Merchandise (Printful API)** | **$0** | Costo por producto, no fee fijo |

### Mes 1-3: Budget Real

```
Dominio:           $1/mes
Vercel Pro:        $0 (free tier)
Firebase Spark:    $0 (free tier)
Email:             $0 (free tier)
Analytics:         $0 (free tier)
Merchandise:       $0 (Printful sin fee fijo)
                   ------
TOTAL:            ~$1/mes en costos fijos
```

**Restante del budget (USD 500):** Puedes invertir en:
- Diseño profesional (UI mockups): USD 100-150
- Freelancer para código inicial si necesitas ayuda: USD 200-300
- Buffer para ads tempranos o boosts pagos: USD 50-100

---

## 4. Priorización MVP

### Qué SÍ incluir en v1 (las 3 features que identificaste)

```
Semana 1-2:   Auth + Upload de mascota
              - Login con Google/Apple
              - Upload foto o video
              - Editar nombre/descripción

Semana 3-4:   Sistema de duelos
              - Aparear mascotas automáticamente
              - Interfaz de votación (Tinder-like)
              - Contador de votos en vivo (Firebase Realtime)

Semana 5-8:   Sharing & Marketing
              - Botón "Compartir link" → WhatsApp/SMS/Telegram
              - Deep link directo al duelo
              - Contador de clicks/comparticiones
```

### Qué NO incluir en v1 (pero documentar para v1.1)

| Feature | Por qué no en v1 | Cuándo agregar |
|---------|------------------|----------------|
| Categorías votadas | Agrega complejidad, menos crítico | Semana 9-10 (v1.1) |
| Merchandise | Requiere integración Printful | Después de validar growth |
| Torneos por ronda | Funciona si haces votación manual | Automatizar después |
| Trofeos digitales | Gamificación adicional | Cuando haya ganadores |
| Ads/Boosts pagados | Monetización, requiere pagos | Después de PMF |

**Filosofía:** Primero el juego. Después el negocio.

---

## 5. Evaluación de Riesgos

### Alto Riesgo

| Riesgo | Impacto | Mitigación |
|--------|--------|-----------|
| **Adopción inicial lenta** | App sin usuarios = sin votantes = sin valor | Lanzar a tu red primero (familia/amigos), pedir invites |
| **Copyright/Derechos de imagen** | Usuarios suben fotos de mascotas de otros | Terms of Service claro, sistema de reportes, DMCA takedown |
| **Contenido inapropiado** | Usuarios suben cosas no-pet | Moderación manual en v1, ML moderation después |

### Riesgo Medio

| Riesgo | Impacto | Mitigación |
|--------|--------|-----------|
| **Perder competidores** | Pet Parade agrega categorías | Ya tienes 3 meses de ventaja, velocity importa más |
| **Monetización lenta** | Budget runs out antes de PMF | Presupuesto de marketing mínimo, focus en growth viral |
| **Data privacy (GDPR/CCPA)** | Multas si guardas datos mal | Usar Firebase (compliant), privacy policy clara desde día 1 |

### Bajo Riesgo

| Riesgo | Impacto | Mitigación |
|--------|--------|-----------|
| **Bugs en votación** | Algunos votos no cuentan | Testing exhaustivo, Firebase es confiable |
| **Server down** | App no funciona | Vercel + Firebase son 99.9% uptime, monitoring |

---

## 6. Estimación de Costos

### Desarrollo (horas estimadas)

| Tarea | Horas | Notas |
|-------|-------|-------|
| Setup proyecto (Next.js + Firebase) | 2 | Boilerplate |
| Auth (Google/Apple/Email) | 3 | Firebase handles it |
| Upload + Storage fotos/videos | 4 | Firebase SDK |
| Lógica de emparejamiento | 4 | Algoritmo simple |
| Votación + Realtime votes | 5 | Firebase Realtime magic |
| UI/UX (responsive) | 8 | TailwindCSS acelera mucho |
| Sharing + Deep links | 3 | Next.js built-in |
| Testing + QA | 4 | Critical para growth |
| Deploy + CI/CD | 2 | Vercel automático |
| **TOTAL** | **35 horas** | Estimado 2-3 semanas a full-time |

### Costo Total (V1)

```
Infraestructura/Hosting:  USD 1/mes × 3 meses = USD 3
Domain:                   USD 12/año (prorrateado) = USD 3
Diseño (opcional):        USD 100-150
Freelance code help:      USD 0 (si lo haces tú) a USD 200 (si contratas)
Buffer:                   USD 50
                          --------
TOTAL:                    USD 150-350 (muy confortable con USD 500)
```

### Margen de Buffer

Tienes **USD 150+** de margen para:
- Herramientas de análisis premium (Mixpanel, Amplitude)
- Ads iniciales tempranos (USD 50-100 para testear)
- Consultorías si necesitas help
- Boosts pagos para prueba de concepto

---

## 7. Próximos Pasos

### Semana 1: Validación + Setup

- [ ] Crea cuenta Vercel y Firebase (gratis)
- [ ] Reserva dominio BESTIA (.com o .app)
- [ ] Dibuja wireframes de las 3 screens críticas (upload, duelo, compartir)
- [ ] Haz lista de 5-10 personas para beta privada (amigos/familia con mascotas)

### Semana 2-3: MVP Core

- [ ] Deploy boilerplate Next.js + Firebase
- [ ] Implementa Auth
- [ ] Implementa Upload + Storage
- [ ] Testa en teléfono

### Semana 4-5: Votación & Sharing

- [ ] Sistema de votación en vivo (Firebase Realtime)
- [ ] Botón de sharing con links
- [ ] Deep links funcionando

### Semana 6-8: Polish + Beta

- [ ] Testa con beta users
- [ ] Fix bugs críticos
- [ ] Prepara landing page simple
- [ ] Documenta categorías para v1.1

### Semana 9+: Lanzamiento Público

- [ ] Tweet/Instagram/TikTok (tu red personal primero)
- [ ] Tracker de analytics
- [ ] Plan para categorías votadas (v1.1)

---

## 8. Conclusión: Por Qué Funciona

### Tu Ventaja Competitiva

1. **"Ganar siendo rara"** — Pet Parade solo tiene "más linda", tú tienes humor
2. **Categorías votadas** — Ninguna app hace esto, creas ownership comunitario
3. **Loop viral perfecto** — El usuario es tu canal de distribución

### Por Qué Ahora

- Mercado de pet apps crece 15-18% CAGR
- Competencia débil (Pet Parade estancado)
- Tecnología lista (Firebase, Next.js, Vercel)
- Audiencia activa (65%+ de móvil juegan juegos sociales)
- Budget suficiente (USD 500 covers everything)

### El Tagline Que Lo Vende

> **"La única competencia donde tu mascota puede ganar por ser la más rara."**

Eso lo entiende cualquiera en 2 segundos. Y se lo pasa a alguien antes de cerrar el teléfono.

---

## Fuentes y Referencias

- [Pet Parade App](https://apps.apple.com/us/app/pet-parade/id1144089495)
- [America's Favorite Pet 2024 Revenue Report](https://colossal.org/americasfavoritepet)
- [Pet Care Apps Market Analysis 2025](https://www.thebusinessresearchcompany.com/report/digital-pet-care-products-and-services-global-market-report)
- [Social Gaming Market 2024-2030](https://www.mordorintelligence.com/industry-reports/social-gaming-market)
- [Next.js vs Alternatives 2025](https://medium.com/@sovannaro/top-15-alternatives-to-next-js-in-2026-and-when-to-use-them-66577ddab319)
- [Real-time Voting with Firebase](https://dev.to/wasp/build-a-real-time-voting-app-with-websockets-react-typescript-3oof)
- [Vercel vs Firebase Pricing 2025](https://uibakery.io/blog/vercel-vs-firebase)
- [Printful API Integration](https://www.printful.com/api)
- [Print on Demand 2025](https://dynamicmockups.com/tools/printful-vs-teespring/)

---

**Documento generado para:** BESTIA MVP Research  
**Status:** Listo para pasar a PRD  
**Siguiente paso:** Ejecuta `/vibe-prd` para crear tu Product Requirements Document
