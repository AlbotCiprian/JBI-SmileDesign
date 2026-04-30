# reCAPTCHA Enterprise — finalizare setup backend

Site key-ul (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) e deja activ — frontend-ul generează
tokenuri la fiecare submit pe formularul de programare. **Pentru ca verificarea
server-side să funcționeze**, trebuie creat un **Google Cloud API Key** și pus în env.

Status actual în Google Cloud: `Backend: Incomplete` → după pașii de mai jos
devine `Complete` și statisticile încep să apară.

---

## 1. Creează API Key în Google Cloud (3 min)

1. Mergi la [console.cloud.google.com](https://console.cloud.google.com/)
2. Asigură-te că ești pe proiectul **`instastore-480720`** (verifică în selectorul
   sus stânga, lângă logo)
3. Bara de search sus → caută **"Credentials"** → click pe **APIs & Services › Credentials**
4. Sus, click **+ CREATE CREDENTIALS** → **API key**
5. Apare un popup cu cheia ta — **COPIAZĂ-O imediat** (format: `AIzaSy...`)
6. Click **EDIT API KEY** (sau găsește-o în lista din pagină și click pe ea)

---

## 2. Restricționează API Key-ul (3 min) — IMPORTANT pentru securitate

Pe pagina API key-ului:

### A) Application restrictions
- Selectează **None** (deocamdată — backend-ul nostru rulează server-side, nu are referer/IP fix)
- Alternative mai sigure pe viitor: **HTTP referrers** cu domeniile tale, dar pentru
  apeluri server-side din Vercel nu funcționează bine

### B) API restrictions ⚠️ OBLIGATORIU
- Click **Restrict key**
- În dropdown alege EXACT **reCAPTCHA Enterprise API**
- Click **OK** și apoi **SAVE** jos

Astfel API key-ul nu poate fi folosit pentru altceva (ex: dacă cineva îl fură,
nu va putea apela alte API-uri Google și să-ți consume cota).

---

## 3. Adaugă în `.env` local (1 min)

Deschide `.env` (sau `.env.local`) și adaugă/completează:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6LfxFtAsAAAAAHeEJMA9tW-5h929lSa6Csxyw6Zk"
RECAPTCHA_PROJECT_ID="instastore-480720"
RECAPTCHA_API_KEY="AIzaSy..."  ← cheia copiată la pasul 1.5
```

Repornește dev server-ul (`Ctrl+C` și `npm run dev` din nou) ca Next.js să citească env-ul nou.

---

## 4. Adaugă aceeași în Vercel (1 min)

1. [vercel.com/dashboard](https://vercel.com/dashboard) → proiectul **JBI-SmileDesign**
2. **Settings** → **Environment Variables**
3. Adaugă:
   - Name: `RECAPTCHA_API_KEY` → Value: `AIzaSy...` → All environments → **Save**
   - Verifică că `RECAPTCHA_PROJECT_ID` și `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` există deja
4. **Deployments** → ultimul deployment → 3 puncte → **Redeploy** (cu "Use existing Build Cache" debifat)

---

## 5. Testează (~30 sec / 1 trafic)

### Local
1. Deschide `http://localhost:3000` (sau ce port îți zice Next)
2. Scroll la formularul de programare
3. Completează cu date dummy + bifează GDPR
4. Submit
5. În terminalul `npm run dev` NU ar trebui să mai vezi warning-ul `PROJECT_ID / API_KEY / SITE_KEY lipsesc`

### Verifică în Google Cloud (după 5-10 min)
1. [console.cloud.google.com/security/recaptcha](https://console.cloud.google.com/security/recaptcha)
2. Click pe key-ul **JBI SmileDesign DentalClinic**
3. Tab **Overview** → secțiunea **Integration** din dreapta:
   - **Frontend**: ✅ verde (deja era)
   - **Backend**: ✅ verde (după primul submit)
4. **Status** sus: schimbat din `Incomplete` → `Complete`
5. **Scores** chart: începe să afișeze date după ~10-30 min de trafic real

---

## 6. Ce face codul cu tokenul

În [src/lib/recaptcha.ts](../src/lib/recaptcha.ts) `verifyRecaptcha(token)`:

1. POST la `https://recaptchaenterprise.googleapis.com/v1/projects/instastore-480720/assessments?key=API_KEY`
2. Body: `{ event: { token, expectedAction: "appointment", siteKey } }`
3. Răspuns Google → verificăm:
   - `tokenProperties.valid === true` → tokenul e autentic și nu expirat
   - `tokenProperties.action === "appointment"` → previne reuse cross-action
   - `riskAnalysis.score >= 0.4` → user real (1.0 = sigur uman, 0.0 = sigur bot)
4. Dacă oricare verificare cade → API răspunde `403 Verificare anti-spam eșuată`
5. Dacă merge → continuă cu salvarea programării

Pragul `minScore = 0.4` e configurabil în `src/lib/recaptcha.ts`. Recommended:
- 0.5 = balansat (default Google)
- 0.3 = permisiv (laser pe puțini boți)
- 0.7 = strict (poate refuza unii useri legitimi)

---

## Troubleshooting

| Simptom | Cauză | Fix |
|---|---|---|
| `Backend: Incomplete` rămâne | API key nu trimite request-uri | Verifică env la Vercel + redeploy + trimite o programare reală |
| `403 Verificare anti-spam eșuată` la submit normal | Scor prea mic | Coboară `minScore` la 0.3 |
| `HTTP 403 PERMISSION_DENIED` în log | API key restricționat la altă API | Verifică pasul 2.B — trebuie reCAPTCHA Enterprise API |
| `HTTP 400 Invalid argument` | Site key sau token corupt | Verifică `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` și că scriptul Enterprise se încarcă în browser (Network tab → enterprise.js) |
| Cota depășită | Plan Free = 1M assessments/lună | Pentru clinică e mai mult decât suficient |

---

## Costuri

reCAPTCHA Enterprise — **Free tier**:
- 1.000.000 assessments/lună gratis
- Pentru o clinică = ~3-5k programări/an = **mereu gratis**

Atentie: dacă cineva îți DDoS-ează formularul, poți depăși cota. Codul nostru
deja are protecție: dacă apelul Google Cloud cade (timeout, eroare, etc.),
returnează `false` → cererea e respinsă, nu se salvează nimic.
