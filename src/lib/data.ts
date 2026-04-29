export const clinic = {
  name: "JBI Smile Design",
  tagline: "Zâmbetul tău, creat cu grijă și precizie",
  shortDescription:
    "Clinică stomatologică modernă în Chișinău, cu servicii complete, comunicare clară și tratamente personalizate pentru fiecare pacient.",
  address: {
    street: "Grenoble 257",
    city: "Chișinău",
    country: "Moldova",
    postalCode: "2072",
    full: "Grenoble 257, Chișinău, Moldova, 2072",
    mapsQuery: "Grenoble 257, Chișinău, Moldova",
  },
  phone: {
    local: "0601 18 991",
    international: "+373 601 18 991",
    tel: "+37360118991",
    whatsapp: "37360118991",
  },
  email: "smiledesignsrl@yahoo.com",
  languages: ["Română", "Engleză", "Rusă"],
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61572011122070",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
  whatsappLink:
    "https://wa.me/37360118991?text=" +
    encodeURIComponent("Bună ziua! Aș dori să programez o consultație la JBI Smile Design."),
};

export type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  description: string;
};

export const services: ServiceItem[] = [
  {
    slug: "terapie-dentara",
    title: "Terapie dentară",
    short: "Tratamentul cariilor",
    description:
      "Diagnostic precis al cariilor și restaurări estetice durabile, cu materiale de înaltă calitate.",
  },
  {
    slug: "endodontie",
    title: "Endodonție",
    short: "Tratament de canal",
    description:
      "Tratamente endodontice moderne, sub microscop, pentru păstrarea dintelui natural.",
  },
  {
    slug: "ortodontie",
    title: "Ortodonție",
    short: "Aparat dentar",
    description:
      "Aparate dentare fixe și mobile, plus alinieri invizibile pentru un zâmbet perfect.",
  },
  {
    slug: "implantologie",
    title: "Implantologie dentară",
    short: "Implant + coroană",
    description:
      "Soluții complete de implantare cu planificare digitală și recuperare confortabilă.",
  },
  {
    slug: "protetica",
    title: "Protetică dentară",
    short: "Coroane, punți, fațete",
    description:
      "Restaurări protetice estetice și funcționale, realizate cu tehnologii moderne.",
  },
  {
    slug: "parodontologie",
    title: "Tratamente parodontale",
    short: "Sănătatea gingiilor",
    description:
      "Prevenție și tratament al bolilor parodontale pentru gingii sănătoase pe termen lung.",
  },
  {
    slug: "pediatrica",
    title: "Stomatologie pediatrică",
    short: "Pentru cei mici",
    description:
      "Abordare blândă și prietenoasă pentru copii, într-un mediu calm și sigur.",
  },
  {
    slug: "estetica",
    title: "Estetică dentară",
    short: "Albire & fațete",
    description:
      "Albire profesională, fațete ceramice și tratamente estetice pentru un zâmbet luminos.",
  },
];

export const processSteps = [
  { n: 1, title: "Contact și programare", text: "Ne scrii sau ne suni — alegem împreună o oră potrivită." },
  { n: 2, title: "Consultație inițială", text: "Discutăm despre nevoi, așteptări și istoricul tău dentar." },
  { n: 3, title: "Diagnostic și analiză", text: "Examinare clinică și imagistică pentru un diagnostic exact." },
  { n: 4, title: "Plan de tratament", text: "Îți prezentăm un plan personalizat, cu opțiuni și costuri clare." },
  { n: 5, title: "Tratament", text: "Etape confortabile, cu explicații pe tot parcursul." },
  { n: 6, title: "Recomandări și monitorizare", text: "Indicații de îngrijire și controale periodice pentru rezultate de durată." },
];

export const reviews = [
  {
    name: "Ana M.",
    rating: 5,
    text: "Echipă super profesionistă, clinica e impecabilă și totul a decurs fără durere. Recomand cu drag!",
    initials: "AM",
  },
  {
    name: "Victor C.",
    rating: 5,
    text: "Cea mai bună experiență pe care am avut-o la stomatolog. Explicații clare și rezultat excelent.",
    initials: "VC",
  },
  {
    name: "Elena P.",
    rating: 5,
    text: "Atmosferă caldă, personal atent. Copilul meu a fost relaxat de la prima vizită.",
    initials: "EP",
  },
  {
    name: "Dmitri R.",
    rating: 5,
    text: "Foarte mulțumit de tratamentul de implantologie. Profesionalism la cel mai înalt nivel.",
    initials: "DR",
  },
];

export const trustBadges = [
  { label: "Grenoble 257, Chișinău" },
  { label: "RO / EN / RU" },
  { label: "Programări rapide" },
  { label: "Servicii complete" },
];

export const navItems = [
  { href: "#acasa", label: "Acasă" },
  { href: "#servicii", label: "Servicii" },
  { href: "#despre", label: "Despre noi" },
  { href: "#echipa", label: "Echipă" },
  { href: "#recenzii", label: "Recenzii" },
  { href: "#video", label: "Video" },
  { href: "#contact", label: "Contact" },
];
