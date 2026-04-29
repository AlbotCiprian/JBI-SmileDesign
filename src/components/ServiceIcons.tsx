import type { SVGProps } from "react";

/**
 * Iconițe SVG inspirate din setul oficial JBI Smile Design (Servicii.jpg).
 * Toate folosesc stroke albastru #005BBB peste fill alb și au curba JBI sub icon.
 */

type IconProps = SVGProps<SVGSVGElement>;

const stroke = "#005BBB";
const accent = "#1687FF";

function IconShell({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="48" r="46" fill="#EAF4FF" opacity="0.6" />
      {children}
      {/* JBI half-curve signature under icon */}
      <path
        d="M14 70 Q50 96 86 70"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function IconTerapie(props: IconProps) {
  return (
    <IconShell {...props}>
      <path
        d="M50 20 c-12 0 -20 8 -18 22 c1 10 4 20 8 26 c3 4 6 -2 10 -10 c4 8 7 14 10 10 c4 -6 7 -16 8 -26 c2 -14 -6 -22 -18 -22z"
        stroke={stroke}
        strokeWidth="2.5"
        fill="white"
      />
      <path d="M44 33 q4 -4 10 0 q-2 4 -10 0z" fill={accent} />
      <path d="M58 28 l3 -3 m0 0 l-2 4 m2 -4 l-2 -2" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
    </IconShell>
  );
}

export function IconEndodontie(props: IconProps) {
  return (
    <IconShell {...props}>
      <path
        d="M50 22 c-12 0 -20 8 -18 22 c1 10 4 20 8 26 c3 4 6 -2 10 -10 c4 8 7 14 10 10 c4 -6 7 -16 8 -26 c2 -14 -6 -22 -18 -22z"
        stroke={stroke}
        strokeWidth="2.5"
        fill="white"
      />
      <line x1="50" y1="14" x2="50" y2="40" stroke={accent} strokeWidth="2" />
      <circle cx="50" cy="12" r="3" fill={stroke} />
      <path d="M44 42 q6 -4 12 0 l0 14 q-6 -3 -12 0z" fill={accent} opacity="0.8" />
    </IconShell>
  );
}

export function IconOrtodontie(props: IconProps) {
  return (
    <IconShell {...props}>
      {[28, 42, 56, 70].map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y="34" width="10" height="22" rx="2" stroke={stroke} strokeWidth="2" fill="white" />
          <rect x={x - 3} y="40" width="6" height="6" rx="1" fill={accent} />
        </g>
      ))}
      <path d="M22 44 h56" stroke={stroke} strokeWidth="2" />
    </IconShell>
  );
}

export function IconImplant(props: IconProps) {
  return (
    <IconShell {...props}>
      <path
        d="M50 22 c-9 0 -14 6 -14 14 c0 4 2 8 4 11 l20 0 c2 -3 4 -7 4 -11 c0 -8 -5 -14 -14 -14z"
        stroke={stroke}
        strokeWidth="2.5"
        fill="white"
      />
      <line x1="38" y1="50" x2="62" y2="50" stroke={stroke} strokeWidth="2" />
      <path d="M46 54 l8 0 l0 6 l-8 0z M46 62 l8 0 l0 6 l-8 0z M46 70 l8 0 l0 6 l-8 0z M46 78 l4 6 l4 -6z" fill={accent} stroke={stroke} strokeWidth="1.5" />
    </IconShell>
  );
}

export function IconProtetica(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M22 60 q28 -10 56 0 l0 8 q-28 6 -56 0z" fill={accent} opacity="0.7" stroke={stroke} strokeWidth="2" />
      <path
        d="M36 28 c-7 0 -11 4 -10 12 c1 8 3 16 6 20 c2 2 4 -2 6 -6 c2 4 4 8 6 6 c3 -4 5 -12 6 -20 c1 -8 -7 -12 -14 -12z"
        stroke={stroke}
        strokeWidth="2"
        fill="white"
      />
      <path
        d="M64 28 c-7 0 -15 4 -14 12 c1 8 3 16 6 20 c2 2 4 -2 6 -6 c2 4 4 8 6 6 c3 -4 5 -12 6 -20 c1 -8 -3 -12 -10 -12z"
        stroke={stroke}
        strokeWidth="2"
        fill="white"
      />
    </IconShell>
  );
}

export function IconParodontale(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M14 56 q36 -8 72 0 l0 18 q-36 6 -72 0z" fill={accent} opacity="0.4" />
      {[20, 30, 40, 60, 70, 80].map((x) => (
        <circle key={x} cx={x} cy="62" r="1.2" fill={stroke} />
      ))}
      <path
        d="M50 22 c-11 0 -18 7 -16 18 c1 9 4 18 7 23 c3 4 5 -2 9 -9 c4 7 6 13 9 9 c3 -5 6 -14 7 -23 c2 -11 -5 -18 -16 -18z"
        stroke={stroke}
        strokeWidth="2.5"
        fill="white"
      />
      <path d="M40 56 l4 12 M50 56 l0 14 M60 56 l-4 12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </IconShell>
  );
}

export function IconPediatrica(props: IconProps) {
  return (
    <IconShell {...props}>
      <circle cx="42" cy="46" r="18" stroke={stroke} strokeWidth="2.5" fill="white" />
      <path d="M30 42 q4 -4 8 0 M46 42 q4 -4 8 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M34 52 q8 8 16 0" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 28 q-2 -8 8 -10" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path
        d="M70 38 c-5 0 -8 4 -7 9 c1 5 2 9 4 11 c1 1 2 -1 3 -4 c1 3 2 5 3 4 c2 -2 3 -6 4 -11 c1 -5 -2 -9 -7 -9z"
        stroke={stroke}
        strokeWidth="2"
        fill={accent}
        opacity="0.6"
      />
    </IconShell>
  );
}

export function IconEstetica(props: IconProps) {
  return (
    <IconShell {...props}>
      <path
        d="M50 18 c-13 0 -22 9 -20 24 c1 11 4 22 9 28 c3 5 6 -2 11 -11 c5 9 8 16 11 11 c5 -6 8 -17 9 -28 c2 -15 -7 -24 -20 -24z"
        stroke={stroke}
        strokeWidth="2.5"
        fill="white"
      />
      <path
        d="M62 28 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2z"
        fill={accent}
      />
      <circle cx="38" cy="44" r="2" fill={accent} opacity="0.7" />
    </IconShell>
  );
}

export const ServiceIconBySlug: Record<string, (p: IconProps) => React.JSX.Element> = {
  "terapie-dentara": IconTerapie,
  "endodontie": IconEndodontie,
  "ortodontie": IconOrtodontie,
  "implantologie": IconImplant,
  "protetica": IconProtetica,
  "parodontologie": IconParodontale,
  "pediatrica": IconPediatrica,
  "estetica": IconEstetica,
};
