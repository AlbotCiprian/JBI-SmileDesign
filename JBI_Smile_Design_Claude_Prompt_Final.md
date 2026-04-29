# Claude Code Prompt — JBI Smile Design Premium Dental Website + Booking System

## Context general

Vreau să dezvoltăm un website premium pentru clinica stomatologică **JBI Smile Design** din Chișinău.

Website-ul trebuie să fie construit modern, în **Next.js / React / TypeScript**, fără WordPress, fără template WordPress, fără copiere directă a unui design existent.

Website de referință pentru direcție vizuală și UX:

- https://mydentalclinic.md/

Foarte important: **nu copia designul acestui website**, dar folosește-l ca referință pentru a înțelege nivelul dorit: landing page modern, clar, premium, cu secțiuni bine definite, imagine profesională, call-to-action-uri vizibile, prezentare bună a serviciilor și focus pe conversie.

Vreau ca website-ul JBI Smile Design să fie chiar mai bine optimizat ca spațiere, structură, animații, mobile UX și sistem de programări.

---

## Stack tehnic obligatoriu

Folosește:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion pentru animații
- PostgreSQL pe Neon
- Prisma ORM
- Resend pentru trimiterea emailurilor
- Google reCAPTCHA Enterprise / v4 ready
- Google Calendar API pentru sincronizarea programărilor
- NextAuth sau autentificare custom pentru admin panel
- Zod pentru validări
- React Hook Form pentru formulare
- Fără WordPress

---

## Branding JBI Smile Design

Folosește culorile brandului din logo și imaginile atașate.

### Paletă recomandată

- Navy medical: `#0B1F3A`
- Blue JBI: `#005BBB`
- Electric blue accent: `#1687FF`
- Soft blue background: `#EAF4FF`
- White: `#FFFFFF`
- Light gray: `#F6F8FB`
- Warm champagne / beige: `#D8C3A5`
- Dark text: `#101828`

Designul trebuie să fie:

- medical premium
- clean
- modern
- aerisit
- luminos
- cu animații subtile
- cu multe spații albe
- foarte bun pe mobile
- orientat pe încredere și conversie

---

## Date reale clinică

Integrează aceste date în website:

### Nume clinică

**JBI Smile Design**

### Categorie

Medicină și sănătate / Clinică stomatologică

### Adresă

Grenoble 257, Chișinău, Moldova, 2072

### Telefon mobil

0601 18 991

### WhatsApp

+373 601 18 991

### Email

smiledesignsrl@yahoo.com

### Limbi vorbite

Română, Engleză, Rusă

---

## Imagini și resurse

În proiect vor exista imagini atașate în folderul de assets. Folosește-le prioritar:

- logo JBI Smile Design
- logo pentru favicon / browser tab
- imagine cu recepția / lobby
- imagine cu logo luminos JBI
- imagine cu echipa la recepție
- imagine cover Smile Design
- imagine cu serviciile stomatologice

Cerințe:

- setează favicon-ul din logo-ul JBI
- folosește logo-ul în header și footer
- folosește imaginea cu recepția în hero sau about section
- folosește imaginea cu echipa în secțiunea de încredere / echipă
- folosește imaginea cu serviciile în secțiunea servicii, dar redesenează vizual serviciile în carduri moderne
- unde lipsesc imagini, folosește placeholder-uri open-source medical/dental, dar marchează clar în cod că sunt temporare

---

# Obiectiv website

Creează un website one-page / landing page premium pentru JBI Smile Design, cu posibilitate de extindere ulterioară într-un website complet cu pagini separate.

Website-ul trebuie să vândă încredere, profesionalism și confort.

Focus principal:

1. Pacientul înțelege rapid cine este clinica.
2. Pacientul vede serviciile principale.
3. Pacientul vede poze reale și recenzii.
4. Pacientul poate programa ușor o consultație.
5. Clinica primește programarea pe email și în admin panel.
6. Programarea se poate sincroniza cu Google Calendar.

---

# Structură Landing Page

## 1. Loading Screen animat

La încărcarea website-ului, creează o animație scurtă de 1.5–2 secunde.

Concept:

- apare un dinte trist / neutru
- se transformă într-un dinte zâmbitor
- apare logo-ul JBI Smile Design
- fade elegant către website

Folosește Framer Motion.

Loading-ul trebuie să fie premium, nu copilăresc, nu prea lung.

---

## 2. Header sticky premium

Header modern, sticky.

Desktop:

- logo JBI Smile Design în stânga
- meniu: Acasă, Servicii, Despre noi, Echipă, Recenzii, Video, Contact
- buton CTA: `Programează-te`
- buton secundar / icon: WhatsApp

Mobile:

- logo
- hamburger menu
- CTA sticky jos: `Sună acum` + `Programează-te`

Header-ul trebuie să fie transparent în hero și să devină solid / blur glass la scroll.

---

## 3. Hero Section

Inspirat ca nivel de prezentare de la mydentalclinic.md, dar în stilul JBI Smile Design.

Titlu recomandat:

`JBI Smile Design — zâmbetul tău, creat cu grijă și precizie`

Subtitle:

`Clinicǎ stomatologică modernă în Chișinău, cu servicii complete, comunicare clară și tratamente personalizate pentru fiecare pacient.`

CTA principal:

`Programează o consultație`

CTA secundar:

`Scrie pe WhatsApp`

Elemente de încredere în hero:

- `Grenoble 257, Chișinău`
- `RO / EN / RU`
- `Programări rapide`
- `Servicii stomatologice complete`

Design:

- layout 2 coloane pe desktop
- imagine reală din clinică în dreapta
- card flotant cu rating / contact
- animații subtile la intrare
- pe mobile: text sus, imagine jos, CTA-uri mari

---

## 4. Secțiune Servicii

Serviciile trebuie prezentate într-un grid modern, nu ca o imagine statică.

Servicii obligatorii:

1. Terapie dentară  
   Tratamentul cariilor

2. Endodonție  
   Tratament de canal

3. Ortodonție  
   Aparat dentar

4. Implantologie dentară

5. Protetică dentară

6. Tratamente parodontale

7. Stomatologie pediatrică

8. Estetică dentară

Fiecare card trebuie să conțină:

- icon / ilustrație dentală
- titlu
- descriere scurtă
- micro animație la hover
- buton `Află mai multe`
- buton / link `Programează-te`

Pe mobile, cardurile trebuie să fie foarte clare și ușor de apăsat.

---

## 5. Secțiune Despre clinică

Text orientativ:

`JBI Smile Design este o clinică stomatologică din Chișinău, creată pentru pacienții care caută tratamente moderne, comunicare clară și o experiență medicală confortabilă. Punem accent pe diagnostic corect, tratamente personalizate și relație de încredere cu fiecare pacient.`

Include imagine cu recepția / lobby.

Mini carduri:

- Abordare personalizată
- Mediu modern și curat
- Comunicare RO / EN / RU
- Soluții complete pentru familie

---

## 6. Secțiune Echipă / Încredere

Folosește imaginea cu echipa la recepție.

Creează o secțiune elegantă:

Titlu:

`O echipă aproape de pacient`

Text:

`La JBI Smile Design, pacientul primește explicații clare, tratament atent și suport la fiecare etapă.`

Adaugă carduri de încredere:

- comunicare clară
- grijă față de confort
- plan de tratament personalizat
- tratamente pentru adulți și copii

---

## 7. Etapele consultației

Creează timeline animat cu 6 pași:

1. Contact și programare
2. Consultație inițială
3. Diagnostic și analiză
4. Plan de tratament personalizat
5. Tratament
6. Recomandări și monitorizare

Design:

- pe desktop: timeline orizontal sau carduri numerotate
- pe mobile: timeline vertical
- animații la scroll

---

## 8. Video / Facebook Reel Section

Creează secțiune `Video din clinică`.

Integrează iframe-ul:

```html
<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2202953823788455%2F&show_text=false&width=267&t=0" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
```

Design:

- video într-un frame de telefon
- text lângă video: `Vezi atmosfera din JBI Smile Design`
- pregătește componenta să poată primi mai multe video-uri în viitor

---

## 9. Google Reviews / Review Section

Creează o secțiune premium de recenzii.

Pentru MVP:

- date hardcodate în `/lib/data.ts`
- avatar
- nume
- rating
- text
- icon Google
- carousel responsive

Ulterior:

- pregătește API pentru Google Places Reviews

Text secțiune:

`Pacienții noștri apreciază profesionalismul, comunicarea și confortul experienței în clinică.`

Include buton:

`Lasă o recenzie pe Google`

---

## 10. Formular de programare

Creează formular modern, compact, foarte clar.

Câmpuri:

- Nume complet
- Telefon
- Email
- Serviciu dorit
- Data preferată
- Ora preferată
- Mesaj opțional
- Checkbox acord GDPR

Buton:

`Trimite programarea`

După submit:

- validare client-side cu React Hook Form + Zod
- execută reCAPTCHA
- trimite datele către API
- salvează programarea în PostgreSQL Neon
- trimite email prin Resend către clinică
- opțional trimite email de confirmare către pacient
- creează eveniment în Google Calendar dacă env este configurat
- afișează mesaj de succes

---

# Backend / Sistem programări

## Bază de date Neon PostgreSQL + Prisma

Creează schema Prisma pentru programări:

```prisma
model Appointment {
  id             String   @id @default(cuid())
  fullName       String
  phone          String
  email          String?
  service        String
  preferredDate  DateTime
  preferredTime  String?
  message        String?
  status         AppointmentStatus @default(PENDING)
  googleEventId  String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

API routes:

- `POST /api/appointment` — create appointment
- `GET /api/admin/appointments` — list appointments admin only
- `PATCH /api/admin/appointments/:id` — update appointment status
- `POST /api/admin/appointments/:id/sync-calendar` — sync with Google Calendar
- `POST /api/appointment/resend` — resend confirmation email

---

## Resend email integration

Folosește Resend pentru trimiterea emailurilor.

Email către clinică:

To: `smiledesignsrl@yahoo.com`

Subject:

`Programare nouă — JBI Smile Design`

Conținut:

- nume pacient
- telefon
- email
- serviciu
- data preferată
- ora preferată
- mesaj
- data trimiterii

Email către pacient:

Subject:

`Am primit solicitarea ta de programare — JBI Smile Design`

Conținut:

- mulțumire
- detalii programare
- clinică: Grenoble 257, Chișinău
- telefon / WhatsApp
- mențiune că echipa va confirma ora exactă

Env:

```env
RESEND_API_KEY=
APPOINTMENT_TO_EMAIL=smiledesignsrl@yahoo.com
```

---

## Google reCAPTCHA

Implementează reCAPTCHA ready.

Env:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

Cerințe:

- token generat pe client
- verificare server-side înainte de salvarea programării
- dacă tokenul e invalid, returnează eroare
- lasă comentarii clare unde trebuie puse cheile

---

## Google Calendar Sync

Pregătește integrarea cu Google Calendar.

La creare programare:

- dacă env-urile Google Calendar sunt setate, creează event în calendar
- dacă nu sunt setate, salvează doar programarea în DB și marchează `googleEventId = null`

Event calendar:

Title:

`Programare JBI Smile Design — [Nume pacient]`

Description:

- telefon
- email
- serviciu
- mesaj

Location:

`Grenoble 257, Chișinău, Moldova, 2072`

Env:

```env
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
```

---

# Admin Panel SaaS Style

Creează sau pregătește un admin panel basic, dar extensibil.

Route:

`/admin`

Funcționalități MVP:

- login admin
- dashboard cu statistici
- listă programări
- status programare: Pending / Confirmed / Cancelled / Completed
- detalii programare
- buton `Confirmă`
- buton `Anulează`
- buton `Sync Google Calendar`
- căutare după nume / telefon / email
- filtrare după status
- filtrare după dată

Design admin:

- stil SaaS modern
- sidebar
- cards
- tabel curat
- responsive desktop-first pentru admin

Autentificare:

- NextAuth Credentials sau sistem custom simplu
- user admin creat prin seed Prisma

Prisma AdminUser:

```prisma
model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
}
```

Folosește bcrypt pentru parolă.

---

# Cookie Consent

Creează componentă `CookieConsent.tsx`.

Cerințe:

- apare la prima vizită
- butoane: Acceptă, Refuză, Setări
- salvează alegerea în localStorage
- design în culorile JBI
- linkuri către Privacy Policy și Cookie Policy

---

# Contact Section

Integrează datele reale:

- Grenoble 257, Chișinău, Moldova, 2072
- 0601 18 991
- +373 601 18 991
- smiledesignsrl@yahoo.com
- Limbi: Română, Engleză, Rusă

Butoane:

- Sună acum
- Scrie pe WhatsApp
- Trimite email
- Vezi pe hartă

Google Maps embed pentru adresă.

---

# Footer

Footer dark navy, premium.

Conține:

- logo
- descriere scurtă
- social icons: Instagram, Facebook, YouTube, LinkedIn
- date contact
- linkuri rapide
- legal links
- copyright

Social links temporar `#` dacă nu există linkuri finale.

---

# SEO

Configurează metadata:

```ts
export const metadata = {
  title: "JBI Smile Design | Clinică stomatologică în Chișinău",
  description: "Clinică stomatologică modernă în Chișinău. Terapie dentară, endodonție, ortodonție, implantologie, protetică și estetică dentară.",
}
```

Adaugă:

- favicon din logo
- OpenGraph image
- JSON-LD LocalBusiness / Dentist
- alt text la toate imaginile
- semantic HTML

---

# Structură fișiere recomandată

```txt
/src
  /app
    layout.tsx
    page.tsx
    /admin
      page.tsx
      /appointments
        page.tsx
    /api
      /appointment
        route.ts
      /appointment/resend
        route.ts
      /admin/appointments
        route.ts
      /admin/appointments/[id]
        route.ts
      /admin/appointments/[id]/sync-calendar
        route.ts
  /components
    LoadingScreen.tsx
    Header.tsx
    Hero.tsx
    Services.tsx
    AboutClinic.tsx
    TeamTrust.tsx
    ProcessSteps.tsx
    VideoSection.tsx
    GoogleReviewsSection.tsx
    AppointmentForm.tsx
    CookieConsent.tsx
    ContactSection.tsx
    Footer.tsx
    MobileStickyCTA.tsx
  /components/admin
    AdminLayout.tsx
    AppointmentsTable.tsx
    AppointmentDetails.tsx
    StatusBadge.tsx
  /lib
    prisma.ts
    resend.ts
    recaptcha.ts
    googleCalendar.ts
    data.ts
    auth.ts
  /prisma
    schema.prisma
    seed.ts
  /public
    /images
```

---

# Env example

Creează `.env.example`:

```env
DATABASE_URL="postgresql://..."

RESEND_API_KEY=""
APPOINTMENT_TO_EMAIL="smiledesignsrl@yahoo.com"

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=""
RECAPTCHA_SECRET_KEY=""

GOOGLE_CLIENT_EMAIL=""
GOOGLE_PRIVATE_KEY=""
GOOGLE_CALENDAR_ID=""

ADMIN_EMAIL="admin@jbismiledesign.md"
ADMIN_PASSWORD="change-me"
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
```

---

# UX rules obligatorii

- mobile-first
- spațiu aerisit între secțiuni
- CTA-uri clare
- butoane mari pe mobile
- sticky mobile contact bar
- animații fine, nu exagerate
- performanță bună
- imagini optimizate
- design premium, nu generic
- nu copia website-ul de referință
- păstrează culorile JBI Smile Design
- cod modular și curat

---

# Priorități de implementare

## Faza 1 — Landing page frontend

1. Layout general
2. Header + hero
3. servicii
4. despre clinică
5. proces consultație
6. video section
7. reviews section
8. contact + footer
9. loading animation
10. cookie consent

## Faza 2 — Programări

1. formular programare
2. validări
3. reCAPTCHA
4. API appointment
5. Neon PostgreSQL + Prisma
6. Resend email către clinică
7. email confirmare pacient

## Faza 3 — Admin panel

1. login admin
2. dashboard
3. listă programări
4. detalii programare
5. status update
6. filtrare / search

## Faza 4 — Google Calendar

1. env setup
2. helper google calendar
3. create event
4. save googleEventId
5. manual sync din admin

---

# Output dorit de la Claude Code

Generează proiectul complet sau implementează incremental în repo existent.

Codul trebuie să fie:

- curat
- modular
- production-ready
- ușor de extins
- documentat prin comentarii acolo unde sunt integrări externe

La final, oferă instrucțiuni clare:

- cum instalez dependențele
- cum configurez `.env.local`
- cum rulez Prisma migration
- cum fac seed pentru admin
- cum pornesc proiectul local
- cum testez formularul de programare

