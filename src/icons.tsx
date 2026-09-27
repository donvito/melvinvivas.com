import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number | undefined, props: P) => ({
  width: size ?? 32,
  height: size ?? 32,
  viewBox: '0 0 32 32',
  ...props,
})

export function ComputerIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <defs>
        <linearGradient id="mon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ab0ff" />
          <stop offset="1" stopColor="#1a4fd6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="26" height="18" rx="2" fill="#d8dde6" stroke="#6c7890" />
      <rect x="5" y="5" width="22" height="14" fill="url(#mon)" />
      <path d="M6 6 L26 6 L26 12 Q16 15 6 12Z" fill="#fff" opacity=".22" />
      <rect x="12" y="22" width="8" height="3" fill="#a8b0be" />
      <rect x="8" y="25" width="16" height="3" rx="1" fill="#c8cfda" stroke="#6c7890" />
    </svg>
  )
}

export function FolderIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <defs>
        <linearGradient id="fold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe89a" />
          <stop offset="1" stopColor="#f0b830" />
        </linearGradient>
      </defs>
      <path d="M3 8 h9 l2 3 h15 v15 a1 1 0 0 1 -1 1 h-24 a1 1 0 0 1 -1 -1z" fill="#d9a521" stroke="#9a6d05" />
      <path d="M3 12 h26 v14 a1 1 0 0 1 -1 1 h-24 a1 1 0 0 1 -1 -1z" fill="url(#fold)" stroke="#b8860b" />
    </svg>
  )
}

export function IEIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <defs>
        <linearGradient id="ie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5db7ff" />
          <stop offset="1" stopColor="#0b53c8" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="11" fill="url(#ie)" />
      <path d="M11 16 h9 M11 16 a5 5 0 0 1 9 -3 M11 16 a5 5 0 0 0 9 3" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M4 22 C10 6 30 2 29 8 C28 12 22 16 14 22 C10 25 5 26 4 22Z" fill="none" stroke="#ffcf3f" strokeWidth="2" />
    </svg>
  )
}

export function NotepadIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <path d="M7 3 h14 l5 5 v21 h-19z" fill="#fff" stroke="#6b7a90" />
      <path d="M21 3 v5 h5" fill="#dfe6f2" stroke="#6b7a90" />
      <g stroke="#7d8aa6" strokeWidth="1.2">
        <path d="M10 12 h12 M10 15 h12 M10 18 h12 M10 21 h8" />
      </g>
      <rect x="4" y="4" width="4" height="26" fill="#3a76d8" stroke="#24519a" />
    </svg>
  )
}

export function MediaIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <defs>
        <linearGradient id="med" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb457" />
          <stop offset="1" stopColor="#f26a1b" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="url(#med)" stroke="#a84a0c" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#fff" strokeOpacity=".5" />
      <path d="M13 10 l9 6 l-9 6z" fill="#fff" />
    </svg>
  )
}

export function MailIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="3" y="8" width="26" height="17" rx="1.5" fill="#f8fbff" stroke="#5f7aa8" />
      <path d="M3 9 l13 9 l13 -9" fill="none" stroke="#5f7aa8" strokeWidth="1.3" />
      <path d="M4 9 l12 8 l12 -8" fill="#dbe8ff" />
      <path d="M3 25 l10 -9 M29 25 l-10 -9" stroke="#5f7aa8" strokeWidth="1" />
    </svg>
  )
}

export function ResumeIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <path d="M6 3 h15 l5 5 v21 h-20z" fill="#fff" stroke="#6b7a90" />
      <path d="M21 3 v5 h5" fill="#dfe6f2" stroke="#6b7a90" />
      <circle cx="12" cy="13" r="3" fill="#3a76d8" />
      <path d="M8 21 c0 -3 8 -3 8 0z" fill="#3a76d8" />
      <path d="M18 12 h6 M18 15 h6 M9 24 h14 M9 27 h10" stroke="#8b98b2" strokeWidth="1.2" />
    </svg>
  )
}

export function RecycleIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <path d="M8 9 h16 l-2 20 h-12z" fill="#e8f2ff" stroke="#5f7aa8" />
      <path d="M8 9 h16 l-2 20 h-12z" fill="#7fb2f0" opacity=".35" />
      <rect x="6" y="6" width="20" height="3" rx="1" fill="#c7d7f0" stroke="#5f7aa8" />
      <path d="M12 12 v14 M16 12 v14 M20 12 v14" stroke="#5f7aa8" strokeOpacity=".6" />
      <path d="M13 4 h6 v2 h-6z" fill="#c7d7f0" stroke="#5f7aa8" />
    </svg>
  )
}

export function MinesIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#808080" />
      <circle cx="16" cy="17" r="7" fill="#222" />
      <path d="M16 6 v22 M5 17 h22 M8 9 l16 16 M24 9 l-16 16" stroke="#222" strokeWidth="2" />
      <circle cx="13.5" cy="14.5" r="2" fill="#fff" />
    </svg>
  )
}

export function CalcIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="6" y="2" width="20" height="28" rx="2" fill="#ece9d8" stroke="#6f6f6f" />
      <rect x="8.5" y="4.5" width="15" height="6" fill="#d9f3d1" stroke="#7d9a72" />
      <g fill="#4b70b8">
        <rect x="8.5" y="13" width="4" height="3.5" />
        <rect x="14" y="13" width="4" height="3.5" />
        <rect x="19.5" y="13" width="4" height="3.5" fill="#c94f2a" />
        <rect x="8.5" y="18" width="4" height="3.5" />
        <rect x="14" y="18" width="4" height="3.5" />
        <rect x="19.5" y="18" width="4" height="3.5" fill="#c94f2a" />
        <rect x="8.5" y="23" width="9.5" height="3.5" />
        <rect x="19.5" y="23" width="4" height="3.5" fill="#2e8b3c" />
      </g>
    </svg>
  )
}

export function CardsIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#2e8b3c" />
      <rect x="6" y="9" width="13" height="18" rx="1.5" fill="#3a63c9" stroke="#fff" transform="rotate(-12 12 18)" />
      <rect x="13" y="6" width="13" height="18" rx="1.5" fill="#fff" stroke="#888" />
      <path d="M19.5 11 c-2 -3 -5 0 -3 2.2 l3 3 l3 -3 c2 -2.2 -1 -5.2 -3 -2.2z" fill="#d22" />
      <text x="14.5" y="22.5" fontSize="6" fontFamily="Arial" fontWeight="bold" fill="#d22">
        A
      </text>
    </svg>
  )
}

export function ShortcutIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <circle cx="16" cy="16" r="13" fill="#1a73e8" stroke="#0b3d91" />
      <ellipse cx="16" cy="16" rx="6" ry="13" fill="none" stroke="#9cc4ff" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="#9cc4ff" />
      <line x1="5" y1="10" x2="27" y2="10" stroke="#9cc4ff" />
      <line x1="5" y1="22" x2="27" y2="22" stroke="#9cc4ff" />
      <text x="16" y="20" fontSize="11" fontFamily="Arial" fontWeight="bold" fill="#fff" textAnchor="middle">
        {'</>'}
      </text>
      <rect x="2" y="22" width="8" height="8" fill="#fff" stroke="#000" />
      <path d="M4 28 l4 -4 M5 24 h3 v3" stroke="#000" fill="none" />
    </svg>
  )
}

export function PlatformerIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#5c94fc" />
      <rect x="2" y="24" width="28" height="6" fill="#c84c0c" />
      <rect x="18" y="8" width="7" height="7" fill="#f8a020" stroke="#000" />
      <rect x="9" y="12" width="8" height="3" fill="#e03030" />
      <rect x="10" y="15" width="6" height="4" fill="#f8c890" />
      <rect x="9" y="19" width="8" height="5" fill="#2040c0" />
      <text x="21.5" y="14" fontSize="6" fontFamily="Arial" fontWeight="bold" fill="#fff" textAnchor="middle">
        ?
      </text>
    </svg>
  )
}

export function PongIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#000" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="#666" strokeDasharray="2 2" />
      <rect x="5" y="9" width="2" height="8" fill="#fff" />
      <rect x="25" y="15" width="2" height="8" fill="#fff" />
      <rect x="18" y="12" width="3" height="3" fill="#fff" />
    </svg>
  )
}

export function BreakoutIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#000" />
      {['#e33', '#f93', '#3c3', '#39f'].map((c, i) => (
        <g key={c}>
          <rect x="4" y={5 + i * 3} width="7" height="2.5" fill={c} />
          <rect x="12.5" y={5 + i * 3} width="7" height="2.5" fill={c} />
          <rect x="21" y={5 + i * 3} width="7" height="2.5" fill={c} />
        </g>
      ))}
      <rect x="12" y="26" width="8" height="2" fill="#fff" />
      <circle cx="18" cy="22" r="1.5" fill="#fff" />
    </svg>
  )
}

export function AsteroidsIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#000" />
      <path d="M16 8 l5 12 l-5 -3 l-5 3 z" fill="none" stroke="#fff" />
      <path d="M5 8 l4 -2 l3 3 l-1 4 l-4 1 l-2 -3 z" fill="none" stroke="#aaa" />
      <path d="M22 20 l4 -1 l2 3 l-1 4 l-4 0 l-2 -3 z" fill="none" stroke="#aaa" />
      <circle cx="9" cy="24" r="0.7" fill="#fff" />
      <circle cx="26" cy="7" r="0.7" fill="#fff" />
    </svg>
  )
}

export function PhoenixIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#000" />
      <path d="M16 7 l-3 3 l-6 -2 l5 5 z" fill="#ff9040" />
      <path d="M16 7 l3 3 l6 -2 l-5 5 z" fill="#ff9040" />
      <ellipse cx="16" cy="10" rx="2" ry="3.5" fill="#ffe060" />
      <path d="M16 21 l-4 6 h8 z" fill="#e0e0ff" />
      <rect x="15.3" y="15" width="1.4" height="5" fill="#ffff80" />
      <circle cx="7" cy="24" r="0.7" fill="#fff" />
      <circle cx="26" cy="18" r="0.7" fill="#fff" />
    </svg>
  )
}

export function CityIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#3f9b3f" />
      <rect x="2" y="15" width="28" height="4" fill="#555" />
      <rect x="4" y="6" width="6" height="9" fill="#5a8ad8" stroke="#264d8f" />
      <rect x="12" y="9" width="7" height="6" fill="#5ac85a" stroke="#2f7a2f" />
      <rect x="21" y="4" width="7" height="11" fill="#d8b25a" stroke="#8f6b1e" />
      <rect x="5" y="21" width="9" height="7" fill="#5ac85a" stroke="#2f7a2f" />
      <rect x="17" y="21" width="10" height="7" fill="#777" stroke="#333" />
      <rect x="19" y="18" width="2" height="4" fill="#333" />
    </svg>
  )
}

export function DetectiveIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <circle cx="16" cy="16" r="13" fill="#2b6cb0" stroke="#0b3d91" />
      <path d="M7 12 q4 -4 8 -1 q2 3 -1 5 q-4 2 -7 -1z M18 18 q4 -3 7 0 q1 3 -2 4 q-4 0 -5 -2z" fill="#3f9b3f" />
      <circle cx="21" cy="11" r="6" fill="none" stroke="#fff" strokeWidth="2" />
      <line x1="25" y1="15.5" x2="30" y2="20.5" stroke="#fff" strokeWidth="3" />
      <rect x="12" y="4" width="10" height="3" fill="#a33" />
    </svg>
  )
}

export function BirdIcon({ size, ...props }: P) {
  return (
    <svg {...base(size, props)}>
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#70c5ce" />
      <rect x="2" y="24" width="28" height="6" fill="#ded895" />
      <rect x="22" y="4" width="6" height="9" fill="#73bf2e" stroke="#4e7d1e" />
      <ellipse cx="14" cy="17" rx="7" ry="5.5" fill="#f8d64e" stroke="#7a5a12" />
      <ellipse cx="10" cy="18" rx="3" ry="2" fill="#fff" stroke="#7a5a12" />
      <circle cx="17.5" cy="15.5" r="2" fill="#fff" stroke="#7a5a12" />
      <circle cx="18.2" cy="15.5" r="0.9" fill="#222" />
      <path d="M19 19 h5 l-2.5 2 z" fill="#f0742c" stroke="#7a5a12" />
    </svg>
  )
}

export function StartFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <g transform="skewY(-6) translate(0 2)">
        <rect x="1" y="1" width="8" height="8" rx="1" fill="#f65314" />
        <rect x="11" y="1" width="8" height="8" rx="1" fill="#7cbb00" />
        <rect x="1" y="11" width="8" height="8" rx="1" fill="#00a1f1" />
        <rect x="11" y="11" width="8" height="8" rx="1" fill="#ffbb00" />
      </g>
    </svg>
  )
}

export function UserAvatar({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="av" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd1ff" />
          <stop offset="1" stopColor="#1b6ad6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="6" fill="url(#av)" />
      <circle cx="24" cy="19" r="8" fill="#ffe1c4" />
      <path d="M10 42 c0 -10 28 -10 28 0z" fill="#fff" />
      <path d="M16 15 c2 -7 14 -7 16 0 c-3 -2 -13 -2 -16 0z" fill="#2b2b2b" />
    </svg>
  )
}
