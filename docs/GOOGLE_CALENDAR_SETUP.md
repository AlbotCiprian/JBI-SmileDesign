# Google Calendar — setup pas cu pas

Acest document explică cum se conectează site-ul JBI Smile Design cu un Google
Calendar real, astfel încât fiecare programare salvată în baza de date să apară
automat ca eveniment în calendarul clinicii.

Codul detectează automat dacă cele 3 variabile de mediu de mai jos sunt setate:
- Setate → sincronizare automată activă (la create/update/delete + buton manual din admin)
- Lipsește vreuna → sincronizare ignorată în siguranță (fără erori), programările
  rămân în Neon și emailul Resend funcționează normal.

---

## 1. Pregătire în Google Cloud Console (~5 min)

1. Mergi la [console.cloud.google.com](https://console.cloud.google.com/)
2. Sus stânga, lângă logo, click pe selectorul de proiect → **NEW PROJECT**
   - Nume: `jbi-smile-design` (sau folosești `instastore-480720` dacă vrei să refolosești)
   - Click **CREATE**
3. Așteaptă 30s să se creeze, apoi selectează-l din nou
4. În bara de search sus, caută **"Google Calendar API"**
5. Click pe rezultat → **ENABLE**

---

## 2. Creare Service Account (~3 min)

1. Stânga jos: **APIs & Services** → **Credentials**
2. Sus: **+ CREATE CREDENTIALS** → **Service account**
3. **Service account name**: `jbi-calendar-sync`
4. **Service account ID**: se completează automat
5. **Description**: `Sincronizează programările JBI Smile Design cu Google Calendar`
6. Click **CREATE AND CONTINUE**
7. **Grant role**: lasă gol (nu e nevoie de roluri IAM, calendarul îi va fi
   distribuit individual la pasul 4)
8. Click **CONTINUE** → **DONE**

---

## 3. Generare cheie JSON (~1 min)

1. În lista Service Accounts, click pe `jbi-calendar-sync@...gserviceaccount.com`
2. Tab **KEYS** → **ADD KEY** → **Create new key**
3. Format: **JSON** → **CREATE**
4. Browserul descarcă un fișier `.json` — **PĂSTREAZĂ-L SECRET**, nu îl pune pe GitHub.

---

## 4. Distribuie calendarul către Service Account (~2 min)

1. Mergi la [calendar.google.com](https://calendar.google.com/)
2. Stânga, sub **My calendars**, găsește calendarul în care vrei programările
   - Recomand să creezi unul nou: hover pe **Other calendars** → **+** →
     **Create new calendar** → nume: `JBI Smile Design — Programări`
3. Hover pe calendarul țintă → 3 puncte → **Settings and sharing**
4. Scroll la **Share with specific people or groups** → **+ Add people and groups**
5. Lipește **emailul service account-ului** (din JSON: câmpul `client_email`,
   format `jbi-calendar-sync@PROJECT_ID.iam.gserviceaccount.com`)
6. Permission: **Make changes to events**
7. Click **Send**
8. Tot pe pagina aceea, scroll la **Integrate calendar** → copiază
   **Calendar ID** (arată ca `xxxxx@group.calendar.google.com` sau email-ul tău
   pentru calendarul primar)

---

## 5. Adaugă în `.env` (sau `.env.local`)

Deschide JSON-ul descărcat. Vei vedea câmpurile `client_email` și `private_key`.

```env
# Email-ul service account-ului (câmpul "client_email" din JSON)
GOOGLE_CLIENT_EMAIL="jbi-calendar-sync@your-project-id.iam.gserviceaccount.com"

# Private key — TOATA cheia ÎNTRE ghilimele duble, păstrează \n literali
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"

# Calendar ID copiat la pasul 4.8
GOOGLE_CALENDAR_ID="xxxxx@group.calendar.google.com"
```

**ATENȚIE la `GOOGLE_PRIVATE_KEY`:**
- Trebuie pus între ghilimele duble (`"..."`)
- Newline-urile rămân ca `\n` literal (NU le înlocui cu enter real)
- Codul nostru face automat `replace(/\\n/g, "\n")` la runtime

---

## 6. Setează aceleași variabile în Vercel

1. Vercel dashboard → proiectul tău → **Settings** → **Environment Variables**
2. Adaugă cele 3 variabile (toate trei la **All environments**)
3. Pentru `GOOGLE_PRIVATE_KEY`, lipește exact valoarea din `.env` (cu `\n`-uri)
4. **Redeploy** ca să preia noile env vars

---

## 7. Testează

**Local:**
1. Repornește dev serverul (`npm run dev`) ca să citească env-urile noi
2. Trimite o programare prin formularul public
3. Verifică în Google Calendar — ar trebui să apară imediat un eveniment cu
   titlul `Nume Pacient — Serviciu`

**Din admin:**
- Buton **Sync Google Calendar** din tabelul de programări → sincronizează în
  bulk programările vechi care nu au `googleEventId`
- Edit / Cancel programare → calendarul se actualizează automat (update sau delete)

---

## Troubleshooting

| Simptom | Cauză probabilă | Fix |
|---|---|---|
| Programarea se salvează dar nu apare în calendar | Service account nu are permisiune pe calendar | Repetă pasul 4 — verifică emailul |
| Eroare `invalid_grant` în log | Private key corupt (newline-uri rupte) | Re-copiază exact din JSON, păstrează `\n` literali |
| Eroare `Calendar not found` | Calendar ID greșit | Re-copiază de la pasul 4.8 |
| Eveniment apare la oră greșită | Timezone diferit | Codul folosește `Europe/Chisinau` — schimbă în `lib/google-calendar.ts` dacă e nevoie |

---

## Ce se sincronizează automat

| Acțiune în site | Acțiune în Google Calendar |
|---|---|
| Pacient trimite formularul | Event creat (60 min, pe ora preferată) |
| Admin schimbă status în CANCELLED | Event șters |
| Admin schimbă data/ora/serviciu/etc | Event actualizat |
| Admin șterge programarea complet | Event șters |
| Admin click pe Sync Calendar | Sincronizează toate programările PENDING/CONFIRMED fără `googleEventId` |
