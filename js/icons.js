// XP-style icon set — hand-drawn SVGs, returned by key via icon(name).
const ICONS = {
  pc: `<svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="28" rx="2" fill="#d9d4c8" stroke="#6e675a"/><rect x="8" y="10" width="32" height="22" fill="#0f6ad8"/><rect x="8" y="10" width="32" height="22" fill="url(#pcd)" opacity=".35"/><defs><linearGradient id="pcd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset=".5" stop-color="#0f6ad8" stop-opacity="0"/></linearGradient></defs><rect x="20" y="35" width="8" height="4" fill="#b3ad9f" stroke="#6e675a"/><rect x="12" y="39" width="24" height="4" rx="1" fill="#c9c3b5" stroke="#6e675a"/></svg>`,

  folder: `<svg viewBox="0 0 48 48"><path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v3H4z" fill="#e8b93b" stroke="#a07c14"/><rect x="4" y="16" width="40" height="23" rx="3" fill="#ffd75e" stroke="#a07c14"/><rect x="7" y="20" width="34" height="3" fill="#ffe9a0" opacity=".7"/></svg>`,

  docs: `<svg viewBox="0 0 48 48"><path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v3H4z" fill="#e8b93b" stroke="#a07c14"/><rect x="4" y="16" width="40" height="23" rx="3" fill="#ffd75e" stroke="#a07c14"/><path d="M14 24h20v2H14zm0 5h20v2H14zm0 5h14v2H14z" fill="#8a6d1c"/></svg>`,

  ie: `<svg viewBox="0 0 48 48"><circle cx="24" cy="26" r="15" fill="#1e6fd9"/><path d="M24 11a15 15 0 0114.6 11.6C40.6 10 34.4 6 24 6 12 6 5 15.4 5 24.5c0 1 .1 2 .3 3C7.2 17.6 15 11 24 11z" fill="#7db9f2"/><text x="24" y="36" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="27" fill="#fff">e</text><ellipse cx="24" cy="21" rx="22" ry="5.5" fill="none" stroke="#f7b500" stroke-width="2" transform="rotate(-14 24 21)"/></svg>`,

  notepad: `<svg viewBox="0 0 48 48"><rect x="9" y="5" width="30" height="38" rx="1" fill="#fff" stroke="#6e675a"/><rect x="9" y="5" width="30" height="7" fill="#d6e7f5" stroke="#6e675a"/><path d="M14 17h20M14 22h20M14 27h20M14 32h14" stroke="#9ab8d4" stroke-width="2"/><path d="M33 38l6-6v7a1 1 0 01-1 1h-5z" fill="#d6e7f5" stroke="#6e675a"/></svg>`,

  cmd: `<svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="2" fill="#0a0a0a" stroke="#6e675a"/><rect x="5" y="7" width="38" height="6" fill="#0a2463"/><text x="10" y="26" font-family="Consolas, monospace" font-size="10" fill="#fff">C:\\&gt;</text><rect x="24" y="22" width="7" height="9" fill="#fff"/></svg>`,

  mine: `<svg viewBox="0 0 48 48"><g stroke="#222" stroke-width="3"><line x1="24" y1="6" x2="24" y2="42"/><line x1="6" y1="24" x2="42" y2="24"/><line x1="11" y1="11" x2="37" y2="37"/><line x1="37" y1="11" x2="11" y2="37"/></g><circle cx="24" cy="24" r="12" fill="#333"/><ellipse cx="19" cy="19" rx="4" ry="3" fill="#888" transform="rotate(-30 19 19)"/></svg>`,

  bin: `<svg viewBox="0 0 48 48"><path d="M10 14h28l-3 29H13z" fill="#c3c7cb" stroke="#6e675a"/><path d="M10 14h28l-1 4H11z" fill="#9ea3a8"/><rect x="8" y="10" width="32" height="4" rx="1" fill="#d5d9dd" stroke="#6e675a"/><rect x="19" y="6" width="10" height="4" rx="1" fill="#d5d9dd" stroke="#6e675a"/><path d="M16 18l2 21M24 18v21M32 18l-2 21" stroke="#8d9196" stroke-width="1.6"/></svg>`,

  briefcase: `<svg viewBox="0 0 48 48"><rect x="6" y="14" width="36" height="26" rx="3" fill="#8b5a2b" stroke="#5e3a17"/><rect x="6" y="14" width="36" height="7" rx="3" fill="#a9713c" stroke="#5e3a17"/><path d="M18 14v-3a3 3 0 013-3h6a3 3 0 013 3v3" fill="none" stroke="#5e3a17" stroke-width="3"/><rect x="21" y="20" width="6" height="5" fill="#e6c367" stroke="#5e3a17"/></svg>`,

  globe: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#2e86d1" stroke="#17517f"/><path d="M6 24h36M24 6c-8 8-8 28 0 36M24 6c8 8 8 28 0 36M10 12c6 4 22 4 28 0M10 36c6-4 22-4 28 0" fill="none" stroke="#bfe0fa" stroke-width="1.6"/></svg>`,

  mail: `<svg viewBox="0 0 48 48"><rect x="6" y="11" width="36" height="26" rx="2" fill="#fff" stroke="#6e675a"/><path d="M7 12l17 13L41 12" fill="none" stroke="#6e675a" stroke-width="2"/><path d="M7 36l12-11M41 36L29 25" stroke="#c8cdd3" stroke-width="2"/></svg>`,

  help: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18" fill="#3b7fd4" stroke="#17517f"/><text x="24" y="33" text-anchor="middle" font-family="Tahoma" font-weight="bold" font-size="26" fill="#fff">?</text></svg>`,

  key: `<svg viewBox="0 0 48 48"><circle cx="16" cy="18" r="8" fill="none" stroke="#e8b93b" stroke-width="4"/><path d="M21 24l15 15M30 33l5-5M34 37l4-4" stroke="#e8b93b" stroke-width="4" fill="none"/></svg>`,

  flaglogo: `<svg viewBox="0 0 48 48"><path d="M6 8c5-2 10-2 15 0v14c-5-2-10-2-15 0z" fill="#f96702"/><path d="M23 8c5-2 12-2 19 0v14c-7-2-14-2-19 0z" fill="#8ec63f"/><path d="M6 25c5-2 10-2 15 0v14c-5-2-10-2-15 0z" fill="#05a6f0"/><path d="M23 25c5-2 12-2 19 0v14c-7-2-14-2-19 0z" fill="#fdc00e"/></svg>`,
};

function icon(name) {
  return ICONS[name] || ICONS.folder;
}
